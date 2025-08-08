'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { auth, db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, GeoPoint } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Skeleton } from '../ui/skeleton';
import { Textarea } from '../ui/textarea';


const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  gender: z.enum(['male', 'female', 'other']),
  age: z.coerce.number().min(0, { message: 'Age cannot be negative.' }),
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  address: z.string().optional(),
});

export function SettingsForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, userLoading] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      age: 0,
      username: '',
      address: '',
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setIsDataLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          form.reset({
            username: data.username || '',
            email: data.email || '',
            age: data.age || 0,
            gender: data.gender || 'other',
            address: data.address || '',
          });
        }
        setIsDataLoading(false);
      }
    };

    if (!userLoading) {
      loadUserData();
    }
  }, [user, userLoading, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if(!user) return;
    setIsLoading(true);
    try {
      const { username, age, gender, address } = values;

      // Update Firebase Auth profile
      if(auth.currentUser && auth.currentUser.displayName !== username) {
        await updateProfile(auth.currentUser, {
          displayName: username,
        });
      }

      // Update Firestore document
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email: user.email, // email is not editable
        age,
        gender,
        address: address || null,
      }, { merge: true });


      toast({
        title: 'Profile Updated',
        description: `Your information has been successfully saved.`,
      });
      router.refresh(); // Refresh server components
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isDataLoading) {
    return (
        <Card className="shadow-2xl">
           <CardHeader>
             <Skeleton className="h-8 w-48" />
             <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-2">
             <div className="space-y-6">
                 <div className="space-y-2">
                     <Skeleton className="h-4 w-16" />
                     <Skeleton className="h-10 w-full" />
                 </div>
                 <div className="space-y-2">
                     <Skeleton className="h-4 w-16" />
                     <Skeleton className="h-10 w-full" />
                 </div>
                 <div className="space-y-2">
                     <Skeleton className="h-4 w-16" />
                     <Skeleton className="h-10 w-full" />
                 </div>
             </div>
             <div className="space-y-6">
                 <div className="space-y-2">
                     <Skeleton className="h-4 w-16" />
                     <Skeleton className="h-10 w-full" />
                 </div>
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-16" />
                     <Skeleton className="h-40 w-full" />
                 </div>
             </div>
          </CardContent>
          <CardFooter>
             <Skeleton className="h-11 w-32" />
          </CardFooter>
        </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-2xl">
          <CardContent className="grid gap-8 pt-6 md:grid-cols-2">
            <div className="space-y-6">
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="your_username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        readOnly
                        disabled
                        placeholder="user@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your email address cannot be changed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="35" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-6">
             <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="123 Main St, Anytown, USA"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </CardContent>
          <CardFooter>
             <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
