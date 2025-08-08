'use client';

import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { vaccineList } from '@/lib/vaccinations';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info, Loader2 } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, Timestamp, updateDoc, deleteField } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export type UserVaccination = {
  doses: Record<number, Timestamp | string>; // Storing dose index to timestamp
};

export function VaccinationTable() {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const [userVaccinations, setUserVaccinations] = React.useState<
    Record<string, UserVaccination>
  >({});
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchVaccinations = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      const docRef = doc(db, 'userVaccinations', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserVaccinations(docSnap.data() as Record<string, UserVaccination>);
      } else {
        // Ensure the document exists to avoid issues with updateDoc later
        await setDoc(docRef, {});
      }
      setIsLoading(false);
    };

    fetchVaccinations();
  }, [user]);

  const handleDoseChange = async (
    vaccineId: string,
    doseIndex: number,
    isChecked: boolean
  ) => {
    if (!user) return;

    // Create a deep copy for safe mutation
    const newVaccinations = JSON.parse(JSON.stringify(userVaccinations));
    
    if (!newVaccinations[vaccineId]) {
      newVaccinations[vaccineId] = { doses: {} };
    }

    const newTimestamp = Timestamp.now();
    const updatePayload: Record<string, any> = {};

    if (isChecked) {
      newVaccinations[vaccineId].doses[doseIndex] = newTimestamp.toDate().toISOString();
      updatePayload[`${vaccineId}.doses.${doseIndex}`] = newTimestamp;
    } else {
      // Uncheck this and all subsequent doses
      const dosesCount = vaccineList.find((v) => v.id === vaccineId)!.doses;
      for (let i = doseIndex; i < dosesCount; i++) {
        if (newVaccinations[vaccineId].doses[i]) {
          delete newVaccinations[vaccineId].doses[i];
           // Use deleteField() for removing fields in Firestore
          updatePayload[`${vaccineId}.doses.${i}`] = deleteField();
        }
      }
    }
    
    // Optimistically update the UI
    setUserVaccinations(newVaccinations);

    try {
      const docRef = doc(db, 'userVaccinations', user.uid);
      await updateDoc(docRef, updatePayload);

      toast({
        title: 'Record Updated',
        description: `Your vaccination record for ${vaccineId} has been saved.`,
      });
      // Reload the page to reflect changes in the NextDoseReminder component
      window.location.reload();
    } catch (error) {
      console.error('Error saving vaccination record: ', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'There was a problem updating your record. Please try again.',
      });
      // Revert optimistic update on failure by re-fetching from the database
      const docSnap = await getDoc(doc(db, 'userVaccinations', user.uid));
       if (docSnap.exists()) {
         setUserVaccinations(docSnap.data() as Record<string, UserVaccination>);
      } else {
         setUserVaccinations({});
      }
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vaccine</TableHead>
                <TableHead>Disease</TableHead>
                <TableHead>Doses</TableHead>
                <TableHead>Recommended Age</TableHead>
                <TableHead className="text-center">My Doses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vaccineList.map((vaccine) => {
                const vaccineData = userVaccinations[vaccine.id];
                const dosesTaken = vaccineData ? Object.keys(vaccineData.doses).length : 0;
                
                return (
                  <TableRow key={vaccine.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {vaccine.name}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Interval: {vaccine.doseInterval}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {vaccine.diseases.map((disease) => (
                          <Badge key={disease} variant="secondary">
                            {disease}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{vaccine.doses}</TableCell>
                    <TableCell>{vaccine.age}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {Array.from({ length: vaccine.doses }).map((_, i) => {
                          const isChecked = vaccineData?.doses[i] !== undefined;
                          const isPrevChecked = i === 0 || (vaccineData?.doses[i-1] !== undefined);
                          
                          return (
                            <Checkbox
                              key={i}
                              checked={isChecked}
                              disabled={!isChecked && !isPrevChecked}
                              onCheckedChange={(checked) =>
                                handleDoseChange(vaccine.id, i, !!checked)
                              }
                              id={`${vaccine.id}-dose-${i}`}
                            />
                          );
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
