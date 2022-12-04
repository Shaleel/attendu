import {View, Text, Pressable} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../Screens/Home';
import BottomTab from '../Components/BottomTab/index';
import Schedule from '../Screens/Schedule';
import Chat from '../Screens/Chat';
import Charts from '../Screens/Charts/index';

const Tab = createBottomTabNavigator();
const EducatorTab = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
            // tabBar={props => <BottomTab {...props} />}>
            tabBar={props => <></>}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Schedule" component={Schedule} />
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="Chart" component={Charts} />
        </Tab.Navigator>
    );
};

export default EducatorTab;
