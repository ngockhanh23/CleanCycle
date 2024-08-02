// PostListComponent.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Post from "../posts/post";
import { collection, getFirestore, query, where, onSnapshot } from 'firebase/firestore';
import PostModel from '../../models/post';

const PostListComponent = ({ navigation }: any) => {
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const firestore = getFirestore();
        const postsCollection = collection(firestore, 'Posts');
        const q = query(postsCollection, where('privacy', '==', 'public'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedPosts: PostModel[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                updatedPosts.push(new PostModel(
                    doc.id,
                    data.userID,
                    data.uploadAt.toDate(), // Assuming uploadAt is a Firestore Timestamp
                    data.privacy,
                    data.content,
                    data.media
                ));
            });
            updatedPosts.sort((a, b) => b.uploadAt.getTime() - a.uploadAt.getTime());
            setPosts(updatedPosts);
            setLoading(false);
        });

        // Clean up function to unsubscribe from the snapshot listener
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View>
            {posts.map(post => (
                <View key={post.id} style={styles.postContainer}>
                    <Post isFocus={false} navigation={navigation} post={post} />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginVertical: 10,
        width: 'auto'
    }
});

export default PostListComponent;
