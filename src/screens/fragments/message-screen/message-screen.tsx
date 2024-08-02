import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';

import AuthServices from "../../../services/auth-services";

import MessageChatItem from "./message-chat-item";
import CircleAvatar from "../../../components/circle-avatar/circle-avatar";


const MessageScreen = ({ navigation }: any) => {
    const [chats, setChats] = useState<any[]>([]);
    const firestore = getFirestore();

    const userLogged = AuthServices.getInstance().GetUserLogged();

    useEffect(() => {
        const q = query(collection(firestore, 'Chats'), where('users', 'array-contains', userLogged!.id));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatData = snapshot.docs.map(doc => {
                const data = doc.data();
                
                return {
                    id: doc.id,
                    ...data
                };
            });
            setChats(chatData);
            // console.log(chatData)
        });

        return () => unsubscribe();
    }, []);

    

    

    return (
        <View style={styles.container}>
             <View style={styles.appBar}>
             <CircleAvatar width={40} height={40} url={userLogged !== null ? userLogged?.photoUrl : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'} />
      
                <Text style={styles.appBarTitle}>Đoạn chat</Text>                
              </View>
           
            <ScrollView contentContainerStyle={styles.scrollView}>
                {chats.map((chat) => (
                    
                    <View key={chat.id}>
                        <MessageChatItem  navigation = {navigation} chatItem = {chat} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : '#fff'
    },
    appBar: {
      height: 65,
      backgroundColor: "#fff",
      justifyContent: 'flex-start',
      alignItems: 'center',
      // marginBottom: 20,
      paddingLeft : 20,
      flexDirection: 'row',
      borderBottomWidth : 1,
      borderBottomColor : '#ececec'
    },
    appBarTitle: {
      color: '#000',
      fontSize: 25,
      fontWeight: 'bold',
      marginLeft : 10
    },
  
 
    scrollView: {
        flexGrow: 1,
        width: '100%',
        padding: 10,

    },
   
    
});

export default MessageScreen;
