import { DashboardHeader } from '@/components/dashboard/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <main className="flex flex-1 flex-col gap-4 bg-secondary/50 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
