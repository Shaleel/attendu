import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import React from 'react';
import spacing from '../../constants/spacing';
import ArrowLeft from '../../assets/icons/ArrowLeft.svg';
import ArrowDown from '../../assets/icons/ArrowDown.svg';

import {Heading2} from '../Typography';
import {useNavigation} from '@react-navigation/native';
import {light} from '../../constants/theme';
import palette from '../../constants/colors';
const width = Dimensions.get('window').width; //full width

type props = {
    title: string;
    withoutButton?: boolean;
    isModalHeader?: boolean;
};
const Header = ({title, withoutButton, isModalHeader}: props) => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <Pressable
                style={({pressed}) => [
                    {
                        flex: withoutButton ? 0.01 : 0.1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor:
                            !withoutButton && pressed
                                ? palette.grey
                                : 'transparent',
                        borderRadius: spacing.lg * 4,
                    },
                    styles.icon,
                ]}
                onPress={() => {
                    !withoutButton && navigation.goBack();
                }}>
                {isModalHeader && (
                    <View>
                        <ArrowDown stroke="red" />
                    </View>
                )}
                {!withoutButton && !isModalHeader && <ArrowLeft />}
            </Pressable>

            <Heading2>{title}</Heading2>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: light.border,
        // elevation: -10,
    },
    icon: {
        padding: spacing.md * 1.5,
        height: spacing.lg * 3,
        marginRight: spacing.md,
        // backgroundColor: 'red',
    },
});
