'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, getDocs, collection, Timestamp, query, orderBy } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { add, format, parseISO, differenceInDays } from 'date-fns';
import { AlertCircle, CalendarClock, Loader2 } from 'lucide-react';

import { auth, db } from '@/lib/firebase';
import { vaccineList, Vaccine } from '@/lib/vaccinations';
import { UserVaccination } from './vaccination-table';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import type { Notification } from './notification-item';

type UpcomingDose = {
  vaccineName: string;
  doseNumber: number;
  dueDate: Date;
};

type UserPreferences = {
  reminderType?: 'push' | 'email';
  email?: string;
};

export function NextDoseReminder() {
  const [user] = useAuthState(auth);
  const [upcomingDoses, setUpcomingDoses] = useState<UpcomingDose[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndCalculateNextDose = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const vaccinationsDocRef = doc(db, 'userVaccinations', user.uid);

      const [userDocSnap, vaccinationsDocSnap] = await Promise.all([
        getDoc(userDocRef),
        getDoc(vaccinationsDocRef),
      ]);
      
      const userPrefs = userDocSnap.exists() ? (userDocSnap.data() as UserPreferences) : {};

      if (vaccinationsDocSnap.exists()) {
        const userVaccinations = vaccinationsDocSnap.data() as Record<string, UserVaccination>;
        let allUpcomingDoses: UpcomingDose[] = [];

        vaccineList.forEach((vaccine: Vaccine) => {
          const userData = userVaccinations[vaccine.id];
          const dosesTaken = userData ? Object.keys(userData.doses).length : 0;

          if (dosesTaken > 0 && dosesTaken < vaccine.doses) {
            const lastDoseIndex = dosesTaken - 1;
            const lastDoseTimestamp = userData.doses[lastDoseIndex];
            
            if (lastDoseTimestamp && vaccine.doseIntervalDays) {
              const lastDoseDate = typeof lastDoseTimestamp === 'string' 
                ? parseISO(lastDoseTimestamp) 
                : lastDoseTimestamp.toDate();
              
              const dueDate = add(lastDoseDate, {
                days: vaccine.doseIntervalDays,
              });
              
              const upcomingDose = {
                vaccineName: vaccine.name,
                doseNumber: dosesTaken + 1,
                dueDate: dueDate,
              };
              allUpcomingDoses.push(upcomingDose);
              checkAndSendNotification(upcomingDose, user, userPrefs);
            }
          }
        });

        if (allUpcomingDoses.length > 0) {
          allUpcomingDoses.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
          setUpcomingDoses(allUpcomingDoses);
        }
      }
      setIsLoading(false);
    };

    fetchAndCalculateNextDose();
  }, [user]);

  const checkAndSendNotification = async (dose: UpcomingDose, user: any, prefs: UserPreferences) => {
    const today = new Date();
    const daysUntilDue = differenceInDays(dose.dueDate, today);

    const timeframes = [10, 30];
    for (const days of timeframes) {
      if (daysUntilDue === days) {
        const notificationId = `notif_${user.uid}_${dose.vaccineName}_dose${dose.doseNumber}_${days}days`;
        const alreadySent = localStorage.getItem(notificationId);

        if (!alreadySent) {
          const notification: Omit<Notification, 'id'> = {
            type: prefs.reminderType || 'push',
            title: `Vaccine Reminder`,
            message: `${dose.vaccineName} (Dose ${dose.doseNumber}) is due in ${days} days on ${format(dose.dueDate, 'PPP')}.`,
            timestamp: new Date(),
            read: false,
          };

          try {
            const notificationsRef = collection(db, 'users', user.uid, 'notifications');
            await addDoc(notificationsRef, notification);
            localStorage.setItem(notificationId, 'true');
          } catch (error) {
            console.error("Error sending notification:", error);
          }
        }
      }
    }
  };


  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (upcomingDoses.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>All caught up!</AlertTitle>
        <AlertDescription>
          No upcoming vaccine doses detected based on your records.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="default" className="bg-primary/5 border-primary/20">
      <CalendarClock className="h-4 w-4 text-primary" />
      <AlertTitle className="text-primary">Upcoming Dose Reminders</AlertTitle>
      <AlertDescription>
        Here are your next scheduled vaccinations:
      </AlertDescription>
      <ScrollArea className="mt-4 h-40 w-full pr-4">
        <div className='space-y-4'>
          {upcomingDoses.map((dose, index) => (
            <div key={index}>
              <div className="flex justify-between items-center text-sm">
                <p>
                  <strong>
                    {dose.vaccineName} (Dose {dose.doseNumber})
                  </strong>
                </p>
                <p className='font-semibold'>
                  Due: {format(dose.dueDate, 'PPP')}
                </p>
              </div>
              {index < upcomingDoses.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Alert>
  );
}
