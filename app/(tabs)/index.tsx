import { View } from "react-native";
import FadeView from "@/components/FadeView";
import { CreateCard } from "@/components/CreateCard";
import { Collapsible } from "@/components/Collapsible";
import { Card } from "@/components/Card";
import { clear, getItem, setItem } from "@/scripts/async-storage";
import React, { useEffect } from 'react';
import { dateIsExpired, dateToNumber } from "@/scripts/date-check";
import { cancelAllScheduledNotificationsAsync, getAllScheduledNotificationsAsync } from "expo-notifications";

export default function Index() {

  const [activeTasks, setActiveTasks] = React.useState<any[]>([]);
  const [expiredTasks, setExpiredTasks] = React.useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = React.useState<any[]>([]);

  const [isActiveOpen, setIsActiveOpen] = React.useState(true);
  const [isExpiredOpen, setIsExpiredOpen] = React.useState(true);
  const [isCompletedOpen, setIsCompletedOpen] = React.useState(true);

  const findTasks = async () => {
    
    const result: any[] = await getItem('tasks');

    if(result) {
      const completed: any[] = [];
      const expired: any[] = [];
      const active: any[] = [];

      result.forEach(item => {
        if(item.isCompleted) {
          completed.push(item);
        }
        else if(dateIsExpired(item.date)) {
          expired.push(item);
        }
        else active.push(item);
      });
      
      completed.sort((a, b) => dateToNumber(b.date) - dateToNumber(a.date));
      active.sort((a, b) => dateToNumber(a.date) - dateToNumber(b.date));
      expired.sort((a, b) => dateToNumber(a.date) - dateToNumber(b.date));
      setCompletedTasks(completed);
      setExpiredTasks(expired);
      setActiveTasks(active);
    }
  };

  const loadCollapseStates = async () => {
    const collapseStates = await getItem('collapseStates');
    if (collapseStates) {
      setIsActiveOpen(collapseStates.isActiveOpen);
      setIsExpiredOpen(collapseStates.isExpiredOpen);
      setIsCompletedOpen(collapseStates.isCompletedOpen);
    }
  };

  const saveCollapseStates = async () => {
    const collapseStates = {
      isActiveOpen,
      isExpiredOpen,
      isCompletedOpen,
    };
    await setItem('collapseStates', collapseStates);
  };

  useEffect(() => {
    findTasks();
    loadCollapseStates();
  }, [])

  useEffect(() => {
    saveCollapseStates();
  }, [isActiveOpen, isExpiredOpen, isCompletedOpen]);

  return (
    <FadeView>
      <View style={{gap: 64}}>
        <CreateCard/>
        { expiredTasks.length !== 0 &&
        <Collapsible title={'Просроченные задачи'} isOpen={isExpiredOpen} setIsOpen={setIsExpiredOpen}>
          {expiredTasks.map((item) => (
            <Card key={item.id} id={item.id} title={item.title} description={item.description} date={item.date} isCompleted={item.isCompleted}/>
          ))}
        </Collapsible>
        }
        { activeTasks.length !== 0 &&
        <Collapsible title={'Текущие задачи'} isOpen={isActiveOpen} setIsOpen={setIsActiveOpen}>
          {activeTasks.map((item) => (
            <Card key={item.id} id={item.id} title={item.title} description={item.description} date={item.date} isCompleted={item.isCompleted}/>
          ))}
        </Collapsible>
        }
        { completedTasks.length !== 0 &&
        <Collapsible title={'Завершенные задачи'} isOpen={isCompletedOpen} setIsOpen={setIsCompletedOpen}>
          {completedTasks.map((item) => (
            <Card key={item.id} id={item.id} title={item.title} description={item.description} date={item.date} isCompleted={item.isCompleted}/>
          ))}
        </Collapsible>
        }
      </View>
    </FadeView>
  );
}