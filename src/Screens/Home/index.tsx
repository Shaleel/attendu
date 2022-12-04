import {
    View,
    Pressable,
    StyleSheet,
    Image,
    ScrollView,
    useColorScheme,
} from 'react-native';
import React, {useContext, useRef} from 'react';
import {AuthContext} from '../../Navigation/AuthProvider';
import ScreenWrapper from '../../Components/ScreenWrapper/index';
import {Text, Heading3, Heading2} from '../../Components/Typography';
import spacing from '../../constants/spacing';
import ExitIcon from '../../assets/icons/Exit.svg';
import {light, dark} from '../../constants/theme';
import {useNavigation} from '@react-navigation/native';
import routes from '../../constants/routes';
import {Anchor, Button} from '../../Components/Buttons';
import ClassroomList from './ClassroomList';
import ScheduleList from './ScheduleList';
import RBSheet from 'react-native-raw-bottom-sheet';
import ScheduleSelected from '../../assets/icons/BottomTab/Schedule.Selected.svg';
import palette from '../../constants/colors';
const Home = () => {
    const lightTheme = useColorScheme() === 'light';
    const {user, logout} = useContext(AuthContext);
    const navigation = useNavigation();
    const LogoutRef = useRef<any>();
    return (
        <ScreenWrapper>
            {/* Header */}
            <View style={styles.header}>
                <View style={{flexDirection: 'row', flex: 1}}>
                    {user.profilePicture ? (
                        <Image
                            style={styles.userImg}
                            source={{uri: user.profilePicture}}
                        />
                    ) : (
                        <View
                            style={[
                                styles.userImg,
                                {backgroundColor: light.active},
                            ]}>
                            <Heading2 bold light>
                                {user.name[0]}
                            </Heading2>
                        </View>
                    )}
                    <View>
                        <Text muted>Hello 👋</Text>
                        <Heading3>{user.name}</Heading3>
                    </View>
                </View>

                <Pressable
                    onPress={() => {
                        LogoutRef.current.open();
                    }}
                    style={({pressed}) => [
                        styles.notification,
                        pressed && styles.pressedBTN,
                    ]}>
                    <ExitIcon height={22} />
                </Pressable>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{marginTop: spacing.lg}}>
                <View style={[styles.row, {marginBottom: spacing.lg}]}>
                    <Heading3>🗓️ Today's Schedule</Heading3>
                    <Anchor
                        onPress={() => {
                            navigation.navigate(
                                'AddSchedule' as never,
                                {
                                    hour: 9, //default
                                } as never,
                            );
                        }}>
                        + Add
                    </Anchor>
                </View>
                <ScheduleList />
                <View style={[styles.row, {marginBottom: spacing.lg}]}>
                    <Heading3>✏️ Classrooms</Heading3>
                    <Anchor
                        onPress={() => {
                            navigation.navigate('AddClass' as never);
                        }}>
                        + Add
                    </Anchor>
                </View>
                <ClassroomList />
            </ScrollView>

            <Pressable
                onPress={() => {
                    navigation.navigate('Schedule' as never);
                }}
                style={({pressed}) => [
                    styles.scheduleButton,
                    pressed && styles.pressedBTN,
                ]}>
                <ScheduleSelected height={50} />
            </Pressable>
            <RBSheet
                ref={LogoutRef}
                animationType={'fade'}
                closeOnDragDown={true}
                height={150}
                openDuration={250}
                dragFromTopOnly={true}
                customStyles={{
                    wrapper: {
                        // backgroundColor: 'transparent',
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
                <View style={{padding: spacing.md}}>
                    <Heading3 center>
                        Are you sure you want to Logout ?
                    </Heading3>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: spacing.md,
                        }}>
                        <Button
                            onPress={() => {
                                LogoutRef.current.close();
                            }}
                            secondary
                            title="Cancel"></Button>
                        <View style={{marginLeft: spacing.md}}></View>
                        <Button onPress={logout} danger title="Logout"></Button>
                    </View>
                </View>
            </RBSheet>
        </ScreenWrapper>
    );
};

export default Home;

const styles = StyleSheet.create({
    header: {flexDirection: 'row'},
    userImg: {
        height: spacing.lg * 2,
        width: spacing.lg * 2,
        borderRadius: spacing.lg * 2,
        marginRight: spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notification: {
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: light.border,
    },
    scheduleButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: light.border,
        backgroundColor: palette.lightBlue,
    },
    pressedBTN: {
        backgroundColor: light.inputBG,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
