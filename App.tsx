import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './src/screens/HomeScreen';
import { CreateTaskScreen } from './src/screens/CreateTaskScreen';
import { supabase } from './src/services/supabase';
import { CalendarScreen } from './src/screens/CalendarScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from('tasks').select('*');
      if (error) {
        console.log('Supabase connection error:', error.message);
      } else {
        console.log('Supabase connection successful! Data:', data);
      }
    }
    testConnection();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
