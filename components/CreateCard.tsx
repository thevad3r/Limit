import { Text, StyleSheet } from 'react-native'
import { Styles } from '@/constants/Styles'
import { Colors } from '@/constants/Colors'
import Ionicons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export function CreateCard() {
  return (
    <Link asChild href='/create-new-task'>
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <Text style={[Styles.h3, {color: Colors.primary}]}>Создать новую задачу</Text>
        <Ionicons name='add' size={24} color={Colors.primary}/>
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.neutrals35,
    borderRadius: 8,
    cursor: 'pointer',
  }
})