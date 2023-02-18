import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import WalletScreen from '../screens/WalletScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {backgroundColor: "#35373b", height: 55},
        tabBarActiveTintColor: "#93b8e9",
        tabBarInactiveTintColor: "#a0a1a6",
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen
        name="Vitals"
        component={HomeStack}
        options={({route}) => ({
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="heart-multiple" color={color} size={25} />
          ),
        })}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="ethereum" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="leaderboard" color={color} size={25} />
          ),
        }}
      />
    </Tab.Navigator>
  // <Tab.Navigator
  //     screenOptions={({ route }) => ({
  //       headerShown: false,
  //       tabBarShowLabel: true,
  //       tabBarStyle: {backgroundColor: "#35373b", height: 55},
  //       tabBarActiveTintColor: "#93b8e9",
  //       tabBarInactiveTintColor: "#a0a1a6",
  //       tabBarLabelStyle: {
  //         fontSize: 12,
  //       },
  //     })}
  //   >
  //     <Tab.Screen
  //       name="Vitals"
  //       component={HomeStack}
  //       options={{
  //         tabBarIcon: ({ color }) => (
  //           <Ionicons name={"md-home"} size={25} color={color} />
  //         ),
  //       }}
  //     />
  //     <Tab.Screen
  //       name="Journal"
  //       component={WalletScreen}
  //       options={{
  //         tabBarIcon: ({ color }) => (
  //           <Ionicons name={"md-journal"} size={25} color={color} />
  //         ),
  //       }}
  //     />
  //     <Tab.Screen
  //       name="Profile"
  //       component={LeaderboardScreen}
  //       options={{
  //         tabBarIcon: ({ color }) => (
  //           <Ionicons name={"md-person"} size={25} color={color} />
  //         ),
  //       }}
  //     />
  //   </Tab.Navigator>
  );
};

export default TabNavigator;
