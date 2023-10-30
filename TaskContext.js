// В TaskContext.js

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskContext = createContext();

const initialState = {
    tasks: [],
};


const taskReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TASK':
            return { tasks: [...state.tasks, action.payload] };
        case 'DELETE_TASK':
            const indexToDelete = state.tasks.findIndex(task => task.id === action.payload);
            if (indexToDelete !== -1) {
                const newTasks = [...state.tasks];
                newTasks.splice(indexToDelete, 1);
                return { tasks: newTasks };
            }
            return state;
        case 'SET_TASKS':
            return { tasks: action.payload };
        case 'TOGGLE_TASK':
            return {
                tasks: state.tasks.map(task => {
                    if (task.id === action.payload) {
                        return { ...task, checked: !task.checked };
                    }
                    return task;
                })
            };
        default:
            return state;
    }
};




export const TaskProvider = ({ children }) => {
    const [state, dispatch] = useReducer(taskReducer, initialState);

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

    useEffect(() => {
        // Сохраняем состояние задач в AsyncStorage при изменении
        AsyncStorage.setItem('tasks', JSON.stringify(state.tasks))
            .catch(error => {
                console.error('Ошибка при сохранении задач: ', error);
            });
    }, [state.tasks]);

    return (
        <TaskContext.Provider value={{ tasks: state.tasks, dispatch }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};
