'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function ReminderSettings() {
  const [user] = useAuthState(auth);
  const [reminderType, setReminderType] = useState('push');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setReminderType(data.reminderType || 'push');
        setEmail(data.email || ''); // Pre-fill with user's registration email
      } else {
        // Pre-fill with user's auth email if profile doesn't exist yet
        setEmail(user.email || '');
      }
    };
    fetchSettings();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { 
        reminderType,
        email: reminderType === 'email' ? email : auth.currentUser?.email,
      }, { merge: true });

      toast({
        title: 'Settings Saved',
        description: 'Your reminder preferences have been updated.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
       toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save your preferences. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reminder Options</CardTitle>
        <CardDescription>
          Choose how you want to receive critical alerts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={reminderType}
          onValueChange={setReminderType}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="push" id="push" />
            <Label htmlFor="push">Browser Push Notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email">Email Reminders</Label>
          </div>
        </RadioGroup>
        {reminderType === 'email' && (
          <div className="space-y-2">
            <Label htmlFor="email-input">Email Address</Label>
            <Input
              id="email-input"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
