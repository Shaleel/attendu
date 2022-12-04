import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ScreenWrapper from '../../Components/ScreenWrapper/index';
import Header from '../../Components/Header/index';

const Charts = () => {
    return (
        <ScreenWrapper withHeader>
            <Header title="Charts" withoutButton />
            <Text>Charts</Text>
        </ScreenWrapper>
    );
};

export default Charts;

const styles = StyleSheet.create({});
