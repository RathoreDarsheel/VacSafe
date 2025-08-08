'use client';

import { Bell, Mail, Smartphone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export type Notification = {
  id: string;
  type: 'email' | 'push';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
};

type NotificationItemProps = {
  notification: Notification;
};

const iconMap = {
  email: <Mail className="h-5 w-5 text-muted-foreground" />,
  push: <Smartphone className="h-5 w-5 text-muted-foreground" />,
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const timeAgo = formatDistanceToNow(notification.timestamp, {
    addSuffix: true,
  });

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-secondary/50">
      <div className="mt-1">{iconMap[notification.type]}</div>
      <div className="flex-1 space-y-1">
        <p className="font-semibold">{notification.title}</p>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>
      {!notification.read && (
        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
      )}
    </div>
  );
}