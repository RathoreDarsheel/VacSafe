import { RegisterForm } from '@/components/register-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
      <div className="w-full max-w-4xl">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center text-foreground"
        >
          <Image src="/logo.png" alt="VacSafe Logo" width={140} height={32} />
        </Link>
        <RegisterForm />
      </div>
    </div>
  );
}
