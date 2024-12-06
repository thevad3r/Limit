import { Text, StyleSheet } from 'react-native'
import { Styles } from '@/constants/Styles'
import { Colors } from '@/constants/Colors'
import { TouchableOpacity } from 'react-native';

export function Button({ main, title, onPress } : {main? : boolean, title: string, onPress : () => void}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.button, 
    {
      borderWidth: main ? 0 : 1, 
      borderColor: main ? '' : Colors.neutrals35, 
      backgroundColor: main? Colors.neutrals10 : ''
    }]}>
        <Text style={[Styles.p, {color: main ? Colors.primary : Colors.neutrals75, textAlign: 'center'}]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    flexShrink: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    cursor: 'pointer',
  }
})