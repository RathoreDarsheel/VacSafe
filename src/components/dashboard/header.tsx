'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, Menu, Bell } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { NotificationFeed } from './notification-feed';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const navLinks = [
  { href: '/dashboard', label: 'Home' },
  { href: '/dashboard/community', label: 'Community Update' },
  { href: '/dashboard/vaccination', label: 'Vaccination' },
  { href: '/dashboard/local', label: 'Local' },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const [user] = useAuthState(auth);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/logo.png"
            alt="VacSafe Logo"
            width={120}
            height={28}
          />
          <span className="sr-only">VacSafe</span>
        </Link>
        <div className="flex items-center gap-4">
          {navLinks.map((link, index) => (
            <React.Fragment key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'whitespace-nowrap transition-colors hover:text-foreground',
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
              {index < navLinks.length - 1 && (
                <Separator orientation="vertical" className="h-4" />
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Image
                src="/logo.png"
                alt="VacSafe Logo"
                width={120}
                height={28}
              />
              <span className="sr-only">VacSafe</span>
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-foreground',
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                2
              </span>
              <span className="sr-only">Open notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <NotificationFeed />
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary/50">
                <AvatarImage
                  src={user?.photoURL ?? "https://placehold.co/100x100.png"}
                  alt={user?.displayName ?? 'User'}
                  data-ai-hint="user avatar"
                />
                <AvatarFallback>{user?.displayName?.[0] ?? 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user?.displayName ?? 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard/settings">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href="/login">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
