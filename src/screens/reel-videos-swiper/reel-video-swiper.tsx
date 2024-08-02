import React, { useEffect, useState } from 'react';
import { View, StyleSheet, LogBox, TouchableWithoutFeedback, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import ReelVideo from '../../models/reel-video';
import ReelVideoSwiperItem from './reel-video-swiper-item';

interface ReelVideoSwiperProps {
    navigation: any;
    route: {
        params: {
            reelsList: ReelVideo[];
            indexItem: number;
        };
    };
}

const ReelVideoSwiper = ({ navigation, route } : any) => {
    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);

    const { reelsList, indexItem } = route.params;

    const [currentIndex, setCurrentIndex] = useState(indexItem);

    useEffect(() => {
        setCurrentIndex(indexItem); // Thiết lập lại currentIndex khi indexItem thay đổi
    }, [indexItem]);

    const handleIndexChanged = (index: number) => {
        setCurrentIndex(index); // Cập nhật currentIndex mỗi khi người dùng lướt
    };

    return (
        <View style={styles.wrapper}>
            <Swiper
                index={indexItem}
                horizontal={false}
                showsButtons={false}
                showsPagination={false}
                loop={false}
                onIndexChanged={handleIndexChanged}
            >
                {reelsList.map((reel : any, index : any) => (
                    <ReelVideoSwiperItem
                        key={index}
                        reelVideo={reel}
                        isFocused={currentIndex === index}
                    />
                ))}
            </Swiper>
            <View style={styles.backButton}>
                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                    <Image style={styles.backIconPng} source={require('../../../assets/icons/ic_left_arrow.png')} />
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center'
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    backIconPng: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
    },
    muteButton: {
        position: 'absolute',
        top: 30,  // Adjust as needed
        right: 10,  // Adjust as needed
        zIndex: 1,
    },
    muteIconImg: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
    },
});

export default ReelVideoSwiper;
