import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { createThumbnail } from "react-native-create-thumbnail";
import { getFirestore, collection, query, onSnapshot, orderBy } from "firebase/firestore";
import AuthServices from "../../services/auth-services";
import { launchImageLibrary } from "react-native-image-picker";
import ReelVideo from "../../models/reel-video";

const VideoReelComponents = ({ navigation }: any) => {
    const [reelVideos, setReelVideos] = useState<ReelVideo[]>([]);
    const [thumbnails, setThumbnails] = useState<string[]>([]);
    const userLogged = AuthServices.getInstance().GetUserLogged();

    useEffect(() => {
        const db = getFirestore();
        const q = query(collection(db, 'Reels',));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reelsData = snapshot.docs.map(doc => {
                const data = doc.data();
                return new ReelVideo(
                    doc.id,
                    data.content,
                    data.videoUrl,
                    data.createdAt.toDate(),
                    data.userID
                );
            }).sort((a, b) =>   b.createdAt.getTime() - a.createdAt.getTime() ); // Sort by createdAt
            setReelVideos(reelsData);
            createThumbnailList(reelsData);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const createThumbnailList = async (reels: ReelVideo[]) => {
        try {
            const thumbnailPromises = reels.map(reel => createThumbnailURI(reel.videoUrl));
            const thumbnailsData = await Promise.all(thumbnailPromises);
            setThumbnails(thumbnailsData);
        } catch (error) {
            console.log("Error creating thumbnails:", error);
        }
    };

    const createThumbnailURI = async (downloadUrl: string) => {
        try {
            const response = await createThumbnail({
                url: downloadUrl,
                timeStamp: 10000,
            });
            return response.path;
        } catch (error) {
            console.log("Error creating thumbnail:", error);
            return '';
        }
    };

    const handleUpload = () => {
        launchImageLibrary({ mediaType: "video" }, (response: any) => {
            if (response && response.assets && response.assets.length > 0) {
                const videoUri = response.assets[0].uri;
                navigation.push("UploadReels", { videoUri });
            } else {
                console.log('User canceled or encountered an error:', response);
            }
        });
    };

    return (
        <View>
            <FlatList
                horizontal={true}
                data={thumbnails}
                renderItem={({ item, index }) => (
                    <View style={styles.videoThumbnailItem}>
                        {item === '' ? (
                            <Image style={styles.imagePlaceholder} source={require('../../../assets/images/none_video_reel.png')} />
                        ) : (
                            <TouchableWithoutFeedback key={index} onPress={() => { navigation.push('ReelVideoSwiper', { navigation: navigation, reelsList: reelVideos, indexItem: index }) }}>
                                <View>
                                    <Image source={{ uri: item }} style={styles.imageThumbnail} />
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                style={{ marginVertical: 10 }}
                ListHeaderComponent={
                    <TouchableOpacity style={styles.headerButton} onPress={handleUpload}>
                        <Image style={styles.imageButtonCreate} source={{ uri: userLogged?.photoUrl }} />
                        <View style={{ height: '30%', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 35, height: 35, backgroundColor: '#fff', borderRadius: 100, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '-30%' }}>
                                <Image style={{ width: 30, height: 30, backgroundColor: '#fff', borderRadius: 100 }} source={require('../../../assets/icons/ic_addpost_green.png')} />
                            </View>
                            <View style={{ height: 10 }}></View>
                            <Text style={styles.headerButtonText}>Thêm tin mới</Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    videoThumbnailItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginRight: 5
    },
    imageThumbnail: {
        width: 110,
        height: 150,
        borderRadius: 5
    },
    imagePlaceholder: {
        width: 100,
        height: 150,
        resizeMode: 'contain',
    },
    headerButton: {
        width: 110,
        height: 150,
        borderRadius: 5,
        borderWidth: 0.3,
        marginEnd: 5,
        color: '#929193'
    },
    headerButtonText: {
        fontWeight: 'bold'
    },
    imageButtonCreate: {
        height: '70%',
        resizeMode: 'cover',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    }
});

export default VideoReelComponents;
