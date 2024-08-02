import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const { width, height } = Dimensions.get('window');

const ImageDetailList = ({ navigation, route }: any) => {
    const { lstImages } = route.params;
    const { index } = route.params;


    const renderHeader = () => (
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Text style={styles.closeButtonText}>Thoát</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ImageViewer
                imageUrls={lstImages.map((url:any) => ({ url }))}
                index={index}
                style={styles.image}
                renderHeader={renderHeader}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    image: {
        width,
        height,
    },
});

export default ImageDetailList;
