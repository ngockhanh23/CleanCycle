import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AuthServices from '../../services/auth-services';
import PostsListByUser from '../post-list-by-user/post-list-by-user';
import PostModel from '../../models/post';
import ColorServices from '../../services/color-services';
import User from '../../models/user';
import { getFirestore, collection, query, where, onSnapshot, doc, getDoc, getDocs } from 'firebase/firestore';
import ReelListByUser from '../reel-list-by-user/reel-list-by-user';
import ReelVideo from '../../models/reel-video';

const ProfileUser = ({ navigation, userID }: { navigation: any, userID: string }) => {
  const [selectedTab, setSelectedTab] = useState('posts');
  const [user, setUser] = useState<User | null>(null);
  const [postList, setPostList] = useState<PostModel[]>([]);
  const [reelVideos, setReelVideos] = useState<ReelVideo[]>([]);
  const loggedInUser = AuthServices.getInstance().GetUserLogged();

  useEffect(() => {
    const firestore = getFirestore();

    const getUser = async () => {
      const userDocRef = doc(firestore, "Users", userID);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const user = docSnap.data();
        const newUser = new User(user.id, user.name, user.email, user.photoUrl);
        setUser(newUser);
      }
    };

    const fetchReels = () => {
      const q = query(collection(firestore, 'Reels'), where('userID', '==', userID));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedReels: ReelVideo[] = [];
        querySnapshot.forEach((doc) => {
          const reelData = doc.data();
          const reel = new ReelVideo(
            doc.id,
            reelData.content,
            reelData.videoUrl,
            reelData.createdAt.toDate(),
            reelData.userID
          );
          fetchedReels.push(reel);
        });
        fetchedReels.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setReelVideos(fetchedReels);
      });

      return unsubscribe; // Return the unsubscribe function to clean up when component unmounts
    };

    const fetchPosts = async () => {
      try {
        const q = query(collection(firestore, 'Posts'), where('userID', '==', userID));
        const querySnapshot = await getDocs(q);
        const fetchedPosts: PostModel[] = [];
        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          const post = new PostModel(
            doc.id,
            postData.userID,
            postData.uploadAt.toDate(),
            postData.privacy,
            postData.content,
            postData.media
          );
          fetchedPosts.push(post);
        });
        setPostList(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    getUser();
    const unsubscribeReels = fetchReels(); // Get the unsubscribe function
    fetchPosts();

    // Cleanup function
    return () => {
      unsubscribeReels(); // Unsubscribe from the reels listener
    };
  }, [userID]);

  const renderContent = () => {
    switch (selectedTab) {
      case 'posts':
        return (
          <View style={styles.tabContent}>
            {postList.length > 0 ? (
              <PostsListByUser navigation={navigation} postList={postList} />
            ) : (
              <Text>Chưa có bài viết nào</Text>
            )}
          </View>
        );
      case 'reels':
        return (
          <View style={styles.tabContent}>
            {reelVideos.length > 0 ? (
              <ReelListByUser reelsData={reelVideos} navigation={navigation} />
            ) : (
              <Text>Chưa có nhật ký nào</Text>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  const handleMessage = () => {
    navigation.push('MessageBox', { userID: userID, chatID: '' });
  };

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {user && (
          <View style={{ width: '100%', paddingHorizontal: 10 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                style={{ width: 150, height: 150, resizeMode: 'contain', borderRadius: 100 }}
                source={{ uri: user.photoUrl }}
              />
            </View>
            {user.id === loggedInUser?.id ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, alignItems: 'center', paddingHorizontal: 40 }}>
                <Image style={{ width: 50, height: 50, resizeMode: 'cover' }} source={require('../../../assets/pig_pink.png')} />
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Xu của bạn</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFAB00', marginRight: 5 }}>14</Text>
                    <Image style={{ width: 20, height: 20, resizeMode: 'cover' }} source={require('../../../assets/icons/ic_xu.png')} />
                  </View>
                </View>
                <Image style={{ width: 50, height: 50, resizeMode: 'contain' }} source={require('../../../assets/coin_hand.png')} />
              </View>
            ) : (
              <View style={styles.buttonMessageContainer}>
                <TouchableOpacity style={styles.buttonMessage} onPress={handleMessage}>
                  <Image style={{ width: 20, height: 20, marginEnd: 10 }} source={require('../../../assets/icons/ic_send_message_white.png')} />
                  <Text style={styles.buttonMessageText}>Nhắn tin</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.tabBarView}>
              <TouchableOpacity
                style={[styles.tabItem, selectedTab === 'posts' && styles.selectedTab]}
                onPress={() => setSelectedTab('posts')}
              >
                <Text style={styles.tabText}>Bài đăng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, selectedTab === 'reels' && styles.selectedTab]}
                onPress={() => setSelectedTab('reels')}
              >
                <Text style={styles.tabText}>Nhật ký</Text>
              </TouchableOpacity>
            </View>

            {renderContent()}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
  },
  tabBarView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: ColorServices.primaryColor,
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonMessageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonMessage: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: ColorServices.primaryColor,
    borderRadius: 5,
  },
  buttonMessageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ProfileUser;
