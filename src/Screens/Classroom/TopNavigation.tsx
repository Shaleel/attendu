import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TopTabBar from '../../Components/TopTab';
const Students = React.lazy(() => import('./Students'));
const Schedule = React.lazy(() => import('./Schedule'));
const Charts = React.lazy(() => import('./Charts'));

const Tab = createMaterialTopTabNavigator();

type navProps = {
    classroom: any;
};
const TopNavigation = ({classroom}: navProps) => {
    return (
        <Tab.Navigator tabBar={props => <TopTabBar {...props} />}>
            <Tab.Screen
                name="Schedule"
                children={() => <Schedule classroomId={classroom.id} />}
            />
            <Tab.Screen
                name="Students"
                children={() => <Students classroomId={classroom.id} />}
            />
            <Tab.Screen
                name="Charts"
                children={() => <Charts classroom={classroom} />}
            />
        </Tab.Navigator>
    );
};

export default TopNavigation;
