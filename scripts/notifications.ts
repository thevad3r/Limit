import * as Notifications from 'expo-notifications';;
import { dateToNumber } from './date-check';
import { Platform } from 'react-native';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

export const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if(existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Необходимы разрешения для получения уведомлений');
        }
    }
};

export const scheduleNotifications = async (title: string, date: string) => {
    let monthId = '';
    let weekId = '';
    let dayId = '';
    
    if (Platform.OS === 'web') {
        console.log('Уведомления недоступны в Web') 
    }
    else {
        const deadlineDate = dateToNumber(date);
        const daysLeft = Math.ceil((deadlineDate - Date.now()) / 1000 / 60 / 60 / 24);
        let notificationTime = 0;
        if(daysLeft > 30) {
            notificationTime = (deadlineDate - 30 * 24 * 60 * 60 * 1000);
            monthId = await Notifications.scheduleNotificationAsync({
                content: {
                    vibrate: [0, 250, 250],
                    title: title,
                    body: 'На выполнение задачи остался 1 месяц!',
                },
                trigger: {
                    type: SchedulableTriggerInputTypes.DATE,
                    date: new Date(notificationTime),
                },
            });
        }
        if(daysLeft > 7) {
            notificationTime = (deadlineDate - 7 * 24 * 60 * 60 * 1000);
            weekId = await Notifications.scheduleNotificationAsync({
                content: {
                    vibrate: [0, 250, 250],
                    title: title,
                    body: 'На выполнение задачи осталась 1 неделя!',
                },
                trigger: {
                    type: SchedulableTriggerInputTypes.DATE,
                    date: new Date(notificationTime),
                },
            });
        }
        if(daysLeft > 1) {
            notificationTime = (deadlineDate - 24 * 60 * 60 * 1000);
            console.log(notificationTime, new Date(notificationTime));
            dayId = await Notifications.scheduleNotificationAsync({
                content: {
                    vibrate: [0, 250, 250],
                    title: title,
                    body: 'На выполнение задачи остался 1 день!',
                },
                trigger: {
                    type: SchedulableTriggerInputTypes.DATE,
                    date: new Date(notificationTime),
                },
            });
        };
    };
    return {monthId: monthId, weekId: weekId, dayId: dayId}
};

export const deleteNotifications = async (notifications: { monthId: string; weekId: string; dayId: string; }) => {
    if (Platform.OS === 'web') {
        console.log('Уведомления недоступны в Web') 
    }
    else {
        notifications.monthId && await Notifications.cancelScheduledNotificationAsync(notifications.monthId);
        notifications.weekId && await Notifications.cancelScheduledNotificationAsync(notifications.weekId);
        notifications.dayId && await Notifications.cancelScheduledNotificationAsync(notifications.dayId);
    }
}