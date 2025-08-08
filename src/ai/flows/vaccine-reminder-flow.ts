// vaccine-reminder-flow.ts
'use server';

/**
 * @fileOverview A smart vaccine reminder AI agent that reasons about outbreak
 * simulation results and determines if a vaccine reminder is necessary.
 *
 * - smartVaccineReminder - A function that initiates the vaccine reminder process.
 * - SmartVaccineReminderInput - The input type for the smartVaccineReminder function.
 * - SmartVaccineReminderOutput - The return type for the smartVaccineReminder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartVaccineReminderInputSchema = z.object({
  simulationResults: z
    .string()
    .describe('The results from the outbreak simulation.'),
  vaccinationRate: z.number().describe('The current vaccination rate in the community (0-1).'),
  ageGroup: z.string().describe('The age group for which the reminder is being considered.'),
});
export type SmartVaccineReminderInput = z.infer<typeof SmartVaccineReminderInputSchema>;

const SmartVaccineReminderOutputSchema = z.object({
  shouldRemind: z
    .boolean()
    .describe(
      'Whether a vaccine reminder should be sent based on the simulation results and vaccination rate.'
    ),
  reason: z
    .string()
    .describe(
      'The reason for the recommendation, explaining why a reminder is necessary or not.'
    ),
});
export type SmartVaccineReminderOutput = z.infer<typeof SmartVaccineReminderOutputSchema>;

export async function smartVaccineReminder(
  input: SmartVaccineReminderInput
): Promise<SmartVaccineReminderOutput> {
  return smartVaccineReminderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartVaccineReminderPrompt',
  input: {schema: SmartVaccineReminderInputSchema},
  output: {schema: SmartVaccineReminderOutputSchema},
  prompt: `You are an AI assistant designed to analyze outbreak simulation results and determine if a vaccine reminder should be sent to a specific age group.

  Here's the information you have:
  - Simulation Results: {{{simulationResults}}}
  - Current Vaccination Rate: {{{vaccinationRate}}}
  - Age Group: {{{ageGroup}}}

  Based on this information, decide if a vaccine reminder is necessary. Consider the severity of the outbreak predicted by the simulation, the current vaccination rate, and the vulnerability of the specified age group.  If the simulation indicates a high risk of outbreak, and the vaccination rate is low, recommend sending a reminder.

  Provide a clear reason for your recommendation.  If a reminder is not necessary, explain why the risk is low or the vaccination rate is sufficient. 

  Format your decision as a JSON object with 'shouldRemind' (true or false) and 'reason' fields.
  `,
});

const smartVaccineReminderFlow = ai.defineFlow(
  {
    name: 'smartVaccineReminderFlow',
    inputSchema: SmartVaccineReminderInputSchema,
    outputSchema: SmartVaccineReminderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
