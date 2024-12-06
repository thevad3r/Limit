import { StyleSheet, View } from "react-native";
import FadeView from "@/components/FadeView";
import { Field } from "@/components/Field";
import { router } from "expo-router";
import { Button } from "@/components/Button";
import React, { useEffect } from "react";
import { getItem, setItem } from "@/scripts/async-storage"
import { todayDate } from "@/scripts/date-check"
import { Mask } from 'react-native-mask-input';
import { GoBackHeader } from "@/components/GoBackHeader";
import { requestNotificationPermissions, scheduleNotifications } from "@/scripts/notifications";

export default function createNewTask() {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [date, setDate] = React.useState('');

    const [dateIsCorrect, setDateIsCorrect] = React.useState(true);

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
        secondDigitMonthMask = /[012]/;
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
        if(date) {
            var dateArray = date.split('.');
            var currentDate = Date.now();
            if(dateArray[2] && dateArray[2].length >= 2) {
                if(dateArray[2].length == 2) {
                    dateArray[2] = dateArray[2].padStart(4, '20');
                    setDate(`${dateArray[0]}.${dateArray[1]}.${dateArray[2]}`)
                }
                var inputDate = Date.parse(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
                inputDate <= currentDate ? setDateIsCorrect(false) : setDateIsCorrect(true)
            }
            else setDateIsCorrect(false)
        }
        else setDateIsCorrect(false)
    }

    const checkData = () => {
        if(title) {
            if(date) {
                if(dateIsCorrect) {return true} else return false
            }
            else return false;
        }
        else return false;
    };

    const createNewTask = async () => {
        if(checkData()) {
            const id = Date.now();
            const tasks = await getItem('tasks');
            const notifications = await scheduleNotifications(title, date);
            const newTask = {id: id, title: title, description: description, date: date, isCompleted: false, notifications: notifications};
            if(tasks !== null) {
                await setItem('tasks', [...tasks, newTask]);
            }
            else await setItem('tasks', [newTask]);
            router.navigate('/(tabs)');
        }
    }

    useEffect(() => {
        requestNotificationPermissions();
    }, []);

    return (
        <FadeView>
            <View style={{height: '100%', justifyContent: 'space-between', gap: 64}}>
                <View style={{gap: 32}}>
                    <GoBackHeader title='Создание задачи'/>
                    <Field title={'Название'} placeholder={'Введите название задачи'} value={title} setValue={setTitle} required/>
                    <Field title={'Описание'} placeholder={'Введите описание задачи'} value={description} setValue={setDescription} lines={3}/>
                    <Field title={'Срок выполнения'} placeholder={todayDate()} value={date} setValue={setDate} masked={{mask: date_mask, checkValue: checkDate, valueIsCorrect: dateIsCorrect}} required/>
                </View>
                <Button title='Создать' onPress={() => {createNewTask()}} main/>
            </View>
        </FadeView>
    );
};


const style = StyleSheet.create({
    header: {
        flexDirection: 'row',
        gap: 12,
        cursor: 'pointer',
    }
});