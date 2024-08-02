import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import CommentReelItem from "./comment-reel-item";
import CircleAvatar from '../circle-avatar/circle-avatar';
import ColorServices from '../../services/color-services';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import AuthServices from '../../services/auth-services';
import ReelComments from '../../models/reel-comment';

const CommentVideoReel = ({ reelCommentList, reelVideoID }: { reelCommentList: ReelComments[], reelVideoID: string }) => {
    const firestore = getFirestore();
    const userLogged = AuthServices.getInstance().GetUserLogged();
    const [comment, setComment] = useState('');

    // Sử dụng reelCommentList để hiển thị danh sách bình luận
    const [reelComments, setReelComments] = useState<ReelComments[]>(reelCommentList);

    // Cập nhật danh sách bình luận khi reelCommentList thay đổi
    useEffect(() => {
        setReelComments(reelCommentList);
    }, [reelCommentList]);

    const handleAddComment = async () => {
        const commentsCollection = collection(firestore, 'ReelComments');

        try {
            const newCommentDocRef = await addDoc(commentsCollection, {
                userID: userLogged?.id,
                reelVideoID: reelVideoID,
                content: comment,
                dateComment: serverTimestamp(),
            });
            console.log('Comment added with ID: ', newCommentDocRef.id);

            // Tạo đối tượng bình luận mới
            var newComment = new ReelComments (
                 newCommentDocRef.id,
                userLogged?.id,
                reelVideoID,
                comment,
                new Date(), // Thời gian hiện tại
            );

            // Thêm bình luận mới vào đầu mảng
            const updatedComments = [newComment, ...reelComments];
            setReelComments(updatedComments);

            setComment('');
            Keyboard.dismiss();
            // fetchComments(); 
        } catch (error) {
            console.error('Error adding comment: ', error);
        }
    };

    const renderItem = ({ item }: { item: ReelComments }) => (
        <CommentReelItem reelComment={item} />
    );

    return (
        <View style={styles.modalContent}>
            <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{reelComments.length} Bình luận</Text>

            <FlatList
                data={reelComments} // Sử dụng reelComments để render danh sách bình luận
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id} // Sử dụng item.id làm key
            />

            <View style={styles.commentInputContainer}>
                <View style={{ marginRight: 10 }}>
                    <CircleAvatar width={40} height={40} url={userLogged !== null ? userLogged?.photoUrl : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'} />
                </View>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Viết bình luận..."
                    placeholderTextColor="#918F8F"
                    value={comment}
                    onChangeText={setComment}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
                    <Text style={styles.sendButtonText}>Gửi</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        minHeight: '70%',
        backgroundColor: 'white',
        padding: 22,
        position: 'relative',
        borderTopLeftRadius: 17,
        borderTopRightRadius: 17,
    },
    topContent: {
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#918F8F',
        borderBottomWidth: 1,
        borderBottomColor: '#918F8F',
        height: 50,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    commentInputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#918F8F',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    commentInput: {
        flex: 1,
        height: 40,
        borderColor: '#918F8F',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
        color: '#000',
    },
    sendButton: {
        backgroundColor: ColorServices.primaryColor,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default CommentVideoReel;
