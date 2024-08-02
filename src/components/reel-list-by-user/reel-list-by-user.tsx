import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { createThumbnail } from "react-native-create-thumbnail";
import ReelVideo from "../../models/reel-video";

const ReelListByUser = ({ navigation, reelsData }: { navigation: any, reelsData: ReelVideo[] }) => {
    const [thumbnails, setThumbnails] = useState<string[]>([]);

    useEffect(() => {
        createThumbnailList(reelsData);
    }, [reelsData]);

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

    return (
        <View style = {{flex : 1, width : '100%'}}>
            <FlatList
                scrollEnabled={false}
                numColumns={2} 
                data={thumbnails}
                
                renderItem={({ item, index }) => (
                    <View style={styles.videoThumbnailItem} key={index}>
                        {item === '' ? (
                            <Image style={styles.imagePlaceholder} source={require('../../../assets/images/none_video_reel.png')} />
                        ) : (
                            <TouchableWithoutFeedback onPress={() => { navigation.push('ReelVideoSwiper', { navigation: navigation, reelsList: reelsData, indexItem: index }) }}>
                                <View>
                                    <Image source={{ uri: item }} style={styles.imageThumbnail} />
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                style={{ marginVertical: 10, paddingHorizontal : 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    videoThumbnailItem: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginRight: 10,
        marginBottom: 20
    },
    imageThumbnail: {
        width: 160,
        height: 240,
        borderRadius: 10
    },
    imagePlaceholder: {
        width: 160,
        height: 240,
        resizeMode: 'contain',
        borderRadius: 10
    },
});

export default ReelListByUser;
