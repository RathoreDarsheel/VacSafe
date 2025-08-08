'use server';

import { smartVaccineReminder } from '@/ai/flows/vaccine-reminder-flow';
import { z } from 'zod';
import { db } from './firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { headers } from 'next/headers';

const RiskSimulatorSchema = z.object({
  communityImmunity: z.number(),
  vaccineEfficacy: z.number(),
  initialInfected: z.number(),
});

export async function runSimulationAndGetReminder(
  values: z.infer<typeof RiskSimulatorSchema>
) {
  // 1. Mock simulation results based on input
  const { communityImmunity, vaccineEfficacy, initialInfected } = values;

  // A very basic model to generate some plausible-sounding results
  const reproductionNumber =
    (1 - (communityImmunity / 100) * (vaccineEfficacy / 100)) * 2.5;
  const projectedCases = initialInfected * Math.pow(reproductionNumber, 4);

  const simulationResults = `
    Based on the parameters, the projected basic reproduction number (R0) is approximately ${reproductionNumber.toFixed(
      2
    )}.
    Over the next 4 weeks, with an initial ${initialInfected} cases, the model projects up to ${Math.round(
    projectedCases
  )} new infections
    if no further action is taken. The healthcare system capacity is likely to be challenged.
    The most vulnerable age group appears to be 18-49 due to higher social mixing and lower recent vaccination uptake.
  `;

  // 2. Call the GenAI flow
  try {
    const reminder = await smartVaccineReminder({
      simulationResults,
      vaccinationRate: communityImmunity / 100,
      ageGroup: '18-49', // Hardcoding for this example
    });

    return { success: true, data: reminder };
  } catch (error) {
    console.error('Error calling smartVaccineReminder:', error);
    return { success: false, error: 'Failed to get recommendation from AI.' };
  }
}

const ContactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export async function submitContactForm(
  values: z.infer<typeof ContactFormSchema>
) {
  const validationResult = ContactFormSchema.safeParse(values);
  if (!validationResult.success) {
    return {
      success: false,
      error: 'Invalid form data.',
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') ?? '127.0.0.1';

  try {
    const submissionsRef = collection(db, 'feedbackSubmissions');
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const q = query(
      submissionsRef,
      where('ipAddress', '==', ip),
      where('timestamp', '>=', twentyFourHoursAgo)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: false,
        error: 'You have already submitted feedback recently. Please try again later.',
      };
    }

    // In a real app, you would save the feedback to a 'feedback' collection
    // For now, we just log it and record the submission
    console.log('New Feedback Submitted:', validationResult.data);
    
    await addDoc(submissionsRef, {
      ipAddress: ip,
      timestamp: serverTimestamp(),
    });

    return { success: true, message: 'Thank you for your feedback!' };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return {
      success: false,
      error: 'An unexpected error occurred on the server. Please try again.',
    };
  }
}
