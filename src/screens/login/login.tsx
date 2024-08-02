import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, TextInput, TouchableOpacity, Text, ScrollView, LogBox, Alert, ActivityIndicator } from "react-native";
import ColorServices from '../../services/color-services';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { getAuth, signInWithCredential, GoogleAuthProvider, signInWithEmailAndPassword, FacebookAuthProvider, } from 'firebase/auth';
import { LoginManager, AccessToken, Settings } from 'react-native-fbsdk-next';
// import firebaseConfigApp from '../../../firebase-config';
import User from '../../models/user';
import AuthServices from '../../services/auth-services';
import ConvertServices from '../../services/convert-services';
import SharedPreferences from "react-native-shared-preferences";
import firebaseConfigApp from '../../../firebase-config';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

const Login = ({ navigation }: any) => {
    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state.',
    ]);
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        _configureGoogleSignIn();
        Settings.initializeSDK();
        // AuthServices.getInstance().Logout();
        const initializeGoogleSignIn = async () => {
            await GoogleSignin.signOut(); // Optional: Clear previous session
        };
        initializeGoogleSignIn();
    }, []);

    const _configureGoogleSignIn = () => {
        GoogleSignin.configure({
            webClientId: '692616237960-g051fdlqcdb9ucqoo62nei2rs1fbe9am.apps.googleusercontent.com',
        });
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const auth = getAuth(firebaseConfigApp);
            const userCredential = await signInWithEmailAndPassword(auth, gmail, password);
            console.log('Đăng nhập thành công:', userCredential.user);
            const user = new User(userCredential.user.uid, userCredential.user.displayName!, userCredential.user.email!, userCredential.user.photoURL!)
            AuthServices.getInstance().SetUserLogged(user);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home', params: { navigation: navigation } }],
            });
        } catch (error) {
            console.error('Đăng nhập thất bại:', error);
            Alert.alert('Lỗi đăng nhập', 'Tài khoản hoặc mật khẩu không đúng');
        } finally {
            setLoading(false);
        }
    };

    const saveLoginCredential = async (credential: any) => {
        setLoading(true);
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            await auth.signOut(); // Ensure to sign out from any existing session
        }
        const userCredential = await signInWithCredential(auth, credential);
    
        // Reference to the Firestore database
        const firestore = getFirestore();
        const userDocRef = doc(firestore, "Users", userCredential.user.uid);
    
        try {
            const docSnap = await getDoc(userDocRef);
            let user;
            if (docSnap.exists()) {
                console.log("User already exists in Firestore.");
                user = docSnap.data(); // Using the existing data
            } else {
                console.log("Creating a new user in Firestore.");
                // If user does not exist, create a new user entry in Firestore
                user = {
                    id: userCredential.user.uid,
                    name: userCredential.user.displayName || "",
                    email: userCredential.user.email || "",
                    photoUrl: userCredential.user.photoURL || "",
                };
                await setDoc(userDocRef, user);
            }
    
            // Convert user object to string and save to SharedPreferences
            const userString = ConvertServices.objectToString(user);
            SharedPreferences.setItem('user', userString!);
    
            // Update logged in user
            const newUser = new User(user.id, user.name, user.email, user.photoUrl);
            AuthServices.getInstance().SetUserLogged(newUser);
    
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home', params: { navigation: navigation } }],
            });
        } catch (error) {
            console.error("Error fetching or creating user:", error);
            Alert.alert("Login Error", "Problem with user login process.");
        } finally {
            setLoading(false);
        }
    };
    

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const { idToken } = await GoogleSignin.signIn();
            const userCredential = GoogleAuthProvider.credential(idToken);

            saveLoginCredential(userCredential);

        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User cancelled the login process');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Signin in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play services not available or outdated');
            } else {
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFacebookSignin = async () => {
        setLoading(true);
        try {
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
            console.log('LoginManager result:', result);

            if (result.isCancelled) {
                throw new Error('Đăng nhập bằng Facebook đã bị hủy.');
            }

            const accessToken = await AccessToken.getCurrentAccessToken();
            if (!accessToken) {
                throw new Error('Không thể lấy được mã truy cập.');
            }
            // console.log('Access Token:', accessToken);

            const credential = FacebookAuthProvider.credential(accessToken.accessToken);
            saveLoginCredential(credential);


        } catch (error: any) {
            Alert.alert('Lỗi đăng nhập', error.message);
            console.error('Error details:', error);
        } finally {
            setLoading(false);
        }
    };

    const isLoginDisabled = !gmail || !password || loading;

    return (
        // <ScrollView style={styles.container}>
        <View style={styles.containerContent}>
            <Image style={styles.logo} source={require('../../../assets/images/logo.png')} />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Gmail"
                    placeholderTextColor="#A9A9A9"
                    onChangeText={(text) => setGmail(text)}
                    editable={!loading}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#A9A9A9"
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                    editable={!loading}
                />
            </View>

            <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: isLoginDisabled ? '#A9A9A9' : ColorServices.primaryColor }]}
                onPress={handleLogin}
                disabled={isLoginDisabled}
            >
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            {loading && (
                <ActivityIndicator size="large" color={ColorServices.primaryColor} style={styles.loading} />
            )}
            <View style={{ flexDirection: 'row', marginVertical: 20, alignItems: 'center' }}>
                <View style={styles.divider}></View>
                <Text style={{ marginHorizontal: 10 }}>Hoặc</Text>
                <View style={styles.divider}></View>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center' }}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => handleGoogleLogin()} disabled={loading}>
                    <Image style={styles.iconLogo} source={require('../../../assets/images/google_logo.png')} />
                </TouchableOpacity>
                <View style={{ width: 25 }}></View>
                <TouchableOpacity style={styles.iconContainer} onPress={() => handleFacebookSignin()} disabled={loading}>
                    <Image style={styles.iconLogo} source={require('../../../assets/images/facebook_logo.png')} />
                </TouchableOpacity>
            </View>

        </View>
        // </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        padding: 20,

        backgroundColor: '#ffffff'
    },
    containerContent: {
        padding: 20,

        backgroundColor: '#ffffff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    logo: {
        width: '80%',
        resizeMode: 'contain',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 5
    },
    loginButton: {
        width: '100%',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center'
    },
    loginText: {
        color: '#ffffff',
        fontSize: 16
    },
    divider: {
        width: '100%',
        borderTopWidth: 1,
        marginVertical: 5,
        borderTopColor: '#C0C0C0'
    },
    iconContainer: {
        backgroundColor: '#fff',
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconLogo: {
        width: 50,
        height: 50,
        borderRadius: 50,
        resizeMode: 'contain'
    },
    loading: {
        marginVertical: 5
    },
});

export default Login;
