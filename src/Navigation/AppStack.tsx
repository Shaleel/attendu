import {View, Text, Pressable} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {AuthContext} from './AuthProvider';
import {Button} from '../Components/Buttons';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import routes from '../constants/routes';
import {useNavigation} from '@react-navigation/native';
import AddRoll from '../Screens/AddRole';
// import EducatorTab from './EducatorTab';
import EditClass from '../Screens/Modals/EditClass';
import AddSchedule from '../Screens/Modals/AddSchedule';
import AddClass from '../Screens/Modals/AddClass';
import Classroom from '../Screens/Classroom';
import EditSchedule from '../Screens/Modals/EditSchedule';
import Attendance from '../Screens/Attendance';
import Home from '../Screens/Home';
import Schedule from '../Screens/Schedule';
const Stack = createStackNavigator();

const AppStack = () => {
    const {logout, user} = useContext(AuthContext);
    let navigation = useNavigation();
    useEffect(() => {
        if (user.role) {
            navigation.navigate('Main' as never);
        }
    }, [user]);
    return (
        <Stack.Navigator
            screenOptions={{
                ...TransitionPresets.SlideFromRightIOS,
                headerShown: false,
            }}
            // screenOptions={{presentation: 'modal', headerShown: false}}
            initialRouteName={user.role ? 'Main' : 'AddRole'}>
            <Stack.Screen name={'Main'} component={Home} />
            <Stack.Screen name={'Schedule'} component={Schedule} />
            <Stack.Screen name={'Classroom'} component={Classroom} />
            <Stack.Screen name={'Attendance'} component={Attendance} />

            <Stack.Group
                screenOptions={{
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                    headerShown: false,
                }}>
                <Stack.Screen name={'EditClass'} component={EditClass} />
                <Stack.Screen name={'AddSchedule'} component={AddSchedule} />
                <Stack.Screen name={'AddClass'} component={AddClass} />
                <Stack.Screen name={'EditSchedule'} component={EditSchedule} />
            </Stack.Group>

            {!user.role && (
                <Stack.Screen name={'AddRole'} component={AddRoll} />
            )}
        </Stack.Navigator>
    );
};

export default AppStack;
