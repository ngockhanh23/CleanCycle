import { Image, Text, KeyboardAvoidingView, Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../fragments/home-screen/home-screen';
import MessageScreen from '../fragments/message-screen/message-screen';
import UploadScreen from '../fragments/upload-screen/upload-screen';  // Có thể là một màn hình dummy hoặc không cần thiết
import LearningScreen from '../fragments/learning-screen/learning-screen';
import ProfileScreen from '../fragments/profile-screen/profile-screen';
import ColorServices from '../../services/color-services';
import { useEffect } from 'react';

const Tab = createBottomTabNavigator();

const MainScreens = ({ navigation }: any) => {
    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e:any) => {
            // Prevent default behavior
            if (e.target === 'UploadScreen') {
                e.preventDefault();
                navigation.navigate('UploadPost');
            }
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerStyle: {
                        backgroundColor: 'white',
                    },
                    keyboardHidesTabBar: true,
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        switch (route.name) {
                            case 'HomeScreen':
                                iconName = focused
                                    ? require('../../../assets/icons/ic_home_green.png')
                                    : require('../../../assets/icons/ic_home_grey.png');
                                break;
                            case 'MessageScreen':
                                iconName = focused
                                    ? require('../../../assets/icons/ic_letter_green.png')
                                    : require('../../../assets/icons/ic_letter_grey.png');
                                break;
                            case 'UploadScreen':
                                iconName = focused
                                    ? require('../../../assets/icons/ic_addpost_green.png')
                                    : require('../../../assets/icons/ic_addpost_green.png');
                                break;
                            case 'LearningScreen':
                                iconName = focused
                                    ? require('../../../assets/icons/ic_chat_green.png')
                                    : require('../../../assets/icons/ic_chat_grey.png');
                                break;
                            case 'ProfileScreen':
                                iconName = focused
                                    ? require('../../../assets/icons/ic_user_green.png')
                                    : require('../../../assets/icons/ic_user_grey.png');
                                break;
                            default:
                                break;
                        }
                        // Custom icon for UploadScreen
                        if (route.name === 'UploadScreen') {
                            return (
                                <View style={{
                                    position: 'absolute',
                                    bottom: 20,  // Adjust this value to control how much the icon is pushed up
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Image
                                        source={iconName}
                                        style={{ width: 50, height: 50, resizeMode: 'contain' }}  // Increase size of the icon
                                    />
                                </View>
                            );
                        }
                        return (
                            <Image
                                source={iconName}
                                style={{ width: 24, height: 24, resizeMode: 'contain' }}
                            />
                        );
                    },
                    tabBarLabel: ({ focused }) => {
                        let label;
                        switch (route.name) {
                            case 'HomeScreen':
                                label = 'Trang chủ';
                                break;
                            case 'MessageScreen':
                                label = 'Hộp thư';
                                break;
                            case 'UploadScreen':
                                return null;  // No label for UploadScreen
                            case 'LearningScreen':
                                label = 'Học tập';
                                break;
                            case 'ProfileScreen':
                                label = 'Cá nhân';
                                break;
                            default:
                                break;
                        }
                        return <Text style={{ color: focused ? ColorServices.primaryColor : 'gray' }}>{label}</Text>;
                    },
                    tabBarStyle: {
                        height: 70,
                        paddingBottom: 10,
                    },
                })}
            >
                <Tab.Screen name="HomeScreen"
                    component={HomeScreen}
                    options={{ headerShown: false, }}
                />
                <Tab.Screen name="MessageScreen" component={MessageScreen} options={{ headerShown: false }} />
                <Tab.Screen name="UploadScreen" component={UploadScreen} listeners={{
                    tabPress: (e) => {
                        // Prevent default behavior
                        e.preventDefault();
                        navigation.navigate('UploadPost');
                    },
                }} />
                <Tab.Screen name="LearningScreen" component={LearningScreen} />
                <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
            </Tab.Navigator>
        </KeyboardAvoidingView>
    );
};

export default MainScreens;
