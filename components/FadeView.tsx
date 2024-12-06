import { Styles } from "@/constants/Styles";
import Animated, { FadeIn, FadeOut, Easing } from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { ScrollView } from "react-native";

type FadeViewProps = {
  children: React.ReactNode;
  className?: string;
};

export default function FadeView({ children }: FadeViewProps) {
  return (
    <ScrollView 
    showsVerticalScrollIndicator={false} 
    style={{height: '100%', backgroundColor: Colors.neutrals5}}
    contentContainerStyle={{minHeight: '100%'}}
    >
      <Animated.View
      style={Styles.container}
      entering={FadeIn.duration(600).easing(Easing.ease)}
      exiting={FadeOut.duration(600).easing(Easing.ease)}
      >
        {children}
      </Animated.View>
    </ScrollView>
  );
}