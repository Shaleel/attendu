import {View, useColorScheme, Pressable, ScrollView} from 'react-native';
import React, {useContext, useState} from 'react';
import {Input, PasswordInput} from '../../Components/Input/Input';
import {BTNText, Heading1, Heading2, Text} from '../../Components/Typography';
import {Anchor, Button, SmallButton} from '../../Components/Buttons/index';
import spacing from '../../constants/spacing';
import {Card} from '../../Components/Card';
import GoogleIcon from '../../assets/icons/GoogleIcon.svg';
import TwitterIcon from '../../assets/icons/TwitterIcon.svg';
import FacebookIcon from '../../assets/icons/FacebookIcon.svg';
import {useNavigation} from '@react-navigation/native';
import ScreenWrapper from '../../Components/ScreenWrapper';
import {AuthContext} from '../../Navigation/AuthProvider';
import routes from '../../constants/routes';
import Toast from 'react-native-toast-message';
import toastConfig, {showToast} from '../../Toast/Index';

const errorMessage = (error: any) => {
    // console.log(code);
    switch (error.code) {
        case 'auth/invalid-email':
            return 'Invalid email address ';
        case 'auth/wrong-password':
            return 'Invalid password \nIf you already have an account try social media Login instead.';
        case 'auth/user-not-found':
            return 'User with this email not found';
        case 'auth/network-request-failed':
            return 'Network Error';
        default:
            return error.message;
    }
    // return error.message;
};
const Login = () => {
    const navigation = useNavigation();
    const {register, login, googleLogin, logout} = useContext(AuthContext);
    const [loading, setloading] = useState<boolean>(false);
    const [email, setemail] = useState<string>('');
    const [password, setpassword] = useState<string>('');

    const handleLogin = async () => {
        try {
            setloading(true);
            if (!email || !password) {
                showToast({
                    type: 'warning',
                    message: 'Email/Password is required',
                });
                setloading(false);
                return;
            }
            await login(email, password);
            setloading(false);
        } catch (error) {
            setloading(false);
            showToast({
                type: 'error',
                message: errorMessage(error),
            });
        }
    };
    return (
        <ScreenWrapper>
            <Toast config={toastConfig} />
            <View style={{alignItems: 'center', marginTop: 100}}>
                <Heading1>Login</Heading1>
                <Input
                    value={email}
                    onChange={setemail}
                    type="email"
                    placeholder="Email"
                />
                <PasswordInput
                    value={password}
                    onChange={setpassword}
                    placeholder="Password"
                />

                <View style={{flexDirection: 'row', marginTop: spacing.lg}}>
                    <Button
                        title="Login"
                        isLoading={loading}
                        onPress={handleLogin}></Button>
                </View>
                {/* <View style={{marginTop: spacing.lg}}>
                    <Anchor onPress={() => {}}>Forgot password ?</Anchor>
                </View> */}
                <View
                    style={{
                        marginTop: spacing.lg * 2,
                        marginBottom: spacing.lg,
                    }}>
                    <Text muted>------ or continue with------</Text>
                </View>

                <View
                    style={{
                        width: '30%',
                    }}>
                    <Pressable
                        onPress={async () => {
                            try {
                                await googleLogin();
                            } catch (error) {
                                console.log(error);
                                showToast({
                                    type: 'error',
                                    message: errorMessage(error),
                                });
                            }
                        }}>
                        <Card>
                            <GoogleIcon height={spacing.lg * 1.5} />
                        </Card>
                    </Pressable>
                    {/* <Pressable style={{flex: 0.3, padding: spacing.sm}}>
                        <Card>
                            <FacebookIcon height={spacing.lg * 1.5} />
                        </Card>
                    </Pressable>
                    <Pressable style={{flex: 0.3, padding: spacing.sm}}>
                        <Card>
                            <TwitterIcon height={spacing.lg * 1.5} />
                        </Card>
                    </Pressable> */}
                </View>

                <View style={{flexDirection: 'row', marginTop: spacing.lg}}>
                    <Text muted>Don't have an account ? </Text>
                    <Anchor
                        onPress={() => {
                            navigation.navigate(routes.CreateAccount as never);
                        }}>
                        Signup
                    </Anchor>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default Login;
