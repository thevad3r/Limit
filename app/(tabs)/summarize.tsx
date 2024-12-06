import { Styles } from "@/constants/Styles";
import { StyleSheet, Text, View } from "react-native";
import FadeView from "@/components/FadeView";
import { Colors } from "@/constants/Colors";
import React, { useEffect } from 'react';
import { getItem } from "@/scripts/async-storage";
import { dateIsExpired, getMonth, getYear, getNextMonth, getPreviousMonth } from "@/scripts/date-check";
import { TasksChart } from "@/components/TasksChart";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

export default function Index() {

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

  const [allActiveTasks, setAllActiveTasks] = React.useState<any[]>([]);
  const [activeTasks, setActiveTasks] = React.useState<any[]>([]);
  const [expiredTasks, setExpiredTasks] = React.useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = React.useState<any[]>([]);

  const [year, setYear] = React.useState(new Date().getFullYear());
  const [month, setMonth] = React.useState(new Date().getMonth());

  const [monthInfoExists, setMonthInfoExists] = React.useState(false);

  const findTasks = async () => {
    const result: any[] = await getItem('tasks');
    if(result !== null) {
      const allActive: any[] = [];
      const completed: any[] = [];
      const expired: any[] = [];
      const active: any[] = [];

      result.forEach(item => {
        if(!item.isCompleted && !dateIsExpired(item.date)) {
          allActive.push(item);
        }
        if(getMonth(item.date) == month && getYear(item.date) == year) {
          if(item.isCompleted) {
            completed.push(item);
          }
          else if(dateIsExpired(item.date)) {
            expired.push(item);
          }
          else active.push(item);
        }
      });

      setAllActiveTasks(allActive);
      setCompletedTasks(completed);
      setExpiredTasks(expired);
      setActiveTasks(active);

      completed.length != 0 || expired.length != 0 || active.length != 0 ? setMonthInfoExists(true) : setMonthInfoExists(false);
    }
  };

  useEffect(() => {
    findTasks();
  }, [month]);

  const goPreviousTab = () => {
    opacity.value = withTiming(0, {duration: 300});
    setTimeout(() => {
      setYear(getPreviousMonth(year, month).year);
      setMonth(getPreviousMonth(year, month).month);
      opacity.value = withTiming(1, {duration: 300});
    }, 300);
  };

  const goNextTab = () => {
    opacity.value = withTiming(0, {duration: 300});
    setTimeout(() => {
      setYear(getNextMonth(year, month).year);
      setMonth(getNextMonth(year, month).month);
      opacity.value = withTiming(1, {duration: 300});
    }, 300);
  };

  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);

  const pan = Gesture.Pan()
  .onChange((event) => {
      offset.value = event.translationX;
  })
  .onFinalize(() => {
      if(offset.value < -100) {
          goNextTab();
      }
      if(offset.value > 100) {
          goPreviousTab();
      }
      offset.value = withSpring(0);
  })
  .runOnJS(true);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={pan}>
        <FadeView>
          <Animated.View style={[animatedStyles, {gap: 64}]}>
            <View style={styles.header}>
              <TouchableOpacity onPress={goPreviousTab}
              style={{cursor: 'pointer'}} activeOpacity={0.8}>
                <Ionicons name='keyboard-arrow-left' size={24} color={Colors.neutrals90}/>
              </TouchableOpacity>
              <Text style={[Styles.h2, {color: Colors.neutrals90}]}>{monthNames[month]}, {year}</Text>
              <TouchableOpacity onPress={goNextTab} 
              style={{cursor: 'pointer'}} activeOpacity={0.8}>
                <Ionicons name='keyboard-arrow-right' size={24} color={Colors.neutrals90}/>
              </TouchableOpacity>
            </View>
            
            {monthInfoExists ? 
            <TasksChart activeCount={activeTasks.length} expiredCount={expiredTasks.length} completedCount={completedTasks.length}/> 
            :
            <Text style={[Styles.p, {textAlign: 'center', color: Colors.neutrals75}]}>В этом месяце задач нет</Text>}

            {allActiveTasks.length != 0 && <Text style={[Styles.p, {textAlign: 'center', color: Colors.primary}]}>Всего активно задач: {allActiveTasks.length}</Text>}
          </Animated.View>
        </FadeView>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})