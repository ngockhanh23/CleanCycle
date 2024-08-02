import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ColorServices from "../../services/color-services";
import CircleAvatar from "../../components/circle-avatar/circle-avatar";
import AuthServices from "../../services/auth-services";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, addDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import getUserInfo from "../../services/get-user-infor";

type Message = {
    content: string;
    image: string;
    timeMessage: { seconds: number; nanoseconds: number };
    userID: string;
};

const MessageBox = ({ navigation, route }: any) => {
    const { userID } = route.params;
    const { chatID } = route.params;
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(true); // State to manage loading state
    const scrollViewRef = useRef<ScrollView>(null);
    const firestore = getFirestore();
    const [otherUserInfo, setOtherUserInfo] = useState<any>(null);

    const userLogged = AuthServices.getInstance().GetUserLogged();

    useEffect(() => {
        getUserInfo(userID).then((userInfo) => {
            setOtherUserInfo(userInfo);
        }).catch((error) => {
            console.error('Error getting other user info:', error);
        });

    }, []);

    useEffect(() => {
        const loadMessages = async () => {
            if (chatID !== '') {
                onSnapshot(doc(firestore, 'Chats', chatID), (snapshot) => {
                    if (snapshot.exists()) {
                        setMessages(snapshot.data().messages);
                        setLoadingMessages(false); // Set loading state to false when messages are loaded
                    }
                });
            } else {
                const q = query(collection(firestore, 'Chats'), where('users', 'array-contains', userLogged!.id));
                const chatSnapshot = await getDocs(q);

                let chatDoc: any;
                chatSnapshot.forEach((doc) => {
                    if (doc.data().users.includes(userID)) {
                        chatDoc = doc;
                    }
                });

                if (!chatDoc) {
                    const newChatDocRef = await addDoc(collection(firestore, 'Chats'), {
                        users: [userLogged!.id, userID],
                        messages: []
                    });
                    const newChatDoc = await getDoc(newChatDocRef);
                    chatDoc = newChatDoc;
                }

                if (chatDoc && chatDoc.exists()) {
                    onSnapshot(doc(firestore, 'Chats', chatDoc.id), (snapshot) => {
                        if (snapshot.exists()) {
                            setMessages(snapshot.data().messages);
                            setLoadingMessages(false); // Set loading state to false when messages are loaded
                        }
                    });
                }
            }
        };

        loadMessages();
    }, []);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const handleSend = async () => {
        if(messageInput === ''){
            return;
        }
        const message: Message = {
            content: messageInput,
            image: "",
            timeMessage: { seconds: Date.now() / 1000, nanoseconds: 0 },
            userID: userLogged!.id
        };

        const q = query(collection(firestore, 'Chats'), where('users', 'array-contains', userLogged!.id));
        const chatSnapshot = await getDocs(q);

        let chatDoc: any;
        chatSnapshot.forEach((doc) => {
            if (doc.data().users.includes(userID)) {
                chatDoc = doc;
            }
        });

        if (chatDoc) {
            await updateDoc(doc(firestore, 'Chats', chatDoc.id), {
                messages: [...chatDoc.data().messages, message]
            });
            setMessageInput('');
        }
    };

    const isURL = (text: string): boolean => {
        const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return urlPattern.test(text);
    };

    if (loadingMessages) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={ColorServices.primaryColor} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.appBar}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={() => { navigation.goBack(); }}>
                        <Image style={{ width: 30, height: 30 }} source={require('../../../assets/icons/ic_back_white.png')} />
                    </TouchableOpacity>
                    <CircleAvatar width={50} height={50} url={otherUserInfo !== null ? otherUserInfo.photoUrl : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'} />
                </View>
                <View><Text style={styles.appBarTitle}>{otherUserInfo !== null ? otherUserInfo.name : ''}</Text></View>
            </View>
            <ScrollView style={styles.scrollView} ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
                {messages.map((message, index) => (
                    <View key={index} style={[
                        styles.messageContainer,
                        message.userID === userLogged!.id ? styles.sentMessage : styles.receivedMessage
                    ]}>
                        {isURL(message.content) ? (
                            <TouchableOpacity onPress={() => Linking.openURL(message.content)}>
                                <Text style={[styles.messageContent, { color: message.userID === userLogged!.id ? '#fff' : '#000' }]}>Link: {message.content}</Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={[styles.messageContent, { color: message.userID === userLogged!.id ? '#fff' : '#000' }]}>{message.content}</Text>
                        )}
                        <Text style={[styles.messageTime, { color: message.userID === userLogged!.id ? '#ececec' : 'grey' }]}>
                            {new Date(message.timeMessage.seconds * 1000).toLocaleDateString()} {new Date(message.timeMessage.seconds * 1000).toLocaleTimeString()}
                        </Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.footerContainer}>
            <TouchableOpacity  style={styles.actionButton}>
                <Image source={require('../../../assets/icons/ic_image.png')} style={styles.actionImage} />
                
            </TouchableOpacity>
                <TextInput
                    style={styles.inputMessage}
                    placeholder="Nhắn tin"
                    value={messageInput}
                    onChangeText={setMessageInput}
                />
                <TouchableOpacity style={styles.btnSend} onPress={handleSend}>
                    {/* <Text style={styles.btnText}>Gửi</Text> */}
                    <Image style = {{width : 20, height : 20, marginEnd: 10}} source={require('../../../assets/icons/ic_send_message_white.png')}/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    appBar: {
        height: 70,
        backgroundColor: ColorServices.primaryColor,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    appBarTitle: {
        marginLeft: 10,
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    messageContainer: {
        maxWidth: '70%',
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    sentMessage: {
        backgroundColor: ColorServices.primaryColor,
        alignSelf: 'flex-end',
        marginRight: 10,
    },
    receivedMessage: {
        backgroundColor: '#ccc',
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    messageContent: {
        fontSize: 16,
        marginBottom: 5,
    },
    messageTime: {
        fontSize: 12,
    },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    inputMessage: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
    },
    btnSend: {
        backgroundColor: ColorServices.primaryColor,
        // paddingHorizontal: 20,
        // paddingVertical: 10,
        paddingLeft : 5,
        borderRadius: 100,
        width : 45,
        height : 45,
        justifyContent : 'center',
        alignItems : 'center'
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight : 10,
    },
    actionImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },

    actionText: {
        fontSize: 20,
        marginLeft: 10
    },
});

export default MessageBox;
