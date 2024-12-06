import { Text, StyleSheet } from 'react-native'
import { Styles } from '@/constants/Styles'
import { Colors } from '@/constants/Colors'
import Ionicons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { View } from 'react-native';
import { dateIsExpired, timeLeft } from '@/scripts/date-check';

export function Card({id, title, description, date, isCompleted} : {id: number, title: string, description: string, date: string, isCompleted: boolean}) {

  const isExpired = dateIsExpired(date, id);
  var daysLeft = timeLeft(date, id).daysLeft;
  const percentage = timeLeft(date,id).percentage;

  const timeColor = () => {
    const hue = Math.round(150 * percentage / 100);
    return `hsl(${hue}, 100%, 50%)`;
  }

  const timeLabel = () => {
    daysLeft = Math.abs(daysLeft);
    var dateString: string[] = [];
    if(daysLeft >= 30) {
      const monthsLeft = Math.round(daysLeft / 30);
      const lastDigit = monthsLeft % 10;
      const lastTwoDigits = monthsLeft % 100;
      dateString[0] = monthsLeft.toString();

      if(lastTwoDigits >= 11 && lastTwoDigits <= 20) {
        dateString[1] = 'месяцев';
      }
      else if(lastDigit == 1) {
        dateString[1] = 'месяц';
      }
      else if(lastDigit >= 2 && lastDigit <= 4) {
        dateString[1] = 'месяца';
      }
      else dateString[1] = 'месяцев';
    }
    else {
      const lastDigit = daysLeft % 10;
      const lastTwoDigits = daysLeft % 100;
      dateString[0] = daysLeft.toString();

      if(lastTwoDigits >= 11 && lastTwoDigits <= 20) {
        dateString[1] = 'дней';
      }
      else if(lastDigit == 1) {
        dateString[1] = 'день';
      }
      else if(lastDigit >= 2 && lastDigit <= 4) {
        dateString[1] = 'дня';
      }
      else dateString[1] = 'дней';
    };

    if(isCompleted) return daysLeft == 0 ? `Завершено сегодня` : `Завершено ${dateString[0]} ${dateString[1]} назад` 
    else if(isExpired) return daysLeft == 0 ? `Просрочено сегодня` : `Просрочено ${dateString[0]} ${dateString[1]} назад`
    else {
      if(dateString[1] == 'день' || dateString[1] == 'месяц') return `Остался ${dateString[0]} ${dateString[1]}`
      else return `Осталось ${dateString[0]} ${dateString[1]}`
    };
  };

  return (
    <Link asChild href={{
      pathname: "/modify-task",
      params: { id: id, title: title, description: description, date: date, state: isCompleted.toString() },
    }}>
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={styles.header}>
          <Text style={[Styles.h3, {color: isCompleted ? Colors.neutrals75 : isExpired ? Colors.warning : Colors.primary}]}>{title}</Text>
          <Ionicons name='edit' size={24} color={isCompleted ? Colors.neutrals75 : isExpired ? Colors.warning : Colors.primary}/>
        </View>
        {description ?
          <Text style={[Styles.p, {color: isCompleted ? Colors.neutrals35 : Colors.neutrals75}]}>{description}</Text> : null
        }
        <View style={styles.date}>
          <Text style={[Styles.p, {color: isCompleted ? Colors.neutrals75 : isExpired ? Colors.warning : timeColor()}]}>{timeLabel()}</Text>
          {!isExpired &&
            <View style={[styles.timeline, {backgroundColor: Colors.neutrals15}]}>
              <View style={[styles.gradient, {width: `${percentage}%`, backgroundColor: timeColor()}]}/>
            </View>
          }
        </View>
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },

  card: {
    gap: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutrals35,
    borderRadius: 8,
    cursor: 'pointer',
  },

  date: {
    gap: 8,
  },

  timeline: {
    height: 4,
    width: '100%',
    borderRadius: 8,
  },

  gradient: {
    height: '100%',
  },
})