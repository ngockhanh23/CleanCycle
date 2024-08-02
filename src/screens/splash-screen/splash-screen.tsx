import { ActivityIndicator, Image, View } from "react-native";
import ColorServices from "../../services/color-services";
import { useEffect } from "react";
import SharedPreferences from "react-native-shared-preferences";
import ConvertServices from "../../services/convert-services";
import AuthServices from "../../services/auth-services";
import User from "../../models/user";


const SplashScreen = ({ navigation }: any) => {
    useEffect(() => {
        SharedPreferences.getItem('user', (user) => {
            if (user === null || user === undefined) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login', params: { navigation: navigation } }],
                });
                
            } else {
                const userObject = ConvertServices.stringToObject(user!);

                const userModels = new User(userObject.id, userObject.name, userObject.email, userObject.photoUrl);

                AuthServices.getInstance().SetUserLogged(userModels);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home', params: { navigation: navigation } }],
                });

            }


        });
    }, []);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ width: 250, height: 200, resizeMode: 'contain' }} source={require('../../../assets/images/logo.png')} />
            <ActivityIndicator size="large" color={ColorServices.primaryColor} />
        </View>
    );
}
export default SplashScreen;