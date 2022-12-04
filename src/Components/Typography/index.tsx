import {View, Text as _Text, useColorScheme, ViewStyle} from 'react-native';
import React from 'react';
import fontFamily from '../../constants/fontFamily';
import {light, dark} from '../../constants/theme';
import colors from '../../constants/colors';
import spacing from '../../constants/spacing';

type props = {
    style?: any;
    children: string | number;
    small?: boolean;
    center?: boolean;
    light?: boolean;
    bold?: boolean;
    muted?: boolean;
};
export const Heading1 = ({children, center}: props) => {
    const lightTheme = useColorScheme() === 'light';
    return (
        <_Text
            style={[
                {
                    color: lightTheme ? light.text : dark.text,
                    fontFamily: fontFamily.Bold,
                    fontSize: 40,
                },
                center && {textAlign: 'center'},
            ]}>
            {children}
        </_Text>
    );
};
export const Heading2 = ({
    children,
    center,
    light: lightText,
    muted,
}: props) => {
    const lightTheme = useColorScheme() === 'light';
    return (
        <_Text
            style={[
                {
                    color: lightTheme ? light.text : dark.text,
                    fontFamily: fontFamily.Bold,
                    fontSize: 30,
                },
                center && {textAlign: 'center'},
                lightText && {color: colors.white},
            ]}>
            {children}
        </_Text>
    );
};
export const Heading3 = ({
    children,
    center,
    light: lightText,
    muted,
}: props) => {
    const lightTheme = useColorScheme() === 'light';
    return (
        <_Text
            style={[
                {
                    color: lightTheme ? light.text : dark.text,
                    fontFamily: fontFamily.Bold,
                    fontSize: 20,
                    zIndex: 0,
                    elevation: 0,
                },
                center && {textAlign: 'center'},
                lightText && {color: colors.white},
            ]}>
            {children}
        </_Text>
    );
};

export const Heading4 = ({
    children,
    center,
    light: lightText,
    muted,
}: props) => {
    const lightTheme = useColorScheme() === 'light';
    return (
        <_Text
            style={[
                {
                    color: (() => {
                        if (muted) return light.secondaryText;
                        return lightTheme ? light.text : dark.text;
                    })(),
                    fontFamily: fontFamily.Bold,
                    fontSize: 18,
                    zIndex: 0,
                    elevation: 0,
                },
                center && {textAlign: 'center'},
                lightText && {color: colors.white},
            ]}>
            {children}
        </_Text>
    );
};
type mutedProps = {
    muted?: boolean;
};
export const Text = ({
    children,
    muted,
    small,
    center,
    light: lightText,
    bold,
}: props & mutedProps) => {
    const lightTheme = useColorScheme() === 'light';
    return (
        <_Text
            style={[
                {
                    color: lightTheme
                        ? muted
                            ? light.secondaryText
                            : light.text
                        : muted
                        ? dark.secondaryText
                        : dark.text,
                    fontFamily: bold ? fontFamily.Bold : fontFamily.Medium,
                    fontSize: small ? spacing.md * 2 : 15,
                },
                center && {textAlign: 'center'},
                lightText && {color: colors.white},
                bold && {fontFamily: fontFamily.SemiBold},
            ]}>
            {children}
        </_Text>
    );
};

type BTNProps = {
    secondary?: boolean;
    small?: boolean;
};
export const BTNText = ({children, secondary, small}: props & BTNProps) => {
    const lightTheme = useColorScheme() === 'light';
    return (
        <_Text
            style={[
                {
                    color: secondary
                        ? lightTheme
                            ? light.active
                            : colors.white
                        : colors.white,
                    fontFamily: fontFamily.SemiBold,
                    fontSize: small ? 15 : 20,
                },
            ]}>
            {children}
        </_Text>
    );
};
