'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { NotificationItem, type Notification } from './notification-item';
import { Separator } from '../ui/separator';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';


export function NotificationFeed() {
  const [user] = useAuthState(auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const notificationsRef = collection(db, 'users', user.uid, 'notifications');
    const q = query(notificationsRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedNotifications: Notification[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedNotifications.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate(),
        } as Notification);
      });
      setNotifications(fetchedNotifications);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching notifications:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center justify-between px-4 py-2">
        <h3 className="text-lg font-semibold">Notifications</h3>
      </div>
      <Separator />
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <NotificationItem notification={notification} />
              {index < notifications.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Bell className="h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-semibold">No new notifications</p>
          <p className="text-sm text-muted-foreground">
            We'll let you know when there's something new.
          </p>
        </div>
      )}
    </div>
  );
}
