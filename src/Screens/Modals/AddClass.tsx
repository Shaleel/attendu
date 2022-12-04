import {StyleSheet, View, ScrollView, Pressable} from 'react-native';
import React, {useState, Dispatch, SetStateAction} from 'react';
import ScreenWrapper from '../../Components/ScreenWrapper';
import Header from '../../Components/Header';
import {Input} from '../../Components/Input/Input';
import {Heading3, Text} from '../../Components/Typography';
import palette, {classBackgrounds} from '../../constants/colors';
import spacing from '../../constants/spacing';
import {Button, Anchor} from '../../Components/Buttons';
import Toast from 'react-native-toast-message';
import toastConfig, {showToast} from '../../Toast/Index';
import Classroom from '../../Queries/classroom';
import {useNavigation} from '@react-navigation/native';

const Color = ({
    color,
    value,
    setvalue,
}: {
    color: string;
    value: string;
    setvalue: Dispatch<SetStateAction<string>>;
}) => {
    return (
        <Pressable
            onPress={() => {
                setvalue(color);
            }}
            style={{
                height: spacing.lg * 2,
                backgroundColor: color,
                width: spacing.lg * 4,
                borderRadius: spacing.md,
                margin: spacing.sm,
                borderWidth: 2,
                borderColor:
                    color === value ? palette.primaryBlue : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            {color === value ? (
                <Text light bold>
                    ✓
                </Text>
            ) : (
                <></>
            )}
        </Pressable>
    );
};
const AddClass = () => {
    const [name, setname] = useState<string>('');
    const [description, setdescription] = useState<string>('');
    const [color, setcolor] = useState(classBackgrounds[0]);
    const [loading, setloading] = useState<boolean>(false);
    const navigator = useNavigation();
    // console.log('user', user);
    return (
        <ScreenWrapper withHeader>
            <Header title="Add Class" isModalHeader />
            <Toast config={toastConfig} />
            <Heading3>Class Name</Heading3>
            <Input placeholder="Class Name" value={name} onChange={setname} />
            <View style={{marginTop: 10}}></View>
            <Heading3>Class Description</Heading3>
            <Input
                placeholder="Eg : Section-A , Subject Code"
                value={description}
                onChange={setdescription}
            />

            <View style={{marginTop: 10}}></View>
            <Heading3>Class Accent</Heading3>
            <View style={{flexDirection: 'row', marginTop: spacing.lg}}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {classBackgrounds.map((_color, key) => (
                        <Color
                            setvalue={setcolor}
                            key={key}
                            color={_color}
                            value={color}
                        />
                    ))}
                </ScrollView>
            </View>
            <View style={{flexDirection: 'row', marginTop: spacing.lg}}>
                <Button
                    title="Create Class"
                    isLoading={loading}
                    onPress={() => {
                        setloading(true);
                        let isOnline = false;
                        Classroom.create({
                            name: name,
                            description: description,
                            accent: color,
                        })
                            .then(message => {
                                showToast({
                                    type: 'success',
                                    message: 'Class created successfully',
                                });
                                setloading(false);
                                isOnline = true;
                            })
                            .catch(error => {
                                // console.log(message.message);
                                showToast({
                                    type: error.type,
                                    message: error.message,
                                });
                                setloading(false);
                            });

                        if (!isOnline) {
                            showToast({
                                type: 'info',
                                message:
                                    'The classroom is created locally.\nIt will be synced as soon as\n your device connects to internet',
                            });
                            setloading(false);
                        } else {
                            navigator.goBack();
                        }
                    }}
                />
            </View>
        </ScreenWrapper>
    );
};

export default AddClass;

const styles = StyleSheet.create({});
