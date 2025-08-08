import { LoginForm } from '@/components/login-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center text-foreground"
        >
          <Image src="/logo.png" alt="VacSafe Logo" width={140} height={32} />
        </Link>
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Enter your email and password to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
