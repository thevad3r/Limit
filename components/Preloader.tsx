import { Image, StyleSheet, Text, View } from "react-native";
import FadeView from "./FadeView";
import { Styles } from "@/constants/Styles";
import { Colors } from "@/constants/Colors";

export const Preloader = () => {
    return(
        <FadeView>
            <View style={styles.logo}>
                <Image source={require('../assets/images/logo.svg')}/>
                <Text style={[Styles.h1, {color: Colors.primary}]}>Лимит</Text>
            </View>
        </FadeView>
    );
}

const styles = StyleSheet.create({
    logo: {
        left: 0,
        top: 0,
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16
    }
})