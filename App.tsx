import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './src/screens/HomeScreen';
import { CreateTaskScreen } from './src/screens/CreateTaskScreen';
import { supabase } from './src/services/supabase';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { AuthProvider, useAuth } from './src/services/AuthContext';
import { LoginRegisterScreen } from './src/screens/LoginRegisterScreen';

const Stack = createNativeStackNavigator();

function MainApp() {
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

function Root() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <MainApp /> : <LoginRegisterScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
