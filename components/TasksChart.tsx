import React, { useEffect } from 'react';
import { PieChart } from './PieChart';
import { Colors } from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';
import { Styles } from '@/constants/Styles';
import { Dimensions } from 'react-native';

export type PieChartDataItem = {
  color: string;
  percent: number;
}[]

export const TasksChart = ({ activeCount, completedCount, expiredCount } : 
  { activeCount: number, completedCount: number, expiredCount: number }) => {
  
  const [pieWidth, setPieWidth] = React.useState(Dimensions.get('window').width - 32);
  const allCount = activeCount + completedCount + expiredCount;
  const activePercent = activeCount / allCount;
  const completedPercent = completedCount / allCount;
  const expiredPercent = expiredCount / allCount;

  const [chartData, setChartData] = React.useState([
    {
      percent: expiredPercent,
      color: Colors.warning,
    },
    {
      percent: activePercent,
      color: Colors.primary,
    },
    {
      percent: completedPercent,
      color: Colors.neutrals15,
    },
  ]);

  var completedPercentage = Math.round(completedCount / ( activeCount + completedCount + expiredCount) * 100);
  
  useEffect(() => {
    setChartData([
      {
        percent: expiredPercent,
        color: Colors.warning,
      },
      {
        percent: activePercent,
        color: Colors.primary,
      },
      {
        percent: completedPercent,
        color: Colors.neutrals15,
      },
    ]);
  }, [activeCount, completedCount, expiredCount]);

  const handleLayout = () => {
    setPieWidth(Dimensions.get('window').width - 32)
  }

  return (
    <View style={{gap: 32, alignItems: 'center'}}>
      <View style={{width: '100%', maxWidth: 600, aspectRatio: 1}} onLayout={handleLayout}>
        <PieChart size={pieWidth} pieData={chartData}/>
        <View style={[styles.text, {width: pieWidth - 32}]}>
          {expiredCount != 0 && <Text style={[Styles.p, {color: Colors.warning}]}>Просрочено задач: {expiredCount}</Text>}
          {activeCount != 0 && <Text style={[Styles.p, {color: Colors.primary}]}>Активно задач: {activeCount}</Text>}
          {completedCount != 0 && <Text style={[Styles.p, {color: Colors.neutrals35}]}>Завершено задач: {completedCount}</Text>}
        </View>
      </View>
      <View style={{alignItems: 'center', gap: 8}}>
        <Text style={[Styles.h3, {color: Colors.neutrals75}]}>Завершено</Text>
        <Text style={[Styles.h3, {color: Colors.neutrals75}]}>{completedPercentage}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    backgroundColor: Colors.neutrals5,
    position: 'absolute',
    margin: 16,
    borderRadius: 9999,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})