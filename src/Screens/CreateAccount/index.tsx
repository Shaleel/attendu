import {View, Pressable, StyleSheet, ScrollView} from 'react-native';
import React, {useState, useContext} from 'react';
import ScreenWrapper from '../../Components/ScreenWrapper';
import Header from '../../Components/Header';
import {Card} from '../../Components/Card';
import spacing from '../../constants/spacing';
import {Heading3, Heading2, Text} from '../../Components/Typography';
import {Input, PasswordInput} from '../../Components/Input/Input';
import {Button} from '../../Components/Buttons';
import Toast from 'react-native-toast-message';
import toastConfig, {showToast} from '../../Toast/Index';
import {AuthContext} from '../../Navigation/AuthProvider';

const errorMessage = (code: any) => {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'User with this email already exists';
        case 'auth/network-request-failed':
            return 'Network Error';
        default:
            break;
    }
};

const CreateAccount = () => {
    const {register} = useContext(AuthContext);
    const [role, setrole] = useState<'educator' | 'student'>('educator');
    const [name, setname] = useState<string>('');
    const [email, setemail] = useState<string>('');
    const [password, setpassword] = useState<string>('');
    const [confirmPassword, setconfirmPassword] = useState<string>('');
    const [loading, setloading] = useState<boolean>(false);
    const handleRegister = async () => {
        try {
            setloading(true);
            if (!name || !email || !password || !confirmPassword) {
                showToast({type: 'warning', message: 'Fields are incomplete'});
                setloading(false);
                return;
            }

            if (password !== confirmPassword) {
                showToast({type: 'warning', message: `Passwords don't match`});
                setloading(false);
                return;
            }

            if (password.length < 8) {
                showToast({
                    type: 'warning',
                    message: `Password must be at least 8 characters`,
                });
                setloading(false);
                return;
            }

            await register(name, email, password, role);
            setloading(false);
        } catch (error: any) {
            console.log(error);
            showToast({
                type: 'error',
                message: errorMessage(error.code),
            });
            setloading(false);
        }
    };
    return (
        <ScreenWrapper withHeader>
            <Header title="Create Account" />
            <Toast config={toastConfig} />
            <ScrollView>
                <Heading3>You are an :</Heading3>
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
                        // TODO next version
                        // onPress={() => setrole('student')}
                        style={styles.roleBtn}>
                        <Card active={role === 'student'}>
                            <Heading3 center> 🎒 Student</Heading3>
                        </Card>
                    </Pressable>
                </View>

                <Input
                    value={name}
                    type="name"
                    onChange={setname}
                    placeholder="Full Name"
                />

                <Input
                    value={email}
                    onChange={setemail}
                    type="email"
                    placeholder="Email address"
                />

                <PasswordInput
                    value={password}
                    onChange={setpassword}
                    type="password"
                    placeholder="Password"
                />

                <PasswordInput
                    value={confirmPassword}
                    onChange={setconfirmPassword}
                    type="password"
                    placeholder="Confirm Password"
                />

                <View style={{flexDirection: 'row', marginTop: spacing.lg}}>
                    <Button
                        isLoading={loading}
                        onPress={handleRegister}
                        title="Register Account"
                    />
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default CreateAccount;

const styles = StyleSheet.create({
    roleBtn: {
        flex: 1,
        margin: spacing.md,
    },
});
