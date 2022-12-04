import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ScreenWrapper from '../../Components/ScreenWrapper/index';
import Header from '../../Components/Header';

const EditClass = () => {
    return (
        <ScreenWrapper withHeader>
            <Header title="Class" />
            <Text>EditClass</Text>
        </ScreenWrapper>
    );
};

export default EditClass;

const styles = StyleSheet.create({});
