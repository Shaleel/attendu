import {View, Text, useColorScheme} from 'react-native';
import React from 'react';
import {light, dark} from '../../constants/theme';
import spacing from '../../constants/spacing';
type props = {
    children: JSX.Element[];
    withHeader?: boolean;
    notpadded?: boolean;
};
const ScreenWrapper = ({children, withHeader, notpadded = false}: props) => {
    const lightTheme = useColorScheme() === 'light';
    return (
        <View
            style={[
                {
                    flex: 1,
                    backgroundColor: lightTheme
                        ? light.screenBackground
                        : dark.screenBackground,
                    padding: notpadded ? 0 : spacing.lg,
                },
                withHeader && {paddingTop: spacing.lg * 3.5},
            ]}>
            {children}
        </View>
    );
};

export default ScreenWrapper;
