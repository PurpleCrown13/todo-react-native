import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useTheme } from '../ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTaskContext } from '../TaskContext'; 

export function AddTask() {
    const { isDarkMode } = useTheme();
    const backgroundColor = isDarkMode ? '#1B1B1B' : '#F5F5F5';
    const textColor = isDarkMode ? 'white' : 'black';

    const [task, setTask] = useState('');
    const { tasks, dispatch } = useTaskContext(); 

    

    const saveTasks = async (newTasks) => {
        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
        } catch (error) {
            console.error('Ошибка при сохранении задач: ', error);
        }
    };

    const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    };

    const handleAddTask = () => {
        if (task.trim() === '') {
            return;
        }

        const newTask = {
            id: generateUniqueId(),
            text: task,
            checked: false, 
        };

        const newTasks = [...tasks, newTask];
        dispatch({ type: 'ADD_TASK', payload: newTask });

        saveTasks(newTasks);

        setTask('');
    };




    return (
        <View style={[styles.container, { backgroundColor }]}>
            <TextInput
                style={[styles.input, { color: textColor }]}
                value={task}
                onChangeText={(text) => setTask(text)}
                placeholder="Введите задачу"
                placeholderTextColor={isDarkMode ? 'gray' : 'darkgray'}
            />
            <Button
                title="Добавить"
                onPress={handleAddTask}
                color={isDarkMode ? "#A82C36" : "#2C1118"}
            />
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
});
