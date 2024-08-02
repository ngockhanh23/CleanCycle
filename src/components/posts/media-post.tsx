import React, { useState, useRef, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';
import { useIsFocused } from '@react-navigation/native';

const MediaPost = ({ navigation, listMedia }: { navigation: any, listMedia: { url: string, type: string, fileName: string }[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRefs = useRef<any[]>([]);
    const isFocused = useIsFocused();

    const onIndexChanged = (index: number) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        videoRefs.current.forEach((video, idx) => {
            if (video) {
                if (isFocused && idx === currentIndex) {
                    video.playAsync?.();
                } else {
                    video.pause?.();
                }
            }
        });
    }, [currentIndex, isFocused]);

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <Swiper
                    horizontal
                    showsButtons={false}
                    showsPagination
                    loop={false}
                    paginationStyle={styles.pagination}
                    onIndexChanged={onIndexChanged}
                >
                    {listMedia.map((mediaItem, index) => (
                        <View key={index} style={styles.mediaItemContainer}>
                            {mediaItem.type === 'image' ? (
                                <Image
                                    source={{ uri: mediaItem.url }}
                                    style={styles.mediaItem}
                                />
                            ) : (
                                <Video
                                    ref={(ref) => { videoRefs.current[index] = ref; }}
                                    source={{ uri: mediaItem.url }}
                                    style={styles.mediaItem}
                                    resizeMode="contain"
                                    controls
                                    muted={false}
                                    paused={!isFocused || currentIndex !== index}
                                />
                            )}
                        </View>
                    ))}
                </Swiper>
                <View style={{ height: 50 }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        height: '100%',
    },
    mediaItemContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mediaItem: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
    },
    pagination: {
        marginBottom: -50,
    },
});

export default MediaPost;
