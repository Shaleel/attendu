import {
    StyleSheet,
    Text,
    View,
    Pressable,
    useColorScheme,
    ScrollView,
} from 'react-native';
import React, {useState, useRef} from 'react';
import spacing from '../../constants/spacing';
import {light, dark} from '../../constants/theme';
import fontFamily from '../../constants/fontFamily';
import palette from '../../constants/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import ArrowDown from '../../assets/icons/ArrowDown.svg';
import ListItem from './ListItem';
import {styles as InputStyles} from '../Input/Input';

type props = {
    list: any[];
    value: any;
    setValue: React.SetStateAction<any>;
    renderer: (param: any) => string | number | undefined;
    placeholder?: string;
};
const Select = ({list, value, setValue, renderer, placeholder}: props) => {
    const [focussed, setfocussed] = useState(false);
    const lightTheme = useColorScheme() === 'light';
    const SelectRef = useRef();
    return (
        <Pressable
            onPress={() => {
                setfocussed(true);
                SelectRef.current.open();
            }}
            style={[
                styles.wrapper,
                InputStyles.wrapper,
                focussed
                    ? InputStyles.focussed
                    : lightTheme
                    ? InputStyles.notFocussedL
                    : InputStyles.notFocussedD,
            ]}>
            <Text style={styles.text}>
                {value ? renderer(value) : placeholder ? placeholder : 'Select'}
            </Text>
            <View>
                <ArrowDown height={spacing.md * 2} />
            </View>
            <RBSheet
                ref={SelectRef}
                animationType={'fade'}
                closeOnDragDown={true}
                height={300}
                openDuration={250}
                dragFromTopOnly={true}
                onClose={() => setfocussed(false)}
                customStyles={{
                    wrapper: {
                        // backgroundColor: 'transparent',
                    },
                    container: {
                        borderTopLeftRadius: spacing.lg,
                        borderTopRightRadius: spacing.lg,

                        paddingTop: spacing.sm,
                        backgroundColor: lightTheme
                            ? light.cardBackground
                            : dark.cardBackground,
                        elevation: 10,
                    },
                }}>
                <ScrollView style={styles.bottomSheet}>
                    {list ? (
                        list.map((item, index) => (
                            <ListItem
                                pressHandler={() => {
                                    setValue(item);
                                    // setfocussed(false);
                                }}
                                key={item + index}
                                val={renderer(item)}
                                isSelected={item == value}
                            />
                        ))
                    ) : (
                        <></>
                    )}
                </ScrollView>
            </RBSheet>
        </Pressable>
    );
};

export default Select;

const styles = StyleSheet.create({
    wrapper: {
        padding: spacing.md * 1.5,
        borderWidth: 1,
        borderColor: light.activeBorder,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: spacing.md,
        marginTop: spacing.md,
        marginBottom: spacing.md,
    },
    bottomSheet: {
        padding: spacing.md,
    },
    text: {
        fontSize: spacing.lg,
        fontFamily: fontFamily.Bold,
        color: palette.grey,
    },
});
