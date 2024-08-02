import React, { useEffect, } from 'react';
import { View, StyleSheet } from 'react-native';

import PostModel from '../../models/post';
import Post from '../posts/post';

const PostsListByUser = ({ navigation, postList }: { navigation: any; postList : PostModel[] }) => {
    

    useEffect(() => {
      
    }, [navigation]); // Add navigation and userID to dependencies

   

    return (
        <View style={styles.container}>
            {postList.map(post => (
                <View key={post.id} style={styles.postContainer}>
                    <Post isFocus={true} navigation={navigation} post={post} />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 10,
        backgroundColor: '#f5f5f5',
        width : '100%'
    },
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
        // width: '100%',
    },
});

export default PostsListByUser;
