import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../ThemeContext';

export function SettingsScreen() {
    const { isDarkMode, toggleTheme } = useTheme();
    const backgroundColor = isDarkMode ? '#1B1B1B' : '#F5F5F5';
    const buttonColor = isDarkMode ? 'black' : 'black';
    const buttonText = isDarkMode ? 'Переключить на светлую тему' : 'Переключить на темную тему';

    return (
        <View style={[styles.containerSettings, { backgroundColor }]}>
            <CustomButton
                title={buttonText}
                onPress={toggleTheme}
                textColor={buttonColor}
                backgroundColor="#65C7FC"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    containerSettings: {
        flex: 1,
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
});


function CustomButton({ title, onPress, textColor, backgroundColor }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, { backgroundColor }]}
        >
            <Text style={{ color: textColor }}>{title}</Text>
        </TouchableOpacity>
    );
}
