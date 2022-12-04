import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {light, dark} from '../constants/theme';
import {AuthProvider} from './AuthProvider';
import Routes from './Routes';

const Providers = () => {
    const lightTheme = useColorScheme() === 'light';
    return (
        <AuthProvider>
            <StatusBar
                backgroundColor={
                    lightTheme ? light.screenBackground : dark.screenBackground
                }
                barStyle={lightTheme ? 'dark-content' : 'light-content'}
            />
            <Routes />
        </AuthProvider>
    );
};

export default Providers;
