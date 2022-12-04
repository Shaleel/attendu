import {
    StyleSheet,
    View,
    Pressable,
    useColorScheme,
    Dimensions,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import ScreenWrapper from '../../Components/ScreenWrapper/index';
import Header from '../../Components/Header/index';
import {Heading3, Heading2, Text} from '../../Components/Typography';
import spacing from '../../constants/spacing';
import {Card} from '../../Components/Card';
import colors from '../../constants/colors';
import {SmallButton, Anchor, Button} from '../../Components/Buttons';
import SendIcon from '../../assets/icons/Send.svg';
import Share from 'react-native-share';
import {light, dark} from '../../constants/theme';
import {Input} from '../../Components/Input/Input';
import Students from '../../Queries/students';
import Schedule from '../../Queries/schedule';
import toastConfig, {showToast} from '../../Toast/Index';
import Toast from 'react-native-toast-message';
import {Table, Row} from 'react-native-table-component';
import {HeadCell, styles, Cell} from '../Classroom/Students';
import SuccessIcon from '../../assets/icons/Success.svg';

const Attendance = ({route}: any) => {
    const {classroomId, scheduleId} = route.params;
    const [studentList, setstudentList] = useState<any>();
    const [schedule, setschedule] = useState<any>();
    const [loading, setloading] = useState(false);
    const lightTheme = useColorScheme() === 'light';
    useEffect(() => {
        const fetchStudentsandSchedule = async () => {
            const students: any = await Students.list(classroomId);
            setstudentList(students.docs);

            const _schedule: any = await Schedule.get(scheduleId);
            setschedule(_schedule);
        };
        fetchStudentsandSchedule();
    }, []);
    // console.log(schedule);
    return (
        <ScreenWrapper withHeader>
            <Header title={'Attendance '} />
            {loading ? <ActivityIndicator /> : <></>}
            {studentList ? (
                <Table>
                    <Row
                        data={[
                            HeadCell({content: 'RollNo'}),
                            HeadCell({content: 'Name'}),
                            HeadCell({content: 'Present'}),
                        ]}
                        flexArr={[0.2, 1, 0.23]}
                        style={styles.head}></Row>

                    {studentList ? (
                        studentList.length ? (
                            studentList.map((student: any, index: number) => (
                                <Pressable
                                    key={index}
                                    onPress={async () => {
                                        // console.log(presentStudents);

                                        let isPresent = true;

                                        if (
                                            schedule?.presentStudents[
                                                student._data.rollno
                                            ] === true
                                        ) {
                                            isPresent = false;
                                        }

                                        //optimistically updating

                                        setloading(true);
                                        await Schedule.mark({
                                            scheduleId: `${scheduleId}`,
                                            rollno: `${student._data.rollno}`,
                                            presentStudents:
                                                schedule.presentStudents,
                                            isPresent: isPresent,
                                        })
                                            .then(() => {
                                                let obj: any = {
                                                    ...schedule.presentStudents,
                                                };

                                                obj[student._data.rollno] =
                                                    isPresent;
                                                setschedule({
                                                    ...schedule,
                                                    presentStudents: {...obj},
                                                });
                                                setloading(false);
                                            })
                                            .catch(err => console.log(err));
                                    }}
                                    style={({pressed}) => [
                                        pressed && {
                                            backgroundColor: colors.lightBlue,
                                        },
                                    ]}>
                                    <Row
                                        data={[
                                            Cell({
                                                content: student._data.rollno,
                                            }),
                                            Cell({content: student._data.name}),
                                            (() => <SuccessIcon />)(),
                                        ]}
                                        flexArr={[0.2, 1, 0.23]}
                                        style={[
                                            styles.cell,
                                            schedule?.presentStudents[
                                                student._data.rollno
                                            ] && successStyles.present,
                                        ]}></Row>
                                </Pressable>
                            ))
                        ) : (
                            <View style={{paddingTop: spacing.lg}}>
                                <Text center muted>
                                    No students as of now
                                </Text>
                            </View>
                        )
                    ) : (
                        <ActivityIndicator />
                    )}
                </Table>
            ) : (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <ActivityIndicator
                        size="large"
                        color={colors.primaryBlue}
                    />
                </View>
            )}
        </ScreenWrapper>
    );
};

export default Attendance;

const successStyles = StyleSheet.create({
    present: {
        backgroundColor: colors.lightGreen,
    },
});
