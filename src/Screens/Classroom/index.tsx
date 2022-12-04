import {
    StyleSheet,
    Text,
    View,
    Pressable,
    useColorScheme,
    Dimensions,
    ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import ScreenWrapper from '../../Components/ScreenWrapper/index';
import Header from '../../Components/Header/index';
import TopNavigation from './TopNavigation';
import {Heading3, Heading2, Heading4} from '../../Components/Typography';
import spacing from '../../constants/spacing';
import {Card} from '../../Components/Card';
import {SmallButton, Anchor, Button} from '../../Components/Buttons';
import SendIcon from '../../assets/icons/Send.svg';
import Share from 'react-native-share';
import RBSheet from 'react-native-raw-bottom-sheet';
import {light, dark} from '../../constants/theme';
import {Input} from '../../Components/Input/Input';
import Students from '../../Queries/students';
import toastConfig, {showToast} from '../../Toast/Index';
import Toast from 'react-native-toast-message';
import ListItem from '../../Components/Select/ListItem';
import colors from '../../constants/colors';
import BinIcon from '../../assets/icons/Bin.svg';
import EditIcon from '../../assets/icons/Edit.svg';
import Classroom from '../../Queries/classroom';

const _Classroom = ({route}: any) => {
    const navigator = useNavigation();
    const {classroom, classList} = route.params;
    const SelectRef = useRef<any>();
    const ImportRef = useRef<any>();
    const DeleteRef = useRef<any>();
    const EditRef = useRef<any>();
    const lightTheme = useColorScheme() === 'light';
    const [className, setclassName] = useState<string>(classroom.name);
    const [classDescription, setclassDescription] = useState<string>(
        classroom.description,
    );
    const [name, setname] = useState<string>('');
    const [rollno, setrollno] = useState<string>('');
    const [email, setemail] = useState<string>('');
    const [loading, setloading] = useState<boolean>(false);
    const [selectedClassroom, setselectedClassroom] = useState(
        classList[0]._data,
    );
    const addStudent = () => {
        setloading(true);
        Students.create({
            name,
            rollno,
            email,
            classroomId: classroom.id,
        })
            .then(res => {
                showToast({
                    type: 'success',
                    message: `${res}`,
                });
                SelectRef?.current?.close();
            })
            .catch(error => {
                showToast({
                    type: error.type,
                    message: error.message,
                });
            });
        setloading(false);
    };

    const importStudents = async () => {
        try {
            setloading(true);
            await Students.import({
                classroomId: classroom.id,
                targetClassroomId: selectedClassroom.id,
                currStudentCount: classroom.studentCount,
            });
            setloading(false);
            ImportRef.current.close();
            showToast({
                type: 'success',
                message: 'Imported students successfully',
            });
        } catch (error: any) {
            showToast({
                type: 'error',
                message: error,
            });
        }
    };

    const deleteClassroom = async () => {
        Classroom.delete(classroom.id)
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

        DeleteRef.current.close();
        EditRef.current.close();
        navigator.goBack();
    };
    const updateClassroom = async () => {
        try {
            await Classroom.update({
                id: classroom.id,
                name: className,
                description: classDescription,
            });
            navigator.goBack();
            showToast({
                type: 'success',
                message: 'Classroom details updated successfully',
            });
        } catch (error) {
            showToast({
                type: 'error',
                message: 'Unable to save Classroom',
            });
        }
    };
    return (
        <ScreenWrapper withHeader notpadded>
            <Header title={classroom.name} />
            <Pressable
                onPress={() => {
                    EditRef.current.open();
                }}
                style={{
                    position: 'absolute',
                    right: spacing.lg * 1.5,
                    top: spacing.lg,
                }}>
                <EditIcon />
            </Pressable>
            <Toast config={toastConfig} />

            <View style={{padding: spacing.md}}>
                <Card padding="lg" bg={classroom.accentColor}>
                    <View style={{position: 'relative'}}>
                        <View style={[styles.row]}>
                            <Heading3 light>Description</Heading3>
                            <Heading3 light>
                                {classroom.description || 'Not Provided'}
                            </Heading3>
                        </View>
                        <View style={styles.row}>
                            <Heading3 light>Students</Heading3>
                            <Heading3 light>{classroom.studentCount}</Heading3>
                        </View>
                        <View style={[styles.row, , {marginBottom: 0}]}>
                            <Heading3 light>Code</Heading3>
                            <Heading3 light>{classroom.code}</Heading3>
                        </View>
                    </View>
                </Card>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={[{flexDirection: 'row', marginTop: spacing.md}]}>
                    <Pressable
                        style={{marginRight: spacing.sm}}
                        onPress={() => {
                            Share.open({
                                title: classroom.name,
                                message: `Join the ${classroom.name} classroom on Attendu App.\nCode : ${classroom.code}`,
                            })
                                .then(res => {
                                    console.log(res);
                                })
                                .catch(err => {
                                    err && console.log(err);
                                });
                        }}>
                        <Card>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <View
                                    style={{
                                        marginLeft: spacing.md / 2,
                                        marginRight: spacing.md,
                                    }}>
                                    <SendIcon height={spacing.lg} />
                                </View>
                                <Heading3>Share</Heading3>
                            </View>
                        </Card>
                    </Pressable>

                    <Pressable onPress={() => SelectRef?.current?.open()}>
                        <Card>
                            <View style={{flexDirection: 'row'}}>
                                <Heading3>+ Add Students</Heading3>
                            </View>
                        </Card>
                    </Pressable>

                    {classList && classList.length > 1 ? (
                        <Pressable onPress={() => ImportRef?.current?.open()}>
                            <Card>
                                <Heading3>Import Students</Heading3>
                            </Card>
                        </Pressable>
                    ) : (
                        <></>
                    )}
                </ScrollView>
            </View>
            <TopNavigation classroom={classroom} />

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
                <View>
                    <View style={{padding: spacing.md}}>
                        <View style={{zIndex: -10}}>
                            <Heading3>Student Details</Heading3>
                        </View>

                        <Input
                            value={name}
                            onChange={setname}
                            placeholder="Student's name"
                            type="name"
                            autoFocus
                        />
                        <Input
                            value={email}
                            onChange={setemail}
                            placeholder="Student's email"
                            type="email"
                        />
                        <Input
                            value={rollno}
                            onChange={setrollno}
                            placeholder="Student's Roll no"
                            type="name"
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: spacing.lg,
                            }}>
                            <Button
                                title="Add Students"
                                isLoading={loading}
                                onPress={addStudent}
                            />
                        </View>
                    </View>
                </View>
            </RBSheet>
            <RBSheet
                ref={ImportRef}
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
                <View>
                    <View style={{padding: spacing.md}}>
                        <View style={{zIndex: -10}}>
                            <Heading3>
                                Select Classroom to import students from
                            </Heading3>
                        </View>

                        <ScrollView
                            style={{
                                height: Dimensions.get('window').height / 3.5,
                            }}>
                            {classList.map(
                                (singleClassroom: any, index: number) =>
                                    singleClassroom._data.id !=
                                        classroom.id && (
                                        <ListItem
                                            pressHandler={() => {
                                                setselectedClassroom(
                                                    singleClassroom._data,
                                                );
                                                // setfocussed(false);
                                            }}
                                            key={index}
                                            val={singleClassroom._data.name}
                                            isSelected={
                                                singleClassroom._data.name ==
                                                selectedClassroom.name
                                            }
                                        />
                                    ),
                            )}
                        </ScrollView>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: spacing.lg,
                            }}>
                            <Button
                                title="Import Students"
                                isLoading={loading}
                                onPress={importStudents}
                            />
                        </View>
                    </View>
                </View>
            </RBSheet>

            <RBSheet
                ref={EditRef}
                animationType={'fade'}
                closeOnDragDown={true}
                height={Dimensions.get('window').height / 2.7}
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
                        <Heading3>Classroom Details</Heading3>
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
                            <Heading4>Title</Heading4>
                        </View>
                        <View style={{marginLeft: spacing.md}}></View>
                        <View style={{flex: 1}}>
                            <Input
                                placeholder="Classroom Title"
                                value={className}
                                onChange={setclassName}
                                autoFocus
                            />
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{paddingTop: spacing.md}}>
                            <Heading4>Description</Heading4>
                        </View>
                        <View style={{marginLeft: spacing.md}}></View>
                        <View style={{flex: 1}}>
                            <Input
                                placeholder="Classroom Description"
                                value={classDescription}
                                onChange={setclassDescription}
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
                                EditRef.current.close();
                            }}
                            secondary
                            title="Cancel"></Button>
                        <View style={{marginLeft: spacing.md}}></View>
                        <Button onPress={updateClassroom} title="Save"></Button>
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
                            onPress={deleteClassroom}
                            danger
                            title="Delete"></Button>
                    </View>
                </View>
            </RBSheet>
        </ScreenWrapper>
    );
};

export default _Classroom;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
});
