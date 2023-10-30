import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, AntDesign } from 'react-native-vector-icons';
import { useTheme, ThemeProvider } from './ThemeContext';
import { HomeScreen } from './components/HomeScreen';
import { AddTask } from './components/AddTask';
import { SettingsScreen } from './components/SettingsScreen';
import { TaskProvider, useTaskContext } from './TaskContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <TaskProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </TaskProvider>
  );
}

function AppContent() {
  const { tasks } = useTaskContext(); // Получаем задачи из контекста
  const [taskCount, setTaskCount] = useState(tasks.length);

  useEffect(() => {
    // Обновляем состояние счетчика задач при изменении задач в контексте
    setTaskCount(tasks.length);
  }, [tasks]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={() => ({
          tabBarStyle: {
            backgroundColor: '#A6ABBD',
            height: 50,
          },
          headerStyle: {
            backgroundColor: '#A6ABBD', 
          },
        })}
      >
        <Tab.Screen
          name="Главная"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
            tabBarBadge: taskCount > 0 ? taskCount.toString() : null,
            tabBarActiveTintColor: '#FFF',
            tabBarInactiveTintColor: 'black',
            tabBarLabel: '',
            tabBarLabelStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="Добавить задачу"
          component={AddTask}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle-outline" size={size} color={color} />
            ),
            tabBarActiveTintColor: '#FFF',
            tabBarInactiveTintColor: 'black',
            tabBarLabel: '',
            tabBarLabelStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="Настройки"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="setting" size={size} color={color} />
            ),
            tabBarActiveTintColor: '#FFF',
            tabBarInactiveTintColor: 'black',
            tabBarLabel: '',
            tabBarLabelStyle: { display: 'none' },
            fontSize: 30,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
