import {Pressable, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {light} from '../../constants/theme';
import {Card} from '../../Components/Card';
import {Heading4, Text} from '../../Components/Typography';
import Schedule from '../../Queries/schedule';
import ArrowDown from '../../assets/icons/ArrowDown.svg';
import spacing from '../../constants/spacing';
import {useNavigation} from '@react-navigation/native';

export function formatedTime(date: Date) {
    let dateString = date.toLocaleTimeString('en-US');

    let splittedString = dateString.split(' ');
    let startPart = (() => {
        let arr = splittedString[0].split(':');

        return arr[0] + ':' + arr[1];
    })();
    let endPart = splittedString[1];

    return startPart + ' ' + endPart;
}

const ListItem = ({schedule}: any) => {
    const navigator = useNavigation();
    return (
        <Pressable
            onPress={() => {
                navigator.navigate(
                    'Attendance' as never,
                    {
                        scheduleId: schedule._ref._documentPath._parts[1],
                        classroomId: schedule._data.classId,
                    } as never,
                );
            }}>
            <Card>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <View>
                        <Heading4>{schedule._data.className}</Heading4>
                        <Text>
                            {`${formatedTime(
                                new Date(Number(schedule._data.start)),
                            )} - ${formatedTime(
                                new Date(Number(schedule._data.end)),
                            )}`}
                        </Text>
                    </View>
                    <Pressable style={{marginRight: 10}}>
                        <ArrowDown style={{transform: [{rotate: '270deg'}]}} />
                    </Pressable>
                </View>
            </Card>
        </Pressable>
    );
};

const ScheduleList = () => {
    const [scheduleList, setscheduleList] = useState<any>();

    useEffect(() => {
        const subscriber = Schedule.realTimeList({
            date: new Date(),
            onResult: snapshot => {
                let res = snapshot.docs;
                res.sort((a: any, b: any) => a._data.start - b._data.start);
                // console.log(res);
                setscheduleList(res);
            },
        });
        return () => {
            subscriber();
        };
    }, []);
    return (
        <View>
            {scheduleList && scheduleList.length > 0 ? (
                scheduleList.map((schedule: any, index: number) => (
                    <View key={index}>
                        <ListItem schedule={schedule} />
                        <View style={{marginBottom: spacing.sm}}></View>
                    </View>
                ))
            ) : (
                <View
                    style={{
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text bold muted>
                        No Schedule for today
                    </Text>
                </View>
            )}
        </View>
    );
};

export default ScheduleList;

const styles = StyleSheet.create({});
