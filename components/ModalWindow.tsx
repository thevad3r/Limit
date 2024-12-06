import { Modal, View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/MaterialIcons";
import { Button } from "./Button";
import { Colors } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";

export function ModalWindow({ isVisible, title, description, onClose, onAgree } : 
    {isVisible: boolean, title: string, description: string, onClose: () => void, onAgree: () => void}) {
    return (
        <Modal animationType="fade" visible={isVisible} transparent>
            <View style={styles.background}>
                <View style={[styles.window, {backgroundColor: Colors.neutrals5}]}>
                    <View style={styles.header}>
                        <Text style={[Styles.h3, {color: Colors.neutrals90}]}>{title}</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => onClose()}>
                            <Ionicons name="close" size={24} style={{color: Colors.neutrals90}}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={[Styles.p, {color: Colors.neutrals75}]} >{description}</Text>
                    <View style={styles.buttonsView}>
                        <Button title="Да" onPress={() => {onClose(); onAgree()}}/>
                        <Button title="Нет" main onPress={() => onClose()}/>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    background: {
        justifyContent: 'center',
        height: '100%',
        padding: 16,
        backgroundColor: 'hsla(0, 0%, 0%, 0.75)',
    },

    window: {
        padding: 16,
        gap: 32,
        borderRadius: 8,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    buttonsView: {
        flexDirection: 'row',
        gap: 16,
    }
});