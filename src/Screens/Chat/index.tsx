import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ScreenWrapper from '../../Components/ScreenWrapper/index';
import Header from '../../Components/Header/index';

const Chat = () => {
    return (
        <ScreenWrapper withHeader>
            <Header title="Chat" withoutButton />
            <Text>Chat</Text>
        </ScreenWrapper>
    );
};

export default Chat;

const styles = StyleSheet.create({});
