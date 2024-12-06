import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";
import React from 'react';
export default function RootLayout() {

  return (
    <Tabs tabBar={props => <TabBar {...props}/>}>
      <Tabs.Screen name="index" options={{ 
        headerShown: false, 
        title: 'Задачи',
        }}/>
      <Tabs.Screen name="summarize" options={{ 
        headerShown: false, 
        title: 'Отчёты',
        }}/>
    </Tabs>
  );
}
