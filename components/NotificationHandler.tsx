import { useEffect } from 'react';
import useNotifications from '@pachun/use-expo-push-notifications';
import { useData } from '../context/DataContext';
import type { Reminder } from '../context/DataContext';

export default function NotificationHandler() {
  const { reminders, activeProfile } = useData();

  // Define what happens when notifications are received or interacted with
  useNotifications({
    onNotificationReceived: (notification) => {
      console.log('Notification received:', notification);
    },
    onNotificationInteraction: (notificationResponse) => {
      console.log('Notification interacted with:', notificationResponse);
    },
  });

  useEffect(() => {
    const scheduleReminderNotification = async (reminder: Reminder) => {
      const reminderTime = new Date(reminder.time);

      if (isNaN(reminderTime.getTime())) {
        console.error(`Invalid reminder time for: ${reminder.title}`);
        return;
      }

      if (reminderTime <= new Date()) {
        console.warn(`Skipping past reminder: ${reminder.title}`);
        return;
      }

      // Schedule a notification
      const notification = {
        title: reminder.title || 'Reminder',
        body: reminder.content || 'You have a reminder!',
        date: reminderTime,
        repeat: getRepeatType(reminder.repeat),
      };

      console.log('Scheduling notification:', notification);
      // Assuming there is a method in the package to schedule notifications
      // Adjust this according to the actual API of @pachun/use-expo-push-notifications
    };

    reminders
      .filter(
        (reminder) =>
          reminder.profileId === activeProfile?.id && reminder.isActive
      )
      .forEach(scheduleReminderNotification);
  }, [reminders, activeProfile]);

  const getRepeatType = (repeat?: Reminder['repeat']) => {
    switch (repeat) {
      case 'day':
        return 'day';
      case 'week':
        return 'week';
      case 'hour':
        return 'hour';
      default:
        return undefined; // No repetition
    }
  };

  return null; // This component does not render anything
}
