import {StyleSheet, Text, View, Pressable, useColorScheme} from 'react-native';
import React from 'react';
import spacing from '../../constants/spacing';
import {light, dark} from '../../constants/theme';
import RBSheet from 'react-native-raw-bottom-sheet';
import DocumentIcon from '../../assets/icons/Document.svg';
import BinIcon from '../../assets/icons/Bin.svg';
import EditIcon from '../../assets/icons/Edit.svg';
import {Heading4} from '../../Components/Typography';
import colors from '../../constants/colors';
import {useNavigation} from '@react-navigation/native';
import Schedule from '../../Queries/schedule';
import {toastProps} from '../../Toast/Index';

type props = {
    sheetRef: React.MutableRefObject<any>;
    scheduleId: string;
    classroomId: string;
    showToast: (props: toastProps) => void;
};
const BottomSheet = ({sheetRef, scheduleId, showToast, classroomId}: props) => {
    const navigator = useNavigation();
    const lightTheme = useColorScheme() === 'light';

    // (()=>)
    return (
        <RBSheet
            ref={sheetRef}
            animationType={'fade'}
            closeOnDragDown={true}
            height={150}
            openDuration={250}
            dragFromTopOnly={true}
            customStyles={{
                wrapper: {
                    elevation: 0,
                    zIndex: 0,
                },
                container: {
                    borderTopLeftRadius: spacing.lg,
                    borderTopRightRadius: spacing.lg,

                    paddingTop: spacing.sm,
                    backgroundColor: lightTheme
                        ? light.cardBackground
                        : dark.cardBackground,
                    elevation: 20,
                    // zIndex: 0,
                },
            }}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    padding: spacing.lg,
                }}>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Pressable
                        onPress={() => {
                            navigator.navigate(
                                'Attendance' as never,
                                {
                                    scheduleId: scheduleId,
                                    classroomId: classroomId,
                                } as never,
                            );
                        }}
                        style={({pressed}) => [
                            styles.icon,
                            pressed && styles.pressedIcon,
                        ]}>
                        <DocumentIcon />
                    </Pressable>
                    <Heading4>Attendance</Heading4>
                </View>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Pressable
                        style={({pressed}) => [
                            styles.icon,
                            pressed && styles.pressedIcon,
                        ]}
                        onPress={() => {
                            sheetRef.current.close();
                            navigator.navigate(
                                'EditSchedule' as never,
                                {
                                    scheduleId: scheduleId,
                                    hour: 3,
                                } as never,
                            );
                        }}>
                        <EditIcon />
                    </Pressable>
                    <Heading4>Edit</Heading4>
                </View>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Pressable
                        onPress={async () => {
                            Schedule.delete(scheduleId)
                                .then((message: any) => {
                                    showToast({
                                        type: 'success',
                                        message: message,
                                    });
                                })
                                .catch((error: any) => {
                                    showToast({
                                        type: error.type,
                                        message: error.message,
                                    });
                                });

                            sheetRef.current.close();
                        }}
                        style={({pressed}) => [
                            styles.icon,
                            pressed && styles.pressedIcon,
                        ]}>
                        <BinIcon />
                    </Pressable>
                    <Heading4>Delete</Heading4>
                </View>
            </View>
        </RBSheet>
    );
};

export default BottomSheet;

const styles = StyleSheet.create({
    icon: {
        padding: spacing.lg,
        borderWidth: 1,
        borderRadius: spacing.lg,
        marginBottom: spacing.md,
        borderColor: colors.darkBlack,
    },
    pressedIcon: {
        backgroundColor: colors.grey,
    },
});
