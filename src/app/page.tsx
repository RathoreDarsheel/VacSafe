'use client';

import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  UserCheck,
  BellRing,
  ClipboardList,
  Lock,
  Loader2,
  HeartPulse,
  Users,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { submitContactForm } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});


export default function Home() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const result = await submitContactForm(values);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: result.error,
      });
    }
  }

  const features = [
    {
      icon: ClipboardList,
      title: 'Centralized Vaccination Records',
      description: 'Keep your family\'s vaccination history in one secure, accessible place. Never lose a record again.',
    },
    {
      icon: BellRing,
      title: 'Automated Dose Reminders',
      description: 'Get timely notifications for upcoming and missed doses to stay on schedule.',
    },
    {
      icon: Users,
      title: 'Community Health Insights',
      description: 'View anonymized data on vaccination coverage in your area to stay informed about local health trends.',
    },
    {
      icon: Lock,
      title: 'Data Privacy & Security',
      description: 'Your data is encrypted and secure. We adhere to strict privacy standards to protect your health information.',
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 animate-fade-in-down">
        <Link href="/">
          <Image src="/logo.png" alt="VacSafe Logo" width={140} height={32} />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/login" passHref>
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link href="/register" passHref>
            <Button>
              Sign Up <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center md:py-32">
          <p className="text-4xl font-extrabold tracking-tight md:text-6xl animate-fade-in-up">
            Your Family's Health, Organized.
          </p>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground animate-fade-in-up [animation-delay:200ms]">
            VacSafe is your personal guide to managing your family's immunizations.
            Effortlessly track schedules, understand vaccination needs, and get timely reminders, all in one place.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row animate-fade-in-up [animation-delay:400ms]">
            <Link href="/login" passHref>
              <Button size="lg">
                Go to Your Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </a>
          </div>
        </section>
        <section id="features" className="bg-secondary/30 py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h3 className="text-3xl font-bold">
                Everything You Need for Peace of Mind
              </h3>
              <p className="mt-2 text-muted-foreground">
                VacSafe is more than just a tracker. It's your partner in health.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                 <div
                  key={index}
                  className="flex flex-col items-center text-center animate-fade-in-up"
                  style={{ animationDelay: `${200 * (index + 1)}ms` }}
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-semibold">
                    {feature.title}
                  </h4>
                  <p className="mt-2 text-muted-foreground">
                   {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h3 className="text-3xl font-bold">Get in Touch</h3>
              <p className="mt-2 text-muted-foreground">
                Have questions or feedback? We'd love to hear from you.
              </p>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-8 space-y-4 text-left"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='sr-only'>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} />
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
                          <FormLabel className='sr-only'>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='sr-only'>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Your message..." rows={4} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  <div className="text-center">
                    <Button type="submit" size="lg" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Message
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto border-t py-6 text-sm text-muted-foreground">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <span>© {new Date().getFullYear()} VacSafe. All rights reserved.</span>
            <span className="text-right">HQ: No. 123, Velachery Main Road, Chennai, Tamil Nadu 600042</span>
        </div>
      </footer>
    </div>
  );
}
