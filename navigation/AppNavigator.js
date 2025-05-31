import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 導入各個頁面組件
import CalendarScreen from '../screens/CalendarScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CommunityScreen from '../screens/CommunityScreen';
import LibraryScreen from '../screens/LibraryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DietTrackingScreen from '../screens/DietTrackingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dashboard堆疊導航器
function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="DietTracking" component={DietTrackingScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Dashboard') {
              iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
            } else if (route.name === 'Community') {
              iconName = focused ? 'account-group' : 'account-group-outline';
            } else if (route.name === 'Library') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'cog' : 'cog-outline';
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#888888',
          tabBarStyle: {
            backgroundColor: '#000000',
            borderTopColor: '#333333',
            borderTopWidth: 1,
            elevation: 0,
            shadowOpacity: 0,
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
          },
          tabBarLabelStyle: {
            fontSize: 0,
          },
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: '#111111',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontSize: 18,
          },
        })}
      >
        <Tab.Screen 
          name="Calendar" 
          component={CalendarScreen} 
          options={{ 
            headerShown: false 
          }}
        />
        <Tab.Screen 
          name="Community" 
          component={CommunityScreen} 
          options={{}}
        />
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardStack} 
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Library" 
          component={LibraryScreen} 
          options={{}}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 