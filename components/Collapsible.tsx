import React, { PropsWithChildren } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import Ionicons from "@expo/vector-icons/MaterialIcons";
import { Styles } from '@/constants/Styles';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, useDerivedValue } from 'react-native-reanimated';

export function Collapsible({ children, title, isOpen, setIsOpen }
: PropsWithChildren & { title: string, isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {

  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isOpen), {
      duration: 300,
    })
  );
  
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}>
        <Text style={[Styles.h2, {color: Colors.neutrals90}]}>{title}</Text>
        <Ionicons
          name='keyboard-arrow-down'
          size={24}
          color={Colors.neutrals90}
          style={!isOpen && {transform: 'rotate(180deg)'}}
        />
      </TouchableOpacity>
      <Animated.View style={[bodyStyle, {overflow: 'hidden'}]}>
        <View style={styles.content} onLayout={(e) => height.value = e.nativeEvent.layout.height}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  content: {
    position: 'absolute',
    width: '100%',
    paddingTop: 32,
    gap: 16,
  },
});
