import { View } from "react-native";
import FadeView from "@/components/FadeView";
import { Field } from "@/components/Field";
import { router } from "expo-router";
import { Button } from "@/components/Button";
import { GoBackHeader } from "@/components/GoBackHeader";
import React from "react";
import { getItem, setItem } from "@/scripts/async-storage"
import { dateToNumber, dateIsExpired, timeLeft, todayDate } from "@/scripts/date-check"
import { Mask } from 'react-native-mask-input';
import { useLocalSearchParams } from "expo-router";
import { ModalWindow } from "@/components/ModalWindow";
import { deleteNotifications, scheduleNotifications } from "@/scripts/notifications";

export default function modifyTask() {
    const { id, title, description, date, state } : {id: string, title: string, description: string, date: string, state: string} = useLocalSearchParams();

    const [newTitle, setNewTitle] = React.useState(title);
    const [newDescription, setNewDescription] = React.useState(description);
    const [newDate, setNewDate] = React.useState(date);

    const [dateIsCorrect, setDateIsCorrect] = React.useState(true);

    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const currentDate = Date.now();
    const isCompleted = state == 'true';

    const date_mask: Mask = (text = '') => {
        const cleanText = text.replace(/\D+/g, '');
    
        let secondDigitDayMask = /\d/;
    
        if (cleanText.charAt(0) === '0') {
        secondDigitDayMask = /[1-9]/;
        }
        if (cleanText.charAt(0) === '3') {
        secondDigitDayMask = /[01]/;
        }
    
        let secondDigitMonthMask = /\d/;
    
        if (cleanText.charAt(2) === '0') {
        secondDigitMonthMask = /[1-9]/;
        }
        if (cleanText.charAt(2) === '1') {
        secondDigitMonthMask = /[0-2]/;
        }

        let thirdAndFourthDigitYearMask = [/\d/, /\d/];

        if (cleanText.charAt(4) === '0') {
            thirdAndFourthDigitYearMask = [];
        }
    
        return cleanText.charAt(4) === '0' ? [
            /[0-3]/,
            secondDigitDayMask,
            '.',
            /[0-1]/,
            secondDigitMonthMask,
            '.',
            /\d/,
            /\d/
        ] : [
            /[0-3]/,
            secondDigitDayMask,
            '.',
            /[0-1]/,
            secondDigitMonthMask,
            '.',
            /\d/,
            /\d/,
            /\d/, 
            /\d/
        ];
    };

    const checkDate = () => {
        if(newDate) {
            var dateArray = newDate.split('.')
            if(dateArray[2] && dateArray[2].length >= 2) {
                if(dateArray[2].length == 2) {
                    dateArray[2] = dateArray[2].padStart(4, '20');
                    setNewDate(`${dateArray[0]}.${dateArray[1]}.${dateArray[2]}`)
                }
                setDateIsCorrect(true)
            }
            else setDateIsCorrect(false)
        }
        else setDateIsCorrect(false)
    }

    const checkData = () => {
        if(newTitle) {
            if(newDate) {
                if(dateIsCorrect) {return true} else return false
            }
            else return false;
        }
        else return false;
    };

    const modifyTask = async () => {
        if(checkData()) {
            const tasks: any[] = await getItem('tasks');
            
            const newTasks = tasks.map(async item => {
                if(item.id == id) {
                    item.title = newTitle;
                    item.description = newDescription;
                    item.date = newDate;
                    deleteNotifications(item.notifications);
                    item.notifications = await scheduleNotifications(item.title, item.date);
                    if(dateToNumber(newDate) > currentDate) {
                        item.isCompleted = false;
                    }
                }
                return item
            })
            const awaitedNewTasks = await Promise.all(newTasks);
            await setItem('tasks', [...awaitedNewTasks]);
            router.navigate('/(tabs)');
        }
    }

    const completeTask = async () => {
        if(checkData()) {
            const tasks: any[] = await getItem('tasks');

            const newTasks = tasks.map(async item => {
                if(item.id == id) {
                    item.title = newTitle;
                    item.description = newDescription;
                    item.date = todayDate();
                    await deleteNotifications(item.notifications);
                    item.notifications = {monthId: '', weekId: '', dayId: ''}
                    item.isCompleted = true;
                }
                return item
            })
            const awaitedNewTasks = await Promise.all(newTasks); 
            await setItem('tasks', [...awaitedNewTasks]);
            router.navigate('/(tabs)');
        }
    }

    const deleteTask = async () => {
        const tasks: any[] = await getItem('tasks');
        const newTasks = tasks.map(async item => {
            if(item.id == id) {
                await deleteNotifications(item.notifications);
            }
            return item
        })
        const awaitedNewTasks = (await Promise.all(newTasks)).filter(item => {
            if(item.id == id) {
                return
            }
            return item
        });
        await setItem('tasks', [...awaitedNewTasks]);
        router.navigate('/(tabs)');
    }

    const onModalClose = () => {
        setIsModalVisible(false);
    }

    return (
        <FadeView>
            <View style={{height: '100%', justifyContent: 'space-between', gap: 64}}>
                <View style={{gap: 32}}>
                    <GoBackHeader title={'Редактирование задачи'}/>
                    <Field title={'Название'} placeholder={'Введите название задачи'} value={newTitle} setValue={setNewTitle} required/>
                    <Field title={'Описание'} placeholder={'Введите описание задачи'} value={newDescription} setValue={setNewDescription} lines={3}/>
                    <Field title={'Срок выполнения'} placeholder={todayDate()} value={newDate} setValue={setNewDate} masked={{mask: date_mask, checkValue: checkDate, valueIsCorrect: dateIsCorrect}} required/>
                </View>
                <View style={{gap: 16}}>
                    <Button title="Сохранить" onPress={() => {modifyTask()}} main/>
                    {!isCompleted && <Button title="Пометить завершенной" onPress={() => {completeTask()}} main/>}
                    <Button title="Удалить" onPress={() => {setIsModalVisible(true)}}/>
                </View>
            </View>
            <ModalWindow isVisible={isModalVisible} title="Вы уверены, что хотите удалить задачу?" description="Это действие невозможно будет отменить" onClose={onModalClose} onAgree={deleteTask}/>
        </FadeView>
    );
};