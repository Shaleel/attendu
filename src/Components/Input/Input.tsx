import {
    Text,
    View,
    TextInput,
    StyleSheet,
    Pressable,
    useColorScheme,
} from 'react-native';
import React, {useState, Dispatch, SetStateAction} from 'react';
import spacing from '../../constants/spacing';
import fontFamily from '../../constants/fontFamily';
import {light, dark} from '../../constants/theme';
import palette from '../../constants/colors';
import EmailIcon from '../../assets/icons/Message.svg';
import LockIcon from '../../assets/icons/Lock.svg';
import HideIcon from '../../assets/icons/Hide.svg';
import ShowIcon from '../../assets/icons/Show.svg';
import UserIcon from '../../assets/icons/User.svg';
import SearchIcon from '../../assets/icons/MagnifyingGlass.svg';
import CalendarIcon from '../../assets/icons/BottomTab/Schedule.Default.svg';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {Heading2} from '../Typography';
import {Card} from '../Card';

type inputProps = {
    placeholder?: string;
    leftIcon?: any;
    type?: 'email' | 'name' | 'password' | 'search';
    value: string | undefined;
    onChange: Dispatch<SetStateAction<string>>;
    autoFocus?: boolean;
};

type calendarInputProps = {
    value: Date | undefined;
    onChange: Dispatch<SetStateAction<Date | undefined>>;
    minimumDate?: Date;
};

type timeInputProps = {
    defaultHour: number;
};

const getDefaultTime = (hour: number): string => {
    if (hour === 0) return '12:00 AM';
    let res = `${hour}:00 AM`;
    if (hour > 12) {
        res = `${hour - 12}:00 PM`;
    }
    return res;
};

const getTime = (time: Date) => {
    let hours = time.getHours();
    let minutes = time.getMinutes();

    return `${hours > 12 ? hours - 12 : hours}:${
        minutes < 10 ? '0' : ''
    }${minutes} ${hours > 12 ? 'PM' : 'AM'}`;
};

const getTimeFromHour = (hour: number) => {
    let time = new Date();
    time.setHours(hour);
    time.setMinutes(0);
    return time;
};
export const Input = ({
    placeholder,
    type,
    value,
    onChange,
    autoFocus,
}: inputProps) => {
    const [focussed, setfocussed] = useState<boolean>(false);
    const lightTheme = useColorScheme() === 'light';

    return (
        <View
            style={[
                styles.wrapper,
                focussed
                    ? styles.focussed
                    : lightTheme
                    ? styles.notFocussedL
                    : styles.notFocussedD,
            ]}>
            <View style={styles.leftIcon}>
                {type === 'email' && <EmailIcon height={spacing.lg} />}
                {type === 'name' && <UserIcon height={spacing.lg} />}
                {type === 'search' && <SearchIcon height={spacing.lg} />}
            </View>
            <TextInput
                placeholder={placeholder || 'Placeholder'}
                onFocus={() => setfocussed(true)}
                onBlur={() => setfocussed(false)}
                style={styles.textInput}
                placeholderTextColor={palette.grey}
                value={value}
                onChangeText={onChange}
                autoFocus={autoFocus}
            />
        </View>
    );
};

export const TimeInput = ({
    value,
    defaultHour,
    onChange,
}: calendarInputProps & timeInputProps) => {
    const [show, setshow] = useState<boolean>(false);
    return (
        <Pressable
            onPress={() => {
                setshow(true);
            }}>
            <Card>
                <Heading2>
                    {value ? getTime(value) : getDefaultTime(defaultHour)}
                </Heading2>
            </Card>
            {show ? (
                <RNDateTimePicker
                    onChange={(event, date) => {
                        setshow(false);
                        onChange(date);
                    }}
                    value={value || getTimeFromHour(defaultHour)}
                    mode={'time'}
                />
            ) : (
                <></>
            )}
        </Pressable>
    );
};

export const CalendarInput = ({
    value,
    onChange,
    minimumDate,
}: calendarInputProps) => {
    const [focussed, setfocussed] = useState<boolean>(false);
    const lightTheme = useColorScheme() === 'light';

    return (
        <Pressable
            onPress={() => {
                setfocussed(!focussed);
            }}
            style={[
                styles.wrapper,
                focussed
                    ? styles.focussed
                    : lightTheme
                    ? styles.notFocussedL
                    : styles.notFocussedD,
                {padding: spacing.md * 1.5},
            ]}>
            <View style={styles.leftIcon}>
                <CalendarIcon height={spacing.lg} />
            </View>
            <Text style={styles.textInput}>{value?.toDateString()}</Text>

            {focussed ? (
                <RNDateTimePicker
                    value={value || new Date()}
                    minimumDate={minimumDate}
                    onChange={(event, date) => {
                        setfocussed(false);
                        onChange(date);
                    }}
                />
            ) : (
                <></>
            )}
        </Pressable>
    );
};

export const PasswordInput = ({placeholder, value, onChange}: inputProps) => {
    const [focussed, setfocussed] = useState<boolean>(false);
    const [hide, sethide] = useState(true);
    const lightTheme = useColorScheme() === 'light';

    return (
        <View
            style={[
                styles.wrapper,
                focussed
                    ? styles.focussed
                    : lightTheme
                    ? styles.notFocussedL
                    : styles.notFocussedD,
            ]}>
            <View style={styles.leftIcon}>
                <LockIcon height={spacing.lg} />
            </View>

            <TextInput
                secureTextEntry={hide}
                placeholder={placeholder || 'Placeholder'}
                onFocus={() => setfocussed(true)}
                onBlur={() => setfocussed(false)}
                style={styles.textInput}
                placeholderTextColor={palette.grey}
                value={value}
                onChangeText={onChange}
            />
            <Pressable onPress={() => sethide(!hide)} style={styles.leftIcon}>
                {hide ? (
                    <ShowIcon height={spacing.lg} />
                ) : (
                    <HideIcon height={spacing.lg} />
                )}
            </Pressable>
        </View>
    );
};

export const styles = StyleSheet.create({
    wrapper: {
        borderWidth: 1,
        flexDirection: 'row',
        borderRadius: spacing.md,
        borderColor: 'transparent',
        paddingLeft: spacing.md,
        marginTop: spacing.lg,
    },
    textInput: {
        flex: 1,
        fontSize: spacing.lg,
        fontFamily: fontFamily.Medium,
        color: palette.darkgrey,
    },
    focussed: {
        backgroundColor: light.selectedInput,
        borderColor: light.activeBorder,
    },
    notFocussedL: {
        backgroundColor: light.inputBG,
    },
    notFocussedD: {
        backgroundColor: dark.inputBG,
    },
    leftIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
});
