import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingVertical: 40,
        paddingHorizontal: 16,
        backgroundColor: Colors.neutrals5,
    },

    h1: {
        fontFamily: 'Inter Tight',
        fontSize: 48,
        fontWeight: '700',
        lineHeight: 48,
    },
    
    h2: {
        fontFamily: 'Inter Tight',
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 32,
    },

    h3: {
        fontFamily: 'Inter Tight',
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 24,
    },

    p: {
        fontFamily: 'Inter Tight',
        fontSize: 24,
        fontWeight: '300',
        lineHeight: 32,
    }
  });  