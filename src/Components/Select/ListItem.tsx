import {StyleSheet, View, Pressable, useColorScheme} from 'react-native';
import React from 'react';
import spacing from '../../constants/spacing';
import {Text} from '../Typography/index';
import {dark, light} from '../../constants/theme';

const SelectedIcon = ({isSelected}: {isSelected: boolean}) => {
    const lightTheme = useColorScheme() === 'light';
    return (
        <View style={[styles.icon, isSelected && styles.iconSelected]}>
            {isSelected && (
                <View
                    style={[
                        styles.iconCircle,
                        {
                            backgroundColor: lightTheme
                                ? light.cardBackground
                                : dark.cardBackground,
                        },
                    ]}></View>
            )}
        </View>
    );
};

const ListItem = ({
    val,
    pressHandler,
    isSelected,
}: {
    val: string | number | undefined;
    pressHandler: () => void;
    isSelected: boolean;
}) => {
    return (
        <Pressable onPress={pressHandler} style={styles.item}>
            <Text>{`${val}`}</Text>
            <SelectedIcon isSelected={isSelected} />
        </Pressable>
    );
};

export default ListItem;

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        padding: spacing.lg,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
    },
    icon: {
        height: spacing.lg,
        width: spacing.lg,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        height: spacing.lg / 2,
        width: spacing.lg / 2,
        borderRadius: spacing.lg / 2,
    },
    iconSelected: {
        borderRadius: 10,

        backgroundColor: light.active,
    },
});
