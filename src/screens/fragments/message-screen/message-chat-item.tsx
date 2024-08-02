import { getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CircleAvatar from "../../../components/circle-avatar/circle-avatar";
import getUserInfo from "../../../services/get-user-infor";
import AuthServices from "../../../services/auth-services";

const MessageChatItem = ({navigation, chatItem} : any) => {
    const userLogged = AuthServices.getInstance().GetUserLogged();
    const [otherUserInfo, setOtherUserInfo] = useState<any>(null);
    
    const otherUserID = chatItem.users.find((item: any) => item !== userLogged?.id);


    useEffect(() => {
        if (otherUserID) {
            getUserInfo(otherUserID).then((userInfo) => {
                setOtherUserInfo(userInfo);
            }).catch((error) => {
                console.error('Error getting other user info:', error);
            });
        }
    }, [otherUserID]);

    
    const handleMessagePress = (chatID : string) => {
        navigation.push('MessageBox', {userID : otherUserID, chatID : chatID})
      }
    return (
        <TouchableOpacity key={chatItem.id} style={styles.chatItem} onPress={() => handleMessagePress(chatItem.id)}>
        <CircleAvatar width={70} height={70} url={otherUserInfo !== null ? otherUserInfo.photoUrl : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'}/>
          <View style = {{marginLeft : 10}}>
              <Text style = {styles.userInfoText}>{otherUserInfo !== null ? otherUserInfo.name : ''}</Text>
              <Text style = {styles.chatText}>{chatItem?.id === chatItem.messages[chatItem.messages.length -1].userID ? 'Bạn: ' : ''}{chatItem.messages[chatItem.messages.length -1].content} </Text>
          </View>
      </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    chatItem: {
        // flex : 1,
        flexDirection : 'row',
        padding: 15,
        // marginBottom: 5,
        borderRadius: 5,
        // backgroundColor: 'grey',
        width: '100%',
    },

    userInfoText: {
        fontSize: 20,
        // fontWeight: 'bold',
        color : '#000'
        // marginBottom: 18,
    },
    userInfo: {
        marginBottom: 20,
    },
    chatText: {
        fontSize: 16,
    },
    
})
export default MessageChatItem;