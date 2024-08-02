import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TouchableWithoutFeedback, Image } from 'react-native';
import Video from 'react-native-video';
import Modal from 'react-native-modal';
import ReelVideo from '../../models/reel-video';
import CommentVideoReel from '../../components/comment-video-reel/comment-video-reel';
import CircleAvatar from './../../components/circle-avatar/circle-avatar';
import getUserInfo from '../../services/get-user-infor';
import ReelComments from '../../models/reel-comment';
import { addDoc, collection, deleteDoc, getDocs, getFirestore, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import AuthServices from '../../services/auth-services';



const ReelVideoSwiperItem = ({ reelVideo, isFocused }: { reelVideo: ReelVideo, isFocused: boolean, }) => {
    const [paused, setPaused] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [otherUserInfo, setOtherUserInfo] = useState<any>(null);
    const [reelComments, setReelComments] = useState<ReelComments[]>([]);
    const userLogged = AuthServices.getInstance().GetUserLogged();





    useEffect(() => {

        getUserInfo(reelVideo.userID).then((userInfo) => {
            setOtherUserInfo(userInfo);
        }).catch((error) => {
            console.error('Error getting other user info:', error);
        });

    }, []);

    useEffect(() => {
        const getReelComments = async () => {
            const firestore = getFirestore();
            const commentsCollection = collection(firestore, 'ReelComments');
            const q = query(commentsCollection, where('reelVideoID', '==', reelVideo.id));

            try {
                const querySnapshot = await getDocs(q);
                const fetchedComments = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return new ReelComments(
                        doc.id,
                        data.userID,
                        data.reelVideoID,
                        data.content,
                        data.dateComment.toDate() // Convert Firestore Timestamp to JavaScript Date
                    );
                });
                setReelComments(fetchedComments);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        getReelComments();
        fetchLikeStatus();
    }, [])


    useEffect(() => {
        if (isFocused) {
            setPaused(false);
        } else {
            setPaused(true);
        }
    }, [isFocused]);

    const togglePausePlay = () => {
        setPaused(!paused);
    };
    const fetchLikeStatus = async () => {
        await checkIfLiked();
        await fetchLikeCount();
    };

    const checkIfLiked = async () => {
        const firestore = getFirestore();
        const postLikesCollection = collection(firestore, 'ReelLikes');
        const q = query(postLikesCollection, where('userID', '==', userLogged?.id), where('reelVideoID', '==', reelVideo.id));

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
        const postLikesCollection = collection(firestore, 'ReelLikes');
        const q = query(postLikesCollection, where('reelVideoID', '==', reelVideo.id));

        try {
            const querySnapshot = await getDocs(q);
            setLikeCount(querySnapshot.size); // Set likeCount to number of likes for this post
        } catch (error) {
            console.error('Error fetching like count:', error);
        }
    };

    const handleLike = async () => {
        const firestore = getFirestore();
        const reelLikesCollection = collection(firestore, 'ReelLikes');
        setIsLiked(!isLiked);
        try {
            if (isLiked) {
                setLikeCount(likeCount - 1);

                // Unlike the post
                console.log('Unlike post:', reelVideo.id);

                // Example: Delete the like document in Firestore
                const querySnapshot = await getDocs(query(reelLikesCollection, where('userID', '==', userLogged?.id), where('reelVideoID', '==', reelVideo.id)));
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });

            } else {
                setLikeCount(likeCount + 1);

                console.log('Like post:', reelVideo.id);

                // Example: Add a new like document to Firestore
                await addDoc(reelLikesCollection, {
                    userID: userLogged?.id,
                    reelVideoID: reelVideo.id,
                    dateLiked: serverTimestamp(),
                });

            }


            // await fetchLikeCount(); 
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    }

    const openComment = () => {
        setModalVisible(true);
    }

    const closeModal = () => {
        setModalVisible(false);
    }



    return (
        <View style={styles.container}>


            <TouchableWithoutFeedback style={styles.videoContainer} onPress={togglePausePlay}>
                <Video
                    source={{ uri: reelVideo.videoUrl }}
                    style={styles.video}
                    controls={false}
                    paused={paused}
                    repeat={true}
                    resizeMode="cover"
                    muted={isMuted}
                />
            </TouchableWithoutFeedback>

            {paused && (
                <TouchableWithoutFeedback onPress={() => { setPaused(false) }}>
                    <Image style={styles.playIcon} source={require('../../../assets/icons/ic_play.png')} />
                </TouchableWithoutFeedback>
            )}

            <View style={styles.footer}>
                <View style={styles.userInfor}>
                    <CircleAvatar width={40} height={40} url={otherUserInfo !== null ? otherUserInfo.photoUrl : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'} />


                    <Text style={styles.userName}>{otherUserInfo !== null ? otherUserInfo.name : ''}</Text>
                </View>
                <View>
                    <Text style={{ color: '#fff', fontSize: 18 }}>{reelVideo.content}</Text>
                </View>
            </View>

            <View style={styles.actionArea}>
                <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
                    {!isLiked ?
                        (<Image style={styles.iconAction} source={require('../../../assets/icons/ic_heart_grey.png')} />)
                        : (<Image style={styles.iconAction} source={require('../../../assets/icons/ic_heart_green.png')} />)}
                    <Text style={{ fontSize: 18, color: '#fff' }}>{likeCount}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} onPress={openComment}>
                    <Image style={styles.iconAction} source={require('../../../assets/icons/ic_comment_grey.png')} />
                    <Text style={{ fontSize: 18, color: '#fff' }}>{reelComments.length}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn}>
                    <Image style={styles.iconAction} source={require('../../../assets/icons/ic_share_white.png')} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} onPress={() => setIsMuted(!isMuted)}>
                    {isMuted ? (
                        <Image style={styles.iconAction} source={require('../../../assets/icons/ic_mute.png')} />
                    ) : (
                        <Image style={styles.iconAction} source={require('../../../assets/icons/ic_unmute.png')} />
                    )}
                </TouchableOpacity>
            </View>

            <Modal
                isVisible={isModalVisible}
                onBackdropPress={closeModal}
                style={styles.bottomModal}
                swipeDirection='down'
                onSwipeComplete={closeModal}
            >
                <CommentVideoReel reelCommentList={reelComments} reelVideoID={reelVideo.id} />

            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoContainer: {
        width: '100%',
        height: '100%',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    playIcon: {
        position: 'absolute',
        width: 100,
        resizeMode: 'contain'
    },
    footer: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        padding: 20
    },
    userInfor: {
        // flex: 1,
        flexDirection: "row",
        alignItems: 'center',
    },
    userImage: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
        borderRadius: 50
    },
    userName: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10
    },
    actionArea: {
        position: 'absolute',
        right: 10,
        bottom: 100,
        // zIndex
    },
    iconAction: {
        width: 40,
        resizeMode: 'contain',
        height: 40,
    },
    actionBtn: {
        marginBottom: 40,
        alignItems: 'center',
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 17,
        borderTopRightRadius: 17,
    },
});

export default ReelVideoSwiperItem;
