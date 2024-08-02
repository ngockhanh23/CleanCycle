import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GridImageList = ({ navigation, listMedia }: { navigation: any, listMedia: {url : string, type : string, fileName : string}[] }) => {
    const viewDetailImage = (index : number) => {
        navigation.push('ImagesDetailList', {lstImages : listMedia,index : index})
    }

    const renderImages = () => {
        switch (listMedia.length) {
            case 1:
                return (
                    <TouchableOpacity style = {styles.singleImageContainer} onPress={() =>viewDetailImage(0)}>
                        <Image source={{ uri: listMedia[0].url }} style={[styles.image, styles.singleImage]} />
                    </TouchableOpacity>
                );
            case 2:
                return (
                    <View style={styles.twoImagesContainer}>
                        <TouchableOpacity style = {{width : '100%'}}  onPress={() =>viewDetailImage(0)}>
                            <Image style={[ styles.twoImages , styles.image]} source={{ uri: listMedia[0].url }}  />
                        </TouchableOpacity>
                        <TouchableOpacity  style = {{width : '100%'}}  onPress={() =>viewDetailImage(1)}>
                            <Image style={[ styles.twoImages , styles.image]} source={{ uri: listMedia[1].url }}  />
                        </TouchableOpacity>
                    </View>
                );
            case 3:
                return (
                    <View style={styles.threeImagesContainer}>
                        <TouchableOpacity onPress={() =>viewDetailImage(0)}>
                            <Image source={{ uri: listMedia[0].url }} style={[styles.image, styles.threeImagesLarge]} />
                        </TouchableOpacity>
                        <View style={styles.threeImagesColumn}>
                            <TouchableOpacity onPress={() =>viewDetailImage(1)}>
                                <Image source={{ uri: listMedia[1].url }} style={[styles.image, styles.threeImagesSmall]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() =>viewDetailImage(2)}>
                                <Image source={{ uri: listMedia[2].url }} style={[styles.image, styles.threeImagesSmall]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            case 4:
                return (
                    <View style={styles.fourImagesContainer}>
                        <TouchableOpacity onPress={() =>viewDetailImage(0)}>
                            <Image source={{ uri: listMedia[0].url }} style={[styles.image, styles.fourImages]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>viewDetailImage(1)}>
                            <Image source={{ uri: listMedia[1].url }} style={[styles.image, styles.fourImages]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>viewDetailImage(2)}>
                            <Image source={{ uri: listMedia[2].url }} style={[styles.image, styles.fourImages]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>viewDetailImage(3)}>
                            <Image source={{ uri: listMedia[3].url }} style={[styles.image, styles.fourImages]} />
                        </TouchableOpacity>
                    </View>
                );
            case 5:
                return (
                    <View style={styles.fiveImagesContainer}>
                        <View style={styles.fiveImagesColumn}>
                            <TouchableOpacity onPress={() =>viewDetailImage(0)}>
                                <Image source={{ uri: listMedia[0].url }} style={[styles.image, styles.fiveImagesLarge]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() =>viewDetailImage(1)}>
                                <Image source={{ uri: listMedia[1].url }} style={[styles.image, styles.fiveImagesLarge]} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.fiveImagesColumn}>
                            <TouchableOpacity onPress={() =>viewDetailImage(2)}>
                                <Image source={{ uri: listMedia[2].url }} style={[styles.image, styles.fiveImagesSmall]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() =>viewDetailImage(3)}>
                                <Image source={{ uri: listMedia[3].url }} style={[styles.image, styles.fiveImagesSmall]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() =>viewDetailImage(4)}>
                                <Image source={{ uri: listMedia[4].url }} style={[styles.image, styles.fiveImagesSmall]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            default:
                return (
                    <View style={styles.fiveImagesContainer}>
                        <View style={styles.fiveImagesColumn}>
                            <TouchableOpacity onPress={() =>viewDetailImage(0)}>
                                <Image source={{ uri: listMedia[0].url }} style={[styles.image, styles.fiveImagesLarge]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() =>viewDetailImage(1)}>
                                <Image source={{ uri: listMedia[1].url }} style={[styles.image, styles.fiveImagesLarge]} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.fiveImagesColumn}>
                            <TouchableOpacity onPress={() =>viewDetailImage(2)}>
                                <Image source={{ uri: listMedia[2].url }} style={[styles.image, styles.fiveImagesSmall]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() =>viewDetailImage(3)}>
                                <Image source={{ uri: listMedia[3].url }} style={[styles.image, styles.fiveImagesSmall]} />
                            </TouchableOpacity>
                            <View>
                                <TouchableOpacity onPress={() =>viewDetailImage(4)}>
                                    <Image source={{ uri: listMedia[4].url }} style={[styles.image, styles.fiveImagesSmall]} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.image, styles.overlay, { position: 'absolute' }]} onPress={() =>viewDetailImage(4)}>
                                    <Text style={styles.overlayText}>
                                        +{listMedia.length - 5}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                );
        }
    };

    return <View style={styles.gridContainer}>{renderImages()}</View>;
};
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10
    },
    image: {        
        borderWidth : 1,
        borderColor : '#fff',
        borderRadius : 5,
        

    },
    singleImageContainer : {
        width : screenWidth,
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'
    },
    singleImage: {
        width: '100%',
        height: 300,
        
    },
    twoImagesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: screenWidth - 50,
    },
    twoImages: {
        width: '50%',
        height: 200,      
    },
    threeImagesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 300,
    },
    threeImagesLarge: {
        width: '50%',
        height: '100%',
        borderRadius: 5,
    },
    threeImagesColumn: {
        width: '50%',
        justifyContent: 'space-between',
    },
    threeImagesSmall: {
        width: '100%',
        height: '50%',
        
    },
    fourImagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%'
    },
    fourImages: {
        width: '50%',
        height: 150,
       
       
    },
    fiveImagesContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    fiveImagesColumn: {
        width: '50%',
        justifyContent: 'space-between'
    },
    fiveImagesLarge: {
        width: '100%',
        height: 150,
    },
    fiveImagesSmall: {
        width: '100%',
        height: 100,
        borderWidth : 1,
        borderColor : '#fff'
    },

    defaultImagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%'
    },
    defaultImages: {
        width: '30%',
        height: 100,
        marginBottom: '2%',
        
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    overlayText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        borderRadius : 5
    }
});

export default GridImageList;
