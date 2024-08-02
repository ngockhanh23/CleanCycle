import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import MediaPost from './media-post';
import { format } from 'date-fns';
import { getFirestore, collection, query, where, getDocs, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions for querying

import PostModel from '../../models/post';
import getUserInfo from '../../services/get-user-infor';
import AuthServices from '../../services/auth-services';

const Post = ({ navigation, post, isFocus }: { navigation: any, post: PostModel, isFocus: boolean }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null); // Lưu thông tin người dùng
    const userLogged = AuthServices.getInstance().GetUserLogged();

    // Function to check if userLogged has liked this post
    const checkIfLiked = async () => {
        const firestore = getFirestore();
        const postLikesCollection = collection(firestore, 'PostLikes');
        const q = query(postLikesCollection, where('userID', '==', userLogged?.id), where('postID', '==', post.id));

        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                // User has liked this post
                setIsLiked(true);
            } else {
                setIsLiked(false);
            }
        } catch (error) {
            console.error('Error checking like status:', error);
        }
    };

    // Function to fetch and set like count
    const fetchLikeCount = async () => {
        const firestore = getFirestore();
        const postLikesCollection = collection(firestore, 'PostLikes');
        const q = query(postLikesCollection, where('postID', '==', post.id));

        try {
            const querySnapshot = await getDocs(q);
            setLikeCount(querySnapshot.size); // Set likeCount to number of likes for this post
        } catch (error) {
            console.error('Error fetching like count:', error);
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = await getUserInfo(post.userID);
                setUserInfo(user);
            } catch (error) {
                console.error('Error getting user info:', error);
            }
        };

        const fetchLikeStatus = async () => {
            await checkIfLiked();
            await fetchLikeCount();
        };

        fetchUserInfo();
        fetchLikeStatus();
    }, [post.userID, userLogged?.id]); // Run again if post.userID or userLogged.id changes

    const toggleOptions = () => {
        setOptionsVisible(!optionsVisible);
    };

    const handleOptionPress = (option: any) => {
        console.log('Option selected:', option);
        setOptionsVisible(false); // Đóng menu sau khi chọn
    };

    const handlePostPressed = () => {
        if (optionsVisible) {
            setOptionsVisible(!optionsVisible);
            return;
        } else {
            navigation.push('PostDetail', { postID: post.id });
        }
    };

    const handleLikePress = async () => {
        const firestore = getFirestore();
        const postLikesCollection = collection(firestore, 'PostLikes');
        setIsLiked(!isLiked);
        try {
            if (isLiked) {
                setLikeCount(likeCount-1);

                // Unlike the post
                console.log('Unlike post:', post.id);
    
                // Example: Delete the like document in Firestore
                const querySnapshot = await getDocs(query(postLikesCollection, where('userID', '==', userLogged?.id), where('postID', '==', post.id)));
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });
                
            } else {
                setLikeCount(likeCount+1);

                console.log('Like post:', post.id);
    
                // Example: Add a new like document to Firestore
                await addDoc(postLikesCollection, {
                    userID: userLogged?.id,
                    postID: post.id,
                    dateLiked: serverTimestamp(),
                });

            }
    
            
            // await fetchLikeCount(); 
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleUserInforPress = () => {
        navigation.push('PersonalProfile', {navigation : navigation, userID : userInfo.id})
    }
    

    return (
        <View>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={handlePostPressed}>
                    <View>
                        <View style={styles.header}>
                            <View style={styles.profileSection}>
                                {userInfo && userInfo.photoUrl ? (
                                    <TouchableOpacity onPress={handleUserInforPress}>
                                        <Image style={styles.userImage} source={{ uri: userInfo.photoUrl }} />

                                    </TouchableOpacity>
                                ) : (
                                    <Image style={styles.userImage} source={require('../../../assets/images/default_avatar.png')} />
                                )}
                                <View>
                                    {userInfo && userInfo.name ? (
                                        <TouchableOpacity onPress={handleUserInforPress}>
                                            <Text style={styles.username}>{userInfo.name}</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <Text style={styles.username}></Text>
                                    )}
                                    <Text style={styles.time}>{format(new Date(post.uploadAt), 'dd/MM/yyyy')}</Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={toggleOptions}>
                                <Image style={styles.dotsIcon} source={require('../../../assets/icons/ic_3_dots.png')} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.textPost}>{post.content}</Text>
                    </View>
                </TouchableWithoutFeedback>

                {post.mediaList.length > 0 && (
                    <MediaPost navigation={navigation} listMedia={post.mediaList} />
                )}

                {optionsVisible && (
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity style={styles.optionItem} onPress={() => handleOptionPress('Option 1')}>
                            <Image style={{ width: 20, height: 20, marginRight: 10 }} source={require('../../../assets/icons/ic_book_mark.png')} />
                            <Text>Lưu bài đăng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionItem} onPress={() => handleOptionPress('Option 2')}>
                            <Image style={{ width: 20, height: 20, marginRight: 10 }} source={require('../../../assets/icons/ic_warning.png')} />
                            <Text>Báo tin xấu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionItem} onPress={() => handleOptionPress('Option 3')}>
                            <Image style={{ width: 20, height: 20, marginRight: 10 }} source={require('../../../assets/icons/ic_hide.png')} />
                            <Text>Ẩn tin này</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.action}>
                    <TouchableOpacity style={styles.actionItem} onPress={handleLikePress}>
                        <Image style={styles.iconAction} source={isLiked ? require('../../../assets/icons/ic_heart_green.png') : require('../../../assets/icons/ic_heart_outline.png')} />
                        <Text style={styles.textAction}>{likeCount}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem} onPress={() => {
                        if (!isFocus)
                            handlePostPressed()
                    }}>
                        <Image style={styles.iconAction} source={require('../../../assets/icons/ic_comment_outline.png')} />
                        {/* <Text style={styles.textAction}>0</Text> */}
                    </TouchableOpacity>

                    <View style={styles.actionItem}>
                        <Image style={styles.iconAction} source={require('../../../assets/icons/ic_share_grey.png')} />
                        <Text style={styles.textAction}>0</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    time: {
        fontSize: 16
    },
    dotsIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    optionsContainer: {
        position: 'absolute',
        right: 10,
        top: 30,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 2
    },
    optionItem: {
        padding: 10,
        flexDirection: 'row',
    },
    textPost: {
        fontSize: 16,
        marginVertical: 10
    },
    action: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconAction: {
        width: 30,
        height: 30,
        marginRight: 5
    },
    textAction: {
        fontSize: 20
    }
});

export default Post;
