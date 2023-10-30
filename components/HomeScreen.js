import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useTaskContext } from '../TaskContext';
import { useTheme } from '../ThemeContext'; // Импорт контекста темы
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

export function HomeScreen() {
    const theme = useTheme(); // Использование контекста темы
    const { isDarkMode } = theme;
    const backgroundColor = isDarkMode ? '#1B1B1B' : '#F5F5F5';
    const textColor = isDarkMode ? 'white' : 'black';
    const borderColor = isDarkMode ? '#F5F5F5' : 'black';
    const checkboxFillColor = isDarkMode ? "#A82C36" : "#2C1118";

    const { tasks, dispatch } = useTaskContext();
    const animatableRefs = useRef({}); // Объект для хранения ссылок на анимируемые элементы

    const handleRemoveTaskWithAnimation = (taskId) => {
        const animatableRef = animatableRefs.current[taskId];
        if (animatableRef) {
            animatableRef.flipOutX(500).then(() => {
                dispatch({ type: 'DELETE_TASK', payload: taskId });
            });
        }
    };

    useEffect(() => {
        async function loadTasks() {
            try {
                const storedTasks = await AsyncStorage.getItem('tasks');
                if (storedTasks !== null) {
                    const parsedTasks = JSON.parse(storedTasks);
                    dispatch({ type: 'SET_TASKS', payload: parsedTasks });
                }
            } catch (error) {
                console.error('Ошибка при загрузке задач: ', error);
            }
        }

        loadTasks();
    }, [dispatch]);

    return (
        <ScrollView style={[styles.container, { backgroundColor }]}>
            {tasks.length === 0 ? (
                <Text style={{ color: textColor, textAlign: 'center', marginTop: 20 }}>
                    К сожалению у вас нет задач 😦
                </Text>
            ) : (
                tasks.map((task, index) => (
                    <Animatable.View
                        ref={(ref) => (animatableRefs.current[task.id] = ref)} // Сохраняем ссылку на анимируемый элемент
                        key={task.id}
                        style={[
                            {
                                padding: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 2,
                                borderRadius: 5,
                                marginHorizontal: 20,
                                borderColor: borderColor,
                                marginVertical: 10,
                            },
                            index === 0 ? { marginTop: 40 } : {},
                            index === tasks.length - 1 ? { marginBottom: 40 } : {}
                        ]}
                    >
                        <BouncyCheckbox
                            size={25}
                            fillColor={checkboxFillColor}
                            unfillColor="#FFFFFF"
                            text={task.text}
                            textStyle={{ color: textColor }}
                            isChecked={task.checked}
                            innerIconStyle={{ borderWidth: 2 }}
                            style={{
                                width: '80%'
                            }}
                            onPress={() => {
                                dispatch({ type: 'TOGGLE_TASK', payload: task.id });
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => handleRemoveTaskWithAnimation(task.id)}
                            style={{
                                backgroundColor: borderColor,
                                padding: 5,
                                borderRadius: 5,
                                marginLeft: 40,
                            }}
                        >
                            <Text style={styles.deleteButtonText}>❌</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
    },
});
