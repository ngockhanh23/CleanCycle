import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox, Text, useColorScheme } from 'react-native';

import ColorServices from './src/services/color-services';
import { enableScreens } from 'react-native-screens';
import MainScreens from './src/screens/main-screens/main-screens';
import ReelVideoSwiper from './src/screens/reel-videos-swiper/reel-video-swiper';
import Login from './src/screens/login/login';
import SplashScreen from './src/screens/splash-screen/splash-screen';
import ImageDetailList from './src/screens/images-detail-list/images-detail-list';
import UploadPost from './src/screens/upload-posts/upload-post';
import PostDetail from './src/screens/post-detail/post-detail';
import UploadReel from './src/screens/upload-reels/upload-reels';
import PersonalProfile from './src/screens/personal-profile/personal-profile';
import MessageBox from './src/screens/message-box/message-box';

enableScreens();
LogBox.ignoreLogs(['@firebase/auth']);
const Stack = createNativeStackNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: ColorServices.primaryColor,
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false, title: "Login" }}
        />
        <Stack.Screen
          name="Home"
          component={MainScreens}
          options={{ headerShown: false, title: "home" }}
        />
        <Stack.Screen
          name="ImagesDetailList"
          component={ImageDetailList}
          options={{ headerShown: false, title: "Chi tiết hình ảnh" }}
        />

        <Stack.Screen
          name="ReelVideoSwiper"
          component={ReelVideoSwiper}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="UploadPost"
          component={UploadPost}
          options={{ headerShown: true, title :'Tạo bài đăng' }}
        />
         <Stack.Screen
          name="PostDetail"
          component={PostDetail}
          options={{ headerShown: true, title :'' }}
        />
         <Stack.Screen
          name="UploadReels"
          component={UploadReel}
          options={{
            headerShown: true,
            title: 'Thêm tin mới',
            headerStyle: {
              backgroundColor: '#fff', // Set Appbar background color to white
            },
            headerTintColor: '#000', // Set Appbar text color to black (or any other color you prefer)
          }}
        />
        <Stack.Screen
          name="PersonalProfile"
          component={PersonalProfile}
          options={{ headerShown: true, title :'Thông tin cá nhân' }}
        />
        <Stack.Screen
          name="MessageBox"
          component={MessageBox}
          options={{ headerShown: false, title :'Nhắn tin' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
