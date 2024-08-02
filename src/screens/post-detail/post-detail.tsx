import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Keyboard } from 'react-native';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';

import PostModel from '../../models/post';
import PostComments from '../../models/post-comment';
import Post from '../../components/posts/post';
import { format } from 'date-fns';
import getUserInfo from '../../services/get-user-infor';
import AuthServices from '../../services/auth-services';
import ColorServices from '../../services/color-services';

const PostDetail = ({ navigation, route }: any) => {
    const { postID } = route.params;
    const [post, setPost] = useState<PostModel | null>(null);
    const [comments, setComments] = useState<PostComments[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            const firestore = getFirestore();
            const postRef = doc(firestore, 'Posts', postID);

            try {
                const docSnapshot = await getDoc(postRef);
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    if (data) {
                        const fetchedPost = new PostModel(
                            docSnapshot.id,
                            data.userID,
                            data.uploadAt.toDate(), // Assuming uploadAt is a Firestore Timestamp
                            data.privacy,
                            data.content,
                            data.media
                        );
                        setPost(fetchedPost);
                    }
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };

        

        fetchPost();
        fetchComments();
    }, [postID]);
    const fetchComments = async () => {
        const firestore = getFirestore();
        const commentsCollection = collection(firestore, 'Comments');
        const q = query(commentsCollection, where('postID', '==', postID), orderBy('dateComment', 'desc'));

        try {
            const querySnapshot = await getDocs(q);
            const fetchedComments = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return new PostComments(
                    doc.id,
                    data.userID,
                    data.postID,
                    data.content,
                    data.dateComment.toDate() // Convert Firestore Timestamp to JavaScript Date
                );
            });
            setComments(fetchedComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const renderCommentItems = () => {
        return comments.map(comment => (
            <CommentItemComponent key={comment.id} comment={comment} />
        ));
    };

   

    const CommentItemComponent = ({ comment }: { comment: PostComments }) => {
        const [user, setUser] = useState<any>(null);

        useEffect(() => {
            const fetchUserInfo = async () => {
                const userInfo = await getUserInfo(comment.userID);
                setUser(userInfo);
            };

            fetchUserInfo();
        }, [comment.userID]);

        if (!user) {
            return null; // Handle loading state for user info
        }

        return (
            <View style={styles.commentItem}>
                <View style={styles.commentHeader}>
                    <Image source={{ uri: user.photoUrl }} style={styles.avatar} />
                    <Text style={styles.userName}>{user.name}</Text>
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
                <Text style={styles.commentDate}>{format(new Date(comment.dateComment), 'dd/MM/yyyy')}</Text>
            </View>
        );
    };

    const handleAddComment = async () => {
        const firestore = getFirestore();
        const commentsCollection = collection(firestore, 'Comments');
        const userLoggedID = AuthServices.getInstance().GetUserLogged()?.id;

        try {
            const newCommentDocRef = await addDoc(commentsCollection, {
                userID: userLoggedID, // Replace with actual userID
                postID: postID,
                content: newComment,
                dateComment: serverTimestamp(),
            });
            console.log('Comment added with ID: ', newCommentDocRef.id);
            setNewComment('');
            Keyboard.dismiss(); // Close the keyboard after adding comment
            fetchComments(); // Fetch updated comments after adding a new comment
        } catch (error) {
            console.error('Error adding comment: ', error);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.contentContainer}>
                    {post && <Post key={post.id} navigation={navigation} post={post} isFocus={true} />}
                </View>
                <View style={styles.commentContainer}>
                    <Text style = {{marginBottom : 15}}>{`Bình luận(${comments.length})`}</Text>
                    {renderCommentItems()}
                </View>
            </ScrollView>
            <View style={styles.footerContainer}>
                <TextInput
                    style={styles.inputComment}
                    placeholder="Viết bình luận..."
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <TouchableOpacity style={styles.btnComment} onPress={handleAddComment}>
                    <Text style={styles.btnText}>Gửi</Text>
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
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 15,
    },
    commentContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        padding: 15,
        marginBottom: 50,
    },
    commentItem: {
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    commentContent: {
        fontSize: 16,
    },
    commentDate: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    inputComment: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
    },
    btnComment: {
        backgroundColor: ColorServices.primaryColor,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PostDetail;
