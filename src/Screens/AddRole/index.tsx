import {View, Text, Pressable, StyleSheet} from 'react-native';
import React, {useContext, useState} from 'react';
import {AuthContext} from '../../Navigation/AuthProvider';
import ScreenWrapper from '../../Components/ScreenWrapper/index';
import {Heading1, Heading3} from '../../Components/Typography';
import spacing from '../../constants/spacing';
import {Card} from '../../Components/Card/index';
import {Button} from '../../Components/Buttons';
import Toast from 'react-native-toast-message';
import toastConfig, {showToast} from '../../Toast/Index';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AddRole = () => {
    const {setUser} = useContext(AuthContext);
    const [role, setrole] = useState<'educator' | 'student'>('educator');
    const [loading, setloading] = useState<boolean>(false);

    const updateRole = async () => {
        try {
            setloading(true);
            await firestore()
                .collection('users')
                .doc(auth()?.currentUser?.uid)
                .update({
                    role: role,
                });
            let currentUser: any = await firestore()
                .collection('users')
                .doc(auth()?.currentUser?.uid)
                .get();

            setUser(currentUser._data);

            setloading(false);
        } catch (error: any) {
            showToast({
                type: 'error',
                message: error,
            });
            setloading(false);
        }
    };
    return (
        <ScreenWrapper>
            <Toast config={toastConfig} />
            <Heading1>One last step!</Heading1>
            <View style={{marginTop: spacing.lg, marginBottom: spacing.md}}>
                <Heading3>Choose Role</Heading3>
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                }}>
                <Pressable
                    onPress={() => setrole('educator')}
                    style={styles.roleBtn}>
                    <Card active={role === 'educator'}>
                        <View>
                            <Heading3 center> 👨‍🏫 Educator</Heading3>
                        </View>
                    </Card>
                </Pressable>

                <Pressable
                    onPress={() => setrole('student')}
                    style={styles.roleBtn}>
                    <Card active={role === 'student'}>
                        <Heading3 center> 🎒 Student</Heading3>
                    </Card>
                </Pressable>
            </View>

            <View style={{flexDirection: 'row', marginTop: spacing.lg}}>
                <Button
                    isLoading={loading}
                    onPress={updateRole}
                    title="Continue"
                />
            </View>
        </ScreenWrapper>
    );
};

export default AddRole;
const styles = StyleSheet.create({
    roleBtn: {
        flex: 1,
        margin: spacing.md,
    },
});
