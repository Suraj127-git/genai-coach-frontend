import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export async function enableDailyReminder() {
  if (Constants.appOwnership === 'expo') {
    console.warn(
      'Expo Go detected: Only local notifications work. Remote push requires a development build.'
    );
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const trigger: Notifications.CalendarTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
    hour: 9,
    minute: 0,
    repeats: true,
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Practice your behavioral questions!',
      body: 'Open AI Mock Interview Coach',
    },
    trigger,
  });

  return true;
}
