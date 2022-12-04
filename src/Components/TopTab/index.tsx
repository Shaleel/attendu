import {Animated, View, Pressable, Dimensions} from 'react-native';
import spacing from '../../constants/spacing';
import {Text, Heading3} from '../Typography/index';
import colors from '../../constants/colors';
import {useRef, useEffect} from 'react';

export default function TopTabBar({
    state,
    descriptors,
    navigation,
    position,
}: any) {
    const {width} = Dimensions.get('screen');
    const translation = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(translation, {
            toValue: (state.index * width) / state.routes.length,
            useNativeDriver: true,
            duration: 200,
        }).start();
    }, [state.index]);
    return (
        <View style={{position: 'relative'}}>
            <View style={{flexDirection: 'row', borderBottomWidth: 0.5}}>
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
                            navigation.navigate({
                                name: route.name,
                                merge: true,
                            });
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
                            key={route + index}
                            onPress={onPress}
                            style={{
                                flex: 1,
                                padding: spacing.lg,
                            }}>
                            <Heading3 bold center>
                                {label}
                            </Heading3>
                        </Pressable>
                    );
                })}
            </View>
            <Animated.View
                style={{
                    width: '33.3%',
                    height: 3,
                    backgroundColor: colors.primaryBlue,
                    position: 'absolute',
                    transform: [{translateX: translation}],
                    bottom: 0,
                }}></Animated.View>
        </View>
    );
}
