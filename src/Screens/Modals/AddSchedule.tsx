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
import schedule from '../../Queries/schedule';
import Toast from 'react-native-toast-message';
import toastConfig, {showToast} from '../../Toast/Index';

function getDefaultTime(hour: number) {
    let date = new Date();

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hour,
        0,
        0,
        0,
    );
}

const AddSchedule = ({route}: any) => {
    const [classList, setclassList] = useState<any>();
    const [selectedClass, setselectedClass] = useState<any>();
    const {hour, selectedDate} = route.params;
    const [loading, setloading] = useState(false);
    const [date, setdate] = useState<Date | undefined>(
        selectedDate ? new Date(selectedDate) : new Date(),
    );
    const [startTime, setstartTime] = useState<Date | undefined>(
        getDefaultTime(hour),
    );
    const [endTime, setendTime] = useState<Date | undefined>(
        getDefaultTime(hour + 1),
    );
    useEffect(() => {
        async function fetchLists() {
            const res = await classroom.list();
            setclassList(res);
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
        schedule
            .create({
                classroom: selectedClass._data,
                date: date.toLocaleDateString(),
                start: startTime,
                end: endTime,
            })
            .then(success => {
                showToast({
                    type: 'success',
                    message: 'Schedule added successfully.',
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
            <Header isModalHeader title="Add Schedule" />
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

            <View style={{flexDirection: 'row', marginTop: spacing.lg}}>
                <Button
                    isLoading={loading}
                    onPress={handleSubmit}
                    title="Add Schedule"
                />
            </View>
        </ScreenWrapper>
    );
};

export default AddSchedule;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: spacing.md,
    },
});
