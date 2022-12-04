import React from 'react';
import {View, StyleSheet, Pressable, useColorScheme} from 'react-native';
import spacing from '../../constants/spacing';
import {light, dark} from '../../constants/theme';
import {Text} from '../Typography';
import UserIcon from '../../assets/icons/User.svg';
import HomeDefault from '../../assets/icons/BottomTab/Home.Default.svg';
import HomeSelected from '../../assets/icons/BottomTab/Home.Selected.svg';
import ScheduleDefault from '../../assets/icons/BottomTab/Schedule.Default.svg';
import ScheduleSelected from '../../assets/icons/BottomTab/Schedule.Selected.svg';
import ChatDefault from '../../assets/icons/BottomTab/Chat.Default.svg';
import ChatSelected from '../../assets/icons/BottomTab/Chat.Selected.svg';
import ChartDefault from '../../assets/icons/BottomTab/Chart.Default.svg';
import ChartSelected from '../../assets/icons/BottomTab/Chart.Selected.svg';
import ProfileDefault from '../../assets/icons/BottomTab/Profile.Default.svg';
import ProfileSelected from '../../assets/icons/BottomTab/Profile.Selected.svg';

const BottomTab = ({state, descriptors, navigation}: any) => {
    const lightTheme = useColorScheme() === 'light';
    return (
        <View
            style={[
                styles.bar,
                lightTheme ? styles.barBGLight : styles.barBGDark,
            ]}>
            {state.routes.map((route: any, index: number) => {
                const {options} = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        // The `merge: true` option makes sure that the params inside the tab screen are preserved
                        navigation.navigate({name: route.name, merge: true});
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <Pressable
                        accessibilityRole="button"
                        accessibilityState={isFocused ? {selected: true} : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        key={index}
                        style={[
                            styles.element,
                            isFocused && {
                                backgroundColor: light.selectedInput,
                            },
                        ]}>
                        <View
                            style={[
                                {
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                },
                            ]}>
                            {label === 'Home' &&
                                (isFocused ? (
                                    <HomeSelected
                                        height={spacing.lg}
                                        width={spacing.lg}
                                    />
                                ) : (
                                    <HomeDefault
                                        height={spacing.lg}
                                        width={spacing.lg}
                                    />
                                ))}

                            {label === 'Schedule' &&
                                (isFocused ? (
                                    <ScheduleSelected
                                        height={spacing.lg}
                                        width={spacing.lg}
                                    />
                                ) : (
                                    <ScheduleDefault
                                        height={spacing.lg}
                                        width={spacing.lg}
                                    />
                                ))}

                            {label === 'Chat' &&
                                (isFocused ? (
                                    <ChatSelected
                                        height={spacing.lg}
                                        width={spacing.lg}
                                    />
                                ) : (
                                    <ChatDefault
                                        height={spacing.lg}
                                        width={spacing.lg}
                                    />
                                ))}

                            {label === 'Chart' &&
                                (isFocused ? (
                                    <ChartSelected
                                        height={spacing.lg}
                                        width={spacing.lg}
                                    />
                                ) : (
                                    <ChartDefault
                                        height={spacing.lg}
                                        width={spacing.lg}
                                    />
                                ))}

                            {label === 'Profile' &&
                                (isFocused ? (
                                    <ProfileSelected
                                        height={spacing.lg}
                                        width={spacing.lg}
                                    />
                                ) : (
                                    <ProfileDefault
                                        height={spacing.lg}
                                        width={spacing.lg}
                                    />
                                ))}
                        </View>
                    </Pressable>
                );
            })}
        </View>
    );
};

export default BottomTab;

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        elevation: 25,
        zIndex: 10,
        padding: spacing.lg,
        borderTopLeftRadius: spacing.lg,
        borderTopRightRadius: spacing.lg,
    },
    barBGLight: {
        backgroundColor: light.inputBG,
    },
    barBGDark: {
        backgroundColor: dark.inputBG,
    },
    element: {
        padding: spacing.md,
        borderRadius: spacing.md,
    },
});
