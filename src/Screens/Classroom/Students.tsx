import {
    ActivityIndicator,
    StyleSheet,
    View,
    Pressable,
    useColorScheme,
    Dimensions,
    ScrollView,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import ScreenWrapper from '../../Components/ScreenWrapper/index';
import Students from '../../Queries/students';
import colors from '../../constants/colors';
import {Text, Heading4, Heading3} from '../../Components/Typography';
import {Table, Row} from 'react-native-table-component';
import fontFamily from '../../constants/fontFamily';
import InfoIcon from '../../assets/icons/Info.svg';
import RBSheet from 'react-native-raw-bottom-sheet';
import spacing from '../../constants/spacing';
import {light, dark} from '../../constants/theme';
import {Input} from '../../Components/Input/Input';
import BinIcon from '../../assets/icons/Bin.svg';
import {Button} from '../../Components/Buttons';
import {showToast} from '../../Toast/Index';
import Classroom from '../../Queries/classroom';

type props = {
    classroomId: string;
};

export const HeadCell = ({content}: {content: string}) => (
    <Heading4 light>{content}</Heading4>
);
export const Cell = ({
    content,
    center,
    bold,
}: {
    content: string;
    center?: boolean;
    bold?: boolean;
}) => (
    <Text bold={bold} center={center} style={styles.cellText}>
        {content}
    </Text>
);
const StudentsWrapper = ({classroomId}: props) => {
    const [studentList, setstudentList] = useState<any>();
    const [selectedStudent, setselectedStudent] = useState<any>();
    const [name, setname] = useState<string>('');
    const [rollno, setrollno] = useState<string>('');
    const [email, setemail] = useState<string>('');
    const [studentStats, setstudentStats] = useState<any>();
    const SelectRef = useRef<any>();
    const DeleteRef = useRef<any>();

    const lightTheme = useColorScheme() === 'light';
    useEffect(() => {
        const subscriber = Students.realTimeList({
            classroomId: classroomId,
            onResult: async snapshot => {
                setstudentList(snapshot.docs);
                const stats = await Classroom.getStudentStats({
                    classroomId: classroomId,
                });
                setstudentStats(stats);
            },
        });
        return () => {
            subscriber();
        };
    }, []);

    const deleteStudent = async () => {
        try {
            const classroomId = selectedStudent._ref._documentPath._parts[1];
            const studentId = selectedStudent._ref._documentPath._parts[3];

            await Students.delete({
                studentId: studentId,
                classroomId: classroomId,
            });

            showToast({
                type: 'success',
                message: 'Student deleted successfully',
            });
        } catch (error) {
            console.log('error occurred while deleting', error);
            showToast({
                type: 'error',
                message: 'Unable to delete Student',
            });
        }
        SelectRef.current.close();
        DeleteRef.current.close();
    };

    const updateStudent = async () => {
        try {
            const classroomId = selectedStudent._ref._documentPath._parts[1];
            const studentId = selectedStudent._ref._documentPath._parts[3];

            await Students.update({
                studentId: studentId,
                classroomId: classroomId,
                studentData: {
                    name,
                    rollno,
                    email,
                },
            });

            showToast({
                type: 'success',
                message: 'Student details updated successfully',
            });
        } catch (error) {
            showToast({
                type: 'error',
                message: 'Unable to save Student',
            });
        }
        SelectRef.current.close();
    };
    return (
        <ScreenWrapper>
            <></>
            {studentList ? (
                <ScrollView>
                    <ScrollView horizontal>
                        <Table
                            style={{
                                width: Dimensions.get('window').width * 1.5,
                            }}>
                            <Row
                                data={[
                                    HeadCell({content: 'RollNo'}),
                                    HeadCell({content: 'Name'}),
                                    HeadCell({content: 'Attended'}),
                                    HeadCell({content: 'Percentage'}),
                                ]}
                                flexArr={[0.2, 0.3, 0.2, 0.2, 0.1]}
                                style={styles.head}></Row>

                            {studentList ? (
                                studentList.length ? (
                                    studentList.map(
                                        (student: any, index: number) => (
                                            <Pressable
                                                key={index}
                                                onPress={() => {
                                                    setselectedStudent(student);
                                                    setname(student._data.name);
                                                    setrollno(
                                                        student._data.rollno,
                                                    );
                                                    setemail(
                                                        student._data.email,
                                                    );

                                                    SelectRef?.current?.open();
                                                }}
                                                style={({pressed}) => [
                                                    pressed && {
                                                        backgroundColor:
                                                            colors.lightBlue,
                                                    },
                                                ]}>
                                                <Row
                                                    data={[
                                                        Cell({
                                                            content:
                                                                student._data
                                                                    .rollno,
                                                        }),
                                                        Cell({
                                                            content:
                                                                student._data
                                                                    .name,
                                                        }),
                                                        Cell({
                                                            bold: true,
                                                            center: true,
                                                            content:
                                                                studentStats
                                                                    ?.students[
                                                                    student
                                                                        ._data
                                                                        .rollno
                                                                ] || 0,
                                                        }),
                                                        Cell({
                                                            bold: true,
                                                            center: true,
                                                            content:
                                                                Math.floor(
                                                                    studentStats?.totalSchedules >
                                                                        0
                                                                        ? ((studentStats
                                                                              ?.students[
                                                                              student
                                                                                  ._data
                                                                                  .rollno
                                                                          ] ||
                                                                              0) /
                                                                              studentStats?.totalSchedules) *
                                                                              100
                                                                        : 0,
                                                                ).toString() +
                                                                '%',
                                                        }),
                                                        (() => <InfoIcon />)(),
                                                    ]}
                                                    flexArr={[
                                                        0.2, 0.3, 0.2, 0.2, 0.1,
                                                    ]}
                                                    style={
                                                        index % 2 === 0
                                                            ? styles.cell
                                                            : styles.highlight
                                                    }></Row>
                                            </Pressable>
                                        ),
                                    )
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
                    </ScrollView>
                </ScrollView>
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
            <RBSheet
                ref={SelectRef}
                animationType={'fade'}
                closeOnDragDown={true}
                height={Dimensions.get('window').height / 2}
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
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <Heading3>Student Details</Heading3>
                        <Pressable
                            onPress={() => {
                                DeleteRef?.current?.open();
                            }}
                            style={{
                                marginRight: spacing.md,
                                backgroundColor: colors.lightRed,
                                padding: spacing.md,
                                borderRadius: spacing.md,
                                marginBottom: -spacing.md,
                            }}>
                            <BinIcon />
                        </Pressable>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{paddingTop: spacing.md}}>
                            <Heading4>Name</Heading4>
                        </View>
                        <View style={{marginLeft: spacing.md}}></View>
                        <View style={{flex: 1}}>
                            <Input
                                placeholder="Student's name"
                                type="name"
                                value={name}
                                onChange={setname}
                                autoFocus
                            />
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{paddingTop: spacing.md}}>
                            <Heading4>Roll No</Heading4>
                        </View>
                        <View style={{marginLeft: spacing.md}}></View>
                        <View style={{flex: 1}}>
                            <Input
                                placeholder="Student's rollno"
                                type="name"
                                value={rollno}
                                onChange={setrollno}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{paddingTop: spacing.md}}>
                            <Heading4>Email</Heading4>
                        </View>
                        <View style={{marginLeft: spacing.md}}></View>
                        <View style={{flex: 1}}>
                            <Input
                                placeholder="Student's email"
                                type="email"
                                value={email}
                                onChange={setemail}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: spacing.md,
                        }}>
                        <Button
                            onPress={() => {
                                SelectRef.current.close();
                            }}
                            secondary
                            title="Cancel"></Button>
                        <View style={{marginLeft: spacing.md}}></View>
                        <Button onPress={updateStudent} title="Save"></Button>
                    </View>
                </View>
            </RBSheet>

            <RBSheet
                ref={DeleteRef}
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
                        Are you sure you want to delete this student ?
                    </Heading3>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: spacing.md,
                        }}>
                        <Button
                            onPress={() => {
                                DeleteRef.current.close();
                            }}
                            secondary
                            title="Cancel"></Button>
                        <View style={{marginLeft: spacing.md}}></View>
                        <Button
                            onPress={deleteStudent}
                            danger
                            title="Delete"></Button>
                    </View>
                </View>
            </RBSheet>
        </ScreenWrapper>
    );
};

export default StudentsWrapper;

export const styles = StyleSheet.create({
    headText: {
        fontFamily: fontFamily.Bold,
        fontSize: 18,
        color: 'white',
    },
    head: {
        backgroundColor: colors.primaryBlue,
        padding: 10,
    },
    cellText: {
        fontFamily: fontFamily.Bold,
        fontSize: 18,
    },
    cell: {
        padding: 10,
    },
    highlight: {
        padding: 10,
        backgroundColor: colors.lightestBlue,
    },
});
