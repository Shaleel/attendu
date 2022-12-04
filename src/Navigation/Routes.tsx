import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {AuthContext} from './AuthProvider';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import firestore from '@react-native-firebase/firestore';
import ScreenWrapper from '../Components/ScreenWrapper/index';
import {ActivityIndicator, View} from 'react-native';

const Routes = () => {
    const {user, setUser} = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);

    const onAuthStateChanged = async (user: any) => {
        let currentUser;
        if (user) {
            currentUser = await firestore()
                .collection('users')
                .doc(user.uid)
                .get();
            setUser(currentUser._data);
        } else setUser(null);
        // console.log(currentUser);
        if (initializing) setInitializing(false);
    };

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing)
        return (
            <ScreenWrapper>
                <></>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <ActivityIndicator />
                </View>
            </ScreenWrapper>
        );

    return (
        <NavigationContainer>
            {user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default Routes;
