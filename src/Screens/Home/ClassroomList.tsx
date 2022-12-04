import {StyleSheet, ScrollView, View, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import Classroom from '../../Queries/classroom';
import ClassCard from './ClassCard';
import {Text} from '../../Components/Typography/index';
import {useNavigation} from '@react-navigation/native';

const ClassroomList = () => {
    const [classes, setclasses] = useState<any>();
    const navigator = useNavigation();
    useEffect(() => {
        const subscriber = Classroom.realTimeList(snapshot => {
            setclasses(snapshot.docs);
        });
        return () => {
            subscriber();
        };
    }, []);

    return (
        <View>
            {classes?.length ? (
                classes.map((singleClassroom: any, key: number) => (
                    <Pressable
                        onPress={() => {
                            navigator.navigate(
                                'Classroom' as never,
                                {
                                    classroom: singleClassroom._data,
                                    classList: classes,
                                } as never,
                            );
                        }}
                        key={key}>
                        <ClassCard
                            name={singleClassroom._data.name}
                            studentCount={singleClassroom._data.studentCount}
                            description={singleClassroom._data.description}
                            accentColor={singleClassroom._data.accentColor}
                        />
                    </Pressable>
                ))
            ) : (
                <View
                    style={{
                        height: 100,
                        justifyContent: 'center',
                    }}>
                    <Text muted center bold>
                        You have no classrooms till now
                    </Text>
                </View>
            )}
        </View>
    );
};

export default ClassroomList;

const styles = StyleSheet.create({});
