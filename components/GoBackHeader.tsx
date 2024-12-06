import { Text, StyleSheet } from 'react-native'
import { Styles } from '@/constants/Styles'
import { Colors } from '@/constants/Colors'
import { TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/MaterialIcons';

export function GoBackHeader({ title } : {title : string}) {
  return (
    <Link asChild href=''>
        <TouchableOpacity style={style.header} activeOpacity={0.8}>
            <Ionicons name='keyboard-arrow-left' size={24} color={Colors.neutrals90}/>
            <Text style={[Styles.h2, {color: Colors.neutrals90, flexShrink: 1}]}>{title}</Text>
        </TouchableOpacity>
    </Link>
  )
}

const style = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
    }
});