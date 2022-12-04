import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    useColorScheme,
    Pressable,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import palette from '../../constants/colors';
import {light, dark} from '../../constants/theme';
import spacing from '../../constants/spacing';
import fontFamily from '../../constants/fontFamily';
import {useNavigation} from '@react-navigation/native';
import Schedule from '../../Queries/schedule';
import {Heading4} from '../../Components/Typography';
import BottomSheet from './BottomSheet';
import {toastProps} from '../../Toast/Index';

function formatedTime(date: Date) {
    let dateString = date.toLocaleTimeString('en-US');

    let splittedString = dateString.split(' ');
    let startPart = (() => {
        let arr = splittedString[0].split(':');

        return arr[0] + ':' + arr[1];
    })();
    let endPart = splittedString[1];

    return startPart + ' ' + endPart;
}
const SEPERATOR_WIDTH = 1;
const Seperator = () => <View style={styles.seperator}></View>;

const Hour = ({
    title,
    index,
    selectedDate,
}: {
    title: string;
    index: number;
    selectedDate: Date;
}) => {
    const navigator = useNavigation();
    return (
        <Pressable
            onPress={() => {
                navigator.navigate(
                    'AddSchedule' as never,
                    {
                        hour: index,
                        selectedDate: selectedDate.valueOf(),
                    } as never,
                );
            }}
            style={[styles.hour]}>
            <Text style={styles.hourText}>{title}</Text>
            {title === '12' && (
                <Text style={styles.hourTextSecondary}>
                    {index === 0 ? 'AM' : 'PM'}
                </Text>
            )}
        </Pressable>
    );
};

const calculateTopPosition = (startTime: Date) => {
    let hour = startTime.getHours();
    let minutes = startTime.getMinutes();
    let seperators = hour * SEPERATOR_WIDTH;

    return hour * 60 + minutes + seperators * 2;
};
const calculateCellHeight = (startTime: Date, endTime: Date) => {
    let diffMinutes: number =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60);

    let hours = Math.floor(diffMinutes / 60);
    if (hours > 1) diffMinutes += hours * SEPERATOR_WIDTH * 2;

    return diffMinutes;
};

const Class = ({
    title,
    startTime,
    endTime,
    color,
    pressHandler,
}: {
    title: string;
    startTime: Date;
    endTime: Date;
    color: string;
    pressHandler: () => void;
}) => {
    const navigator = useNavigation();
    return (
        <Pressable
            onPress={pressHandler}
            style={[
                styles.class,
                {
                    height: calculateCellHeight(startTime, endTime),
                    top: calculateTopPosition(startTime),
                    backgroundColor: color,
                },
            ]}>
            <Text style={styles.classText}>{title}</Text>
            <Text style={styles.classText}>{`${formatedTime(
                startTime,
            )} - ${formatedTime(endTime)}`}</Text>
        </Pressable>
    );
};

const HOURS = [
    '12',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
];

const ClassCount = ({count}: {count: number}) => {
    return (
        <View
            style={{
                position: 'absolute',
                padding: spacing.sm,
                top: -5,
                right: -5,
                backgroundColor: palette.green,
                borderRadius: spacing.md,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Heading4 light>
                {count + ' Class' + (count > 1 ? 'es' : '')}
            </Heading4>
        </View>
    );
};

const ScheduleList = ({
    selectedDate,
    showToast,
}: {
    selectedDate: Date;
    showToast: (props: toastProps) => void;
}) => {
    const lightTheme = useColorScheme() === 'light';
    const [scheduleList, setscheduleList] = useState<any>();
    const [classId, setclassId] = useState<any>();
    const [selectedSchedule, setselectedSchedule] = useState<string>('');
    const BottomSheetRef = useRef<any>();
    useEffect(() => {
        const subscriber = Schedule.realTimeList({
            date: selectedDate,
            onResult: snapshot => {
                setscheduleList(snapshot.docs);
            },
        });
        return () => {
            subscriber();
        };
    }, [selectedDate]);
    return (
        <View style={{flex: 1, position: 'relative'}}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={true}
                style={[styles.wrapper, !lightTheme && styles.darkWrapper]}>
                {HOURS.map((h, i) => (
                    <View key={h + i}>
                        <Hour selectedDate={selectedDate} index={i} title={h} />
                        <Seperator />
                    </View>
                ))}
                {scheduleList ? (
                    scheduleList.map((item: any, key: number) => (
                        <Class
                            color={item._data.accentColor}
                            title={item._data.className}
                            key={key}
                            startTime={new Date(Number(item._data.start))}
                            endTime={new Date(Number(item._data.end))}
                            pressHandler={() => {
                                setclassId(item._data.classId);
                                setselectedSchedule(item.ref.id);
                                BottomSheetRef.current.open();
                            }}
                        />
                    ))
                ) : (
                    <></>
                )}
            </ScrollView>
            <ClassCount count={scheduleList?.length || 0} />
            <BottomSheet
                showToast={showToast}
                classroomId={classId}
                scheduleId={selectedSchedule}
                sheetRef={BottomSheetRef}
            />
        </View>
    );
};

export default ScheduleList;

const styles = StyleSheet.create({
    seperator: {
        borderWidth: SEPERATOR_WIDTH,
        borderColor: light.border,
    },
    wrapper: {
        backgroundColor: light.cardBackground,
        elevation: 1,
        borderBottomLeftRadius: spacing.md,
        borderBottomRightRadius: spacing.md,
    },
    darkWrapper: {
        backgroundColor: dark.cardBackground,
    },
    text: {
        padding: 50,
    },
    hour: {
        height: 60,
        paddingLeft: spacing.md,
    },
    hourText: {
        fontFamily: fontFamily.Bold,
        fontSize: spacing.md * 1.5,
    },
    hourTextSecondary: {
        fontFamily: fontFamily.Regular,
        fontSize: spacing.md,
    },
    class: {
        position: 'absolute',
        width: '90%',
        left: spacing.lg * 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: spacing.lg,
    },
    classText: {
        color: palette.white,
        fontFamily: fontFamily.Bold,
    },
});
