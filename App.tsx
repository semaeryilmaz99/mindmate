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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LongTermPlansScreen } from './src/screens/LongTermPlansScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'list';
          else if (route.name === 'Calendar') iconName = 'calendar';
          else if (route.name === 'LongTermPlans') iconName = 'flag';
          else if (route.name === 'Progress') iconName = 'stats-chart';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#7f8c8d',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Tasks' }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="LongTermPlans" component={LongTermPlansScreen} options={{ title: 'Long Term Plans' }} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
    </Tab.Navigator>
  );
}

function MainApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="CreateTask" component={CreateTaskScreen} options={{ presentation: 'modal' }} />
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
