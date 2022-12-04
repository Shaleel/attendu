import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import routes from '../constants/routes';
import Login from '../Screens/Login';
import CreateAccount from '../Screens/CreateAccount';

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                ...TransitionPresets.SlideFromRightIOS,
                headerShown: false,
            }}>
            <Stack.Screen name={routes.Login} component={Login} />
            <Stack.Screen
                name={routes.CreateAccount}
                component={CreateAccount}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;
