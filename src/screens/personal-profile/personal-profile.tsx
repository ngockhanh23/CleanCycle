import { ScrollView, Text, View } from "react-native";
import ProfileUser from "../../components/profile-user/profile-user";
import { useEffect } from "react";

const PersonalProfile = ({navigation, route} : any) => {
    useEffect(() => {
        // setUser(loggedInUser);
      }, []);
    const {userID} = route.params
    return <View style={{ flex: 1, padding : 10 }}>
      <ProfileUser navigation={navigation} userID= {userID}/>
    </View>
}

export default PersonalProfile;