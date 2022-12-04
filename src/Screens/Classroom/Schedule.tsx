import {ScrollView, Pressable, useColorScheme, View} from 'react-native';
import React, {useState, useContext, useRef, useEffect} from 'react';
import ScreenWrapper from '../../Components/ScreenWrapper';
import {CalendarInput} from '../../Components/Input/Input';
import {Text, Heading4} from '../../Components/Typography';
import {AuthContext} from '../../Navigation/AuthProvider';
import {Card} from '../../Components/Card';
import spacing from '../../constants/spacing';
import {light, dark} from '../../constants/theme';
import RBSheet from 'react-native-raw-bottom-sheet';
import schedule from '../../Queries/schedule';
import {formatedTime} from '../Home/ScheduleList';
import DocumentIcon from '../../assets/icons/Document.svg';
import {useNavigation} from '@react-navigation/native';
const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const ListItem = ({id, schedule}: any) => {
    const navigator = useNavigation();
    return (
        <Pressable
            onPress={() => {
                navigator.navigate(
                    'Attendance' as never,
                    {classroomId: schedule.classId, scheduleId: id} as never,
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
                        <Heading4>{schedule.date}</Heading4>
                        <Text>
                            {`${formatedTime(
                                new Date(Number(schedule.start)),
                            )} - ${formatedTime(
                                new Date(Number(schedule.end)),
                            )}`}
                        </Text>
                    </View>
                    <Pressable style={{marginRight: 10}}>
                        <DocumentIcon />
                    </Pressable>
                </View>
            </Card>
        </Pressable>
    );
};

const Seperator = () => <View style={{marginBottom: spacing.sm}}></View>;
const Schedule = ({classroomId}: {classroomId: string}) => {
    const {user, setUser} = useContext(AuthContext);
    const [scheduleList, setscheduleList] = useState<any>();

    useEffect(() => {
        const fetchSchedules = async () => {
            let res: any = await schedule.list({
                classroomId: classroomId,
            });
            setscheduleList(res);
            // currMonth = new Date(Number(res._docs[0]._data.start)).getMonth();

            // console.log(currMonth);
        };
        fetchSchedules();
    }, []);
    return (
        <ScreenWrapper>
            {scheduleList ? (
                <ScrollView>
                    {scheduleList._docs.map((schedule: any, index: number) => (
                        <View key={index}>
                            <ListItem
                                id={schedule._ref._documentPath._parts[1]}
                                schedule={schedule._data}
                            />
                            <Seperator />
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <></>
            )}

            {scheduleList && !scheduleList._docs.length ? (
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text muted bold>
                        You have no schedules
                    </Text>
                </View>
            ) : (
                <></>
            )}
        </ScreenWrapper>
    );
};

export default Schedule;
