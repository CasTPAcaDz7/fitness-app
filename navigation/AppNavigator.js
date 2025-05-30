import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 導入各個頁面組件
import CalendarScreen from '../screens/CalendarScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CommunityScreen from '../screens/CommunityScreen';
import LibraryScreen from '../screens/LibraryScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// 暗色主題配色
const theme = {
  dark: true,
  colors: {
    primary: '#4A90E2',
    background: '#1a1a1a',
    card: '#2d2d2d',
    text: '#ffffff',
    border: '#404040',
    notification: '#4A90E2',
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={theme}>
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
              iconName = focused ? 'library' : 'library-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'cog' : 'cog-outline';
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: '#888888',
          tabBarStyle: {
            backgroundColor: '#2d2d2d',
            borderTopColor: '#404040',
            borderTopWidth: 1,
            elevation: 8,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            paddingBottom: 5,
            paddingTop: 5,
            height: 65,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'normal',
            marginBottom: 3,
          },
          headerStyle: {
            backgroundColor: '#2d2d2d',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 8,
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        })}
      >
        <Tab.Screen 
          name="Calendar" 
          component={CalendarScreen} 
          options={{ title: '日曆' }}
        />
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ title: '儀表板' }}
        />
        <Tab.Screen 
          name="Community" 
          component={CommunityScreen} 
          options={{ title: '社群' }}
        />
        <Tab.Screen 
          name="Library" 
          component={LibraryScreen} 
          options={{ title: '資料庫' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: '設定' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 