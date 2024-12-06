import { Colors } from '@/constants/Colors';
import { Styles } from '@/constants/Styles';
import * as React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import MaskInput, { Mask } from 'react-native-mask-input';

type maskedStatus = {
    mask: Mask, 
    checkValue: (value: string) => void, 
    valueIsCorrect: boolean,
}

export function Field({title, value, setValue, placeholder, lines, masked, required} :
    {title: string, 
    value: string, 
    setValue: (value: string) => void,
    placeholder?: string, 
    lines?: number, 
    masked?: maskedStatus, 
    required?: boolean}) {

    const [valueIsRequired, setValueIsRequired] = React.useState(false);

    const checkRequired = (value : string) => {
        value ? setValueIsRequired(false) : setValueIsRequired(true);
    }

    return (    
        <View style={{gap: 16}}>
            <View>
                <Text style={[Styles.h3, {color: required ? Colors.primary : Colors.neutrals90}]}>{title}</Text>
                {valueIsRequired && <Text style={[Styles.p, {color: Colors.warning}]}>Обязательное поле</Text>}
            </View>
            {masked ? 
                <MaskInput
                keyboardType={'number-pad'}
                style={[Styles.p, styles.input, 
                    {
                        color: required ? Colors.primary : Colors.neutrals75,
                        borderColor: required ? Colors.primary : Colors.neutrals90
                    }]}
                placeholder={placeholder}
                placeholderTextColor={Colors.neutrals35}
                multiline={lines ? true : false}
                numberOfLines={lines ? lines : 1}
                value={value}
                mask={masked.mask}
                onChangeText={(masked) => {setValue(masked)}}
                onBlur={() => {required && checkRequired(value); masked.checkValue(value)}}
                />
            :
                <TextInput
                style={[Styles.p, styles.input, 
                    {
                        verticalAlign: lines ? 'top' : 'middle',
                        color: required ? Colors.primary : Colors.neutrals75,
                        borderColor: required ? Colors.primary : Colors.neutrals90
                    }]}
                placeholder={placeholder}
                placeholderTextColor={Colors.neutrals35}
                multiline={lines ? true : false}
                numberOfLines={lines ? lines : 1}
                value={value}
                onChangeText={(value) => {setValue(value)}}
                onBlur={() => {required && checkRequired(value)}}
                />
            }
            {masked ? (!masked.valueIsCorrect && <Text style={[Styles.p, styles.warning]}>Введите актуальную и корректную дату</Text>) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        maxHeight: 500,
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
    },

    warning: {
        lineHeight: 32,
        color: Colors.warning,
    },
})