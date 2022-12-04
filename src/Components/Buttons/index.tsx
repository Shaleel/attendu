import {
    Pressable,
    useColorScheme,
    StyleSheet,
    Text,
    ActivityIndicator,
} from 'react-native';
import React from 'react';
import {light, dark} from '../../constants/theme';
import {BTNText} from '../Typography';
import spacing from '../../constants/spacing';
import fontFamily from '../../constants/fontFamily';
import palette from '../../constants/colors';

type props = {
    onPress?: () => void;
    secondary?: boolean;
    danger?: boolean;
    title: string;
    isLoading?: boolean;
};
export const Button = ({
    secondary,
    title,
    onPress,
    isLoading,
    danger,
}: props) => {
    const lightTheme = useColorScheme() === 'light';
    return (
        <Pressable
            onPress={onPress}
            style={({pressed}) => [
                {
                    // backgroundColor: danger && ,
                    backgroundColor: danger
                        ? palette.red
                        : secondary
                        ? lightTheme
                            ? light.secondary
                            : dark.secondary
                        : pressed
                        ? light.selectedButton
                        : light.active,
                },
                styles.btn,
            ]}>
            {isLoading ? (
                <ActivityIndicator color={'white'} />
            ) : (
                <BTNText secondary={secondary}>{title}</BTNText>
            )}
        </Pressable>
    );
};

export const SmallButton = ({secondary, title, onPress}: props) => {
    const lightTheme = useColorScheme() === 'light';

    return (
        <Pressable
            onPress={onPress}
            style={({pressed}) => [
                {
                    backgroundColor: secondary
                        ? lightTheme
                            ? light.secondary
                            : dark.secondary
                        : pressed
                        ? light.selectedButton
                        : light.active,
                },
                styles.btn,
            ]}>
            <BTNText small secondary={secondary}>
                {title}
            </BTNText>
        </Pressable>
    );
};
type anchorProps = {
    children: string;
    size?: 'md' | 'lg';
    onPress: () => void;
};
export const Anchor = ({children, onPress, size = 'md'}: anchorProps) => {
    return (
        <Pressable onPress={onPress}>
            <Text
                style={[
                    styles.anchor,
                    {
                        fontSize: spacing[size] * 2,
                    },
                ]}>
                {children}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    btn: {
        flex: 1,
        padding: spacing.lg,
        alignItems: 'center',
        borderRadius: 10,
    },
    smBtn: {
        flex: 1,
        padding: spacing.sm,
        alignItems: 'center',
        borderRadius: 10,
    },
    anchor: {
        fontFamily: fontFamily.Bold,
        color: light.active,
    },
});
