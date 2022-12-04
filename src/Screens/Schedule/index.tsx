import {StyleSheet, View} from 'react-native';
import {useState} from 'react';
import ScreenWrapper from '../../Components/ScreenWrapper/index';
import Header from '../../Components/Header/index';
import HorizontalCalendar from '../../Components/HorizontalCalendar';
import {Text, Heading3} from '../../Components/Typography';
import ScheduleList from './ScheduleList';
import Toast from 'react-native-toast-message';
import toastConfig, {showToast} from '../../Toast/Index';
const Schedule = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    return (
        <ScreenWrapper withHeader>
            <Header title="Schedule" />
            <View>
                <HorizontalCalendar
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
            </View>
            <Toast config={toastConfig} />
            {/* <Heading3>{selectedDate.toLocaleDateString()}</Heading3> */}
            <ScheduleList showToast={showToast} selectedDate={selectedDate} />
        </ScreenWrapper>
    );
};

export default Schedule;

const styles = StyleSheet.create({});
