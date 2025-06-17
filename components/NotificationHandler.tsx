import { useEffect } from 'react';
import PushNotification from 'react-native-push-notification';
import { useData } from '../context/DataContext';
import type { Reminder } from '../context/DataContext';

export default function NotificationHandler() {
  const { reminders, activeProfile } = useData();

  useEffect(() => {
    // Configure notifications
    PushNotification.configure({
      onNotification: function (notification: unknown) {
        console.log('Notification received:', notification);
      },
      requestPermissions: true,
    });

    // Create notification channel (Android)
    setTimeout(() => {
      PushNotification.configure({
        onNotification: function (notification) {
          console.log('Notification received:', notification);
        },
        requestPermissions: true,
      });
    }, 1000);

    // Cancel all previous notifications to prevent duplicates
    PushNotification.cancelAllLocalNotifications();

    const scheduleNotification = (reminder: Reminder) => {
      const reminderTime = new Date(reminder.time);

      if (isNaN(reminderTime.getTime())) {
        console.error(`Invalid reminder time for: ${reminder.title}`);
        return;
      }

      if (reminderTime <= new Date()) {
        console.warn(`Skipping past reminder: ${reminder.title}`);
        return;
      }

      PushNotification.localNotificationSchedule({
        channelId: 'reminder-channel',
        title: reminder.title || 'Reminder',
        message: reminder.content || 'You have a reminder!',
        date: reminderTime,
        allowWhileIdle: true,
        repeatType: getRepeatType(reminder.repeat),
      });
    };

    reminders
      .filter(
        (reminder) =>
          reminder.profileId === activeProfile?.id && reminder.isActive
      )
      .forEach(scheduleNotification);
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
