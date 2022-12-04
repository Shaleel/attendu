import {StyleSheet, Pressable, View} from 'react-native';
import React, {useState, useEffect, useMemo} from 'react';
import Header from '../../Components/Header';
import {Heading3, Heading2, Text} from '../../Components/Typography';
import {CalendarInput, TimeInput} from '../../Components/Input/Input';
import Select from '../../Components/Select';
import spacing from '../../constants/spacing';
import ScreenWrapper from '../../Components/ScreenWrapper/index';
import {Button} from '../../Components/Buttons';
import classroom from '../../Queries/classroom';
import Schedule from '../../Queries/schedule';
import Toast from 'react-native-toast-message';
import toastConfig, {showToast} from '../../Toast/Index';
import {useNavigation} from '@react-navigation/native';

function getDate(dateString: string) {
    let date = dateString.split('/');

    return new Date(
        Number(date[2]),
        Number(date[1]) - 1,
        Number(date[0]),
        0,
        0,
        0,
        0,
    );
}

const EditSchedule = ({route}: any) => {
    const [classList, setclassList] = useState<any>();
    const [selectedClass, setselectedClass] = useState<any>();
    const {scheduleId, hour} = route.params;
    // console.log('schedule', JSON.stringify(schedule, null, 4));
    const [loading, setloading] = useState(false);
    const [date, setdate] = useState<Date | undefined>();
    const [startTime, setstartTime] = useState<Date | undefined>();
    // const [schedule, setschedule] = useState<any>();
    const navigator = useNavigation();
    const [endTime, setendTime] = useState<Date | undefined>();
    // getDefaultTime(hour + 1),
    useEffect(() => {
        async function fetchLists() {
            const res: any = await classroom.list();
            const sc: any = await Schedule.get(scheduleId);
            const classData = await classroom.get(sc.classId);
            setclassList(res);
            // setschedule(sc);
            setselectedClass(classData);
            setstartTime(new Date(Number(sc.start)));
            setendTime(new Date(Number(sc.end)));
            setdate(getDate(sc.date));
        }
        fetchLists();
    }, []);

    const handleSubmit = async () => {
        if (startTime && endTime && startTime?.valueOf() > endTime?.valueOf()) {
            showToast({
                type: 'warning',
                message: 'End time cannot be less than the start time',
            });
            return;
        }
        if (!selectedClass) {
            showToast({
                type: 'error',
                message: 'Class not selected',
            });
            return;
        }

        if (!date) {
            showToast({
                type: 'error',
                message: 'Date not selected',
            });
            return;
        }

        setloading(true);
        Schedule.update({
            id: scheduleId,
            classroom: selectedClass._data,
            date: date.toLocaleDateString(),
            start: startTime,
            end: endTime,
        })
            .then(success => {
                showToast({
                    type: 'success',
                    message: 'Schedule updated successfully.',
                });
                setloading(false);
            })
            .catch(error => {
                // console.log(message.message);
                showToast({
                    type: 'error',
                    message: error.message,
                });
                setloading(false);
            });
    };
    return (
        <ScreenWrapper withHeader>
            <Header isModalHeader title="Edit Schedule" />
            <Toast config={toastConfig} />

            <Heading3>Class</Heading3>

            {classList ? (
                <Select
                    value={selectedClass}
                    setValue={setselectedClass}
                    list={classList}
                    renderer={item => item._data?.name}
                    placeholder="Select Classroom"
                />
            ) : (
                <></>
            )}

            <Heading3>Timings</Heading3>

            <View style={styles.row}>
                <Text>Start </Text>
                <Text>End </Text>
            </View>
            <View style={styles.row}>
                <TimeInput
                    defaultHour={hour}
                    onChange={setstartTime}
                    value={startTime}
                />
                <TimeInput
                    defaultHour={hour + 1}
                    onChange={setendTime}
                    value={endTime}
                />
            </View>

            <Heading3>Date</Heading3>
            <CalendarInput
                value={date}
                minimumDate={new Date()}
                onChange={setdate}
            />

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: spacing.lg,
                }}>
                <Button
                    secondary
                    onPress={() => {
                        navigator.goBack();
                    }}
                    title="Cancel"
                />
                <View style={{margin: spacing.md}}></View>
                <Button
                    isLoading={loading}
                    onPress={handleSubmit}
                    title="Save changes"
                />
            </View>
        </ScreenWrapper>
    );
};

export default EditSchedule;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: spacing.md,
    },
});
