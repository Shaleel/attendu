import React, {createContext, useState} from 'react';
import auth, {sendPasswordResetEmail} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import config from '../../config';
GoogleSignin.configure({
    webClientId: config.webClientId,
});
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        try {
            await auth().signInWithEmailAndPassword(email, password);
        } catch (e) {
            throw e;
        }
    };
    const googleLogin = async () => {
        try {
            // Get the users ID token
            const {idToken} = await GoogleSignin.signIn();
            // Create a Google credential with the token
            const googleCredential =
                auth.GoogleAuthProvider.credential(idToken);
            // Sign-in the user with the credential
            await auth()
                .signInWithCredential(googleCredential)
                // Use it only when user Sign's up,
                // so create different social signup function
                .then(async () => {
                    //   //Once the user creation has happened successfully, we can add the currentUser into firestore
                    //   //with the appropriate details.
                    //   // console.log('current User', auth().currentUser);
                    const user = await firestore()
                        .collection('users')
                        .doc(auth().currentUser.uid)
                        .get();

                    if (user.exists) {
                        await firestore()
                            .collection('users')
                            .doc(auth().currentUser.uid)
                            .update({
                                profilePicture: auth().currentUser.photoURL,
                            });
                    } else {
                        //user does not exist
                        //creating user
                        await firestore()
                            .collection('users')
                            .doc(auth().currentUser.uid)
                            .set({
                                name: auth().currentUser.displayName,
                                email: auth().currentUser.email,
                                createdAt: firestore.Timestamp.fromDate(
                                    new Date(),
                                ),
                                profilePicture: auth().currentUser.photoURL,
                            });

                        setUser({
                            name: auth().currentUser.displayName,
                            email: auth().currentUser.email,
                            createdAt: firestore.Timestamp.fromDate(new Date()),
                            profilePicture: auth().currentUser.photoURL,
                        });
                    }
                });
        } catch (error) {
            throw error;
        }
    };

    const fbLogin = async () => {
        //   try {
        //     // Attempt login with permissions
        //     const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        //     if (result.isCancelled) {
        //       throw 'User cancelled the login process';
        //     }
        //     // Once signed in, get the users AccesToken
        //     const data = await AccessToken.getCurrentAccessToken();
        //     if (!data) {
        //       throw 'Something went wrong obtaining access token';
        //     }
        //     // Create a Firebase credential with the AccessToken
        //     const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
        //     // Sign-in the user with the credential
        //     await auth().signInWithCredential(facebookCredential)
        //     // Use it only when user Sign's up,
        //     // so create different social signup function
        //     // .then(() => {
        //     //   //Once the user creation has happened successfully, we can add the currentUser into firestore
        //     //   //with the appropriate details.
        //     //   console.log('current User', auth().currentUser);
        //     //   firestore().collection('users').doc(auth().currentUser.uid)
        //     //   .set({
        //     //       fname: '',
        //     //       lname: '',
        //     //       email: auth().currentUser.email,
        //     //       createdAt: firestore.Timestamp.fromDate(new Date()),
        //     //       userImg: null,
        //     //   })
        //     //   //ensure we catch any errors at this stage to advise us if something does go wrong
        //     //   .catch(error => {
        //     //       console.log('Something went wrong with added user to firestore: ', error);
        //     //   })
        //     // })
        //     //we need to catch the whole sign up process if it fails too.
        //     .catch(error => {
        //         console.log('Something went wrong with sign up: ', error);
        //     });
        //   } catch(error) {
        //     console.log({error});
        //   }
    };

    const register = async (name, email, password, role) => {
        try {
            await auth()
                .createUserWithEmailAndPassword(email, password)
                .then(async () => {
                    //Once the user creation has happened successfully, we can add the currentUser into firestore
                    //with the appropriate details.
                    await firestore()
                        .collection('users')
                        .doc(auth().currentUser.uid)
                        .set({
                            name: name,
                            email: email,
                            role: role,
                            createdAt: firestore.Timestamp.fromDate(new Date()),
                            profilePicture: null,
                        });
                    // //ensure we catch any errors at this stage to advise us if something does go wrong
                    // .catch(error => {
                    //     console.log('Something went wrong with added user to firestore: ', error);
                    // })
                });
            //we need to catch the whole sign up process if it fails too.
            // .catch(error => {
            //     console.log('Something went wrong with sign up: ', error);
            // });
        } catch (e) {
            throw e;
        }
    };
    const logout = async () => {
        try {
            await auth().signOut();
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                register,
                googleLogin,
                logout,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
