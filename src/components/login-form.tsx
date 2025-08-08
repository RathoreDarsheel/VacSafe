'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handlePasswordReset = async () => {
    const email = form.getValues('email');
    if (!email) {
      form.trigger('email');
      toast({
        variant: 'destructive',
        title: 'Email Required',
        description: 'Please enter your email address to reset your password.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password Reset Email Sent',
        description:
          'Check your inbox for a link to reset your password.',
      });
    } catch (error: any) {
      let description = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/user-not-found') {
        description =
          'No account found with that email address. Please check your email or sign up.';
      }
      toast({
        variant: 'destructive',
        title: 'Password Reset Failed',
        description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // We need to reload the user to get the latest emailVerified status
      await userCredential.user.reload();
      const freshUser = auth.currentUser;

      if (freshUser && !freshUser.emailVerified) {
        toast({
            variant: 'destructive',
            title: 'Email Not Verified',
            description: 'Please check your inbox and verify your email address to log in.',
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: 'Login Successful',
        description: `Welcome back!`,
      });
      router.push('/dashboard');
    } catch (error: any)
       {
      console.error(error);
      let errorMessage = 'Invalid email or password. Please try again.';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please try again.';
      }
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                 <a
                  onClick={handlePasswordReset}
                  className="cursor-pointer text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Log In
        </Button>
      </form>
    </Form>
  );
}
