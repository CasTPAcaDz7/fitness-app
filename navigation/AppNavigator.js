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
          tabBarActiveTintColor: '#ff3333',
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
            fontSize: 12,
            marginBottom: 4,
          },
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
            title: '日曆',
            headerShown: false 
          }}
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