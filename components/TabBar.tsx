import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Styles } from '@/constants/Styles';
import Ionicons from "@expo/vector-icons/MaterialIcons";

export function TabBar({ state, descriptors, navigation }: any) {
  
    const icons = {
        index: (props: any) => <Ionicons name="splitscreen" size={24} {...props} />,
        summarize: (props: any) => <Ionicons name="summarize" size={24} {...props} />
    };

    return (
    <View style={styles.tabbar}>
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            style={[styles.tabbarItem, {backgroundColor: isFocused ? Colors.neutrals15 : Colors.neutrals10}]}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            key={route.name}
            activeOpacity={0.8}
          >
            {
              icons[route.name]({
                  color: isFocused ? Colors.primary : Colors.neutrals75
              })
            }
            <Text style={[Styles.p, { color: isFocused ? Colors.primary : Colors.neutrals75 }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    tabbar: {
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: Colors.neutrals10,
    },

    tabbarItem: {
        padding: 16,
        flex: 1,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
    }
})