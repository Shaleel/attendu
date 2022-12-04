import {View, Text, StyleSheet, useColorScheme} from 'react-native';
import React from 'react';
import spacing from '../../constants/spacing';
import {light, dark} from '../../constants/theme';

type props = {
    children: JSX.Element | string;
    padding?: 'sm' | 'md' | 'lg';
    active?: boolean;
    bg?: string;
};
export const Card = ({children, active, padding = 'md', bg}: props) => {
    const darkTheme = useColorScheme() === 'dark';
    return (
        <View
            style={[
                styles.card,
                darkTheme && styles.darkBG,
                active && styles.active,
                {padding: spacing[padding]},
                bg !== undefined && {backgroundColor: bg},
            ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        // flex: 1,
        borderRadius: spacing.md * 1.5,
        borderColor: light.border,
        borderWidth: 2,
        padding: spacing.md,
        backgroundColor: light.inputBG,
    },
    darkBG: {
        backgroundColor: dark.inputBG,
    },
    active: {
        borderColor: light.active,
        borderWidth: 2,
        backgroundColor: light.selectedInput,
    },
});
