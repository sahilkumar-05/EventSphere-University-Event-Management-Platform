import React from 'react';
import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import TabNavigator
from './TabNavigator';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminDashboard from '../screens/AdminDashboard';
import EventDetailScreen from '../screens/EventDetailScreen';
import ManageEvents from '../screens/ManageEvents';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';

const Stack =
  createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Signup"
          component={SignupScreen}
        />

        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
        />

        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EventDetails"
          component={EventDetailScreen}
          options={{ headerShown: true, title: 'Event Details' }}
        />

        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
        />

        <Stack.Screen
          name="ManageEvents"
          component={ManageEvents}
        />
        

        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}