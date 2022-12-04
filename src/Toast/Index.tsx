// App.jsx
import {View, Text, useColorScheme, Pressable} from 'react-native';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import palette from '../constants/colors';
import spacing from '../constants/spacing';
import InfoIcon from '../assets/icons/Info.svg';
import fontFamily from '../constants/fontFamily';
import CloseIcon from '../assets/icons/Close.svg';
import WarningIcon from '../assets/icons/Warning.svg';
import ErrorIcon from '../assets/icons/Error.svg';
import SuccessIcon from '../assets/icons/Success.svg';

/*
  1. Create the config
*/

export type toastProps = {
    type: 'info' | 'error' | 'warning' | 'success';
    message: string | undefined;
    withHeader?: boolean;
};
export const showToast = ({type, message}: toastProps) => {
    Toast.show({
        position: 'top',
        type: type,
        text1: message,
        topOffset: 10,
        props: {message: 'Please enter your email'},
    });
};
const getColor = (type: 'info' | 'error' | 'warning' | 'success') => {
    switch (type) {
        case 'info':
            return {
                background: palette.lightBlue,
                text: palette.primaryBlue,
            };
        case 'warning':
            return {
                background: palette.yellow,
                text: palette.darkYellow,
            };
        case 'success':
            return {
                background: palette.lightGreen,
                text: palette.green,
            };
        case 'error':
            return {
                background: palette.lightRed,
                text: palette.red,
            };

        default:
            break;
    }
};

const Base = ({type, message}: toastProps) => {
    const color = getColor(type);
    return (
        <View
            style={{
                minHeight: 60,
                width: '90%',
                borderRadius: spacing.md * 1.5,
                borderColor: 'rgb(216, 220, 222)',
                backgroundColor: color?.background,
                alignItems: 'center',
                padding: 20,
                flexDirection: 'row',
                zIndex: 20,
                elevation: 20,
            }}>
            {type === 'error' && <ErrorIcon height={30} />}
            {type === 'warning' && <WarningIcon height={30} />}
            {type === 'success' && <SuccessIcon height={30} />}
            {type === 'info' && <InfoIcon height={30} />}

            <View style={{marginLeft: 10}}>
                <Text
                    style={{
                        color: color?.text,
                        fontFamily: fontFamily.Bold,
                    }}>
                    {type.toLocaleUpperCase()}
                </Text>
                <Text
                    style={{
                        fontFamily: fontFamily.Regular,
                        color: color?.text,
                    }}>
                    {message}
                </Text>
            </View>
            <Pressable
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    padding: 20,
                    elevation: 5,
                    zIndex: 5,
                }}
                onPress={() => {
                    Toast.hide();
                }}>
                <CloseIcon strokeWidth={3} height={12} width={12} />
            </Pressable>
        </View>
    );
};
const toastConfig = {
    /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
    info: ({text1}: any) => {
        return <Base type="info" message={text1} />;
    },
    warning: ({text1}: any) => {
        return <Base type="warning" message={text1} />;
    },
    success: ({text1}: any) => {
        return <Base type="success" message={text1} />;
    },
    error: ({text1}: any) => {
        return <Base type="error" message={text1} />;
    },
};

export default toastConfig;
