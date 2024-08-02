import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import Video from "react-native-video";
import ColorServices from "../../services/color-services";
import Modal from "react-native-modal";
import Snackbar from "react-native-snackbar";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import AuthServices from "../../services/auth-services";

const UploadReel = ({ route, navigation }: any) => {
    const { videoUri } = route.params;
    const [contentReel, setContentReel] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const userLogged = AuthServices.getInstance().GetUserLogged();

    useEffect(() => {
        navigation.setParams({ handleSubmit });
    }, [contentReel]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={handleSubmit} title="Đăng" color={ColorServices.primaryColor} />
            ),
        });
    }, [navigation, contentReel]);

    const handleSubmit = async () => {
        console.log('content : ' + contentReel);
    
        try {
            setUploading(true); // Show upload modal
    
            const storage = getStorage();
            const storageRef = ref(storage, `${userLogged?.id}/reels/${Date.now()}`);
            const response = await fetch(videoUri);
            const blob = await response.blob();
            await uploadBytes(storageRef, blob);
    
            const downloadURL = await getDownloadURL(storageRef);
    
            const db = getFirestore();
            await addDoc(collection(db, 'Reels'), {
                userID: userLogged?.id,
                videoUrl: downloadURL,
                content: contentReel,
                createdAt: new Date(),
            });
    
            setUploadSuccess(true); 
            setUploading(false); // Hide upload modal
    
            
    
            // Automatically hide Snackbar after some time
            setTimeout(() => {
                Snackbar.show({
                    text: 'Đã tải lên nội dung của bạn',
                    duration: 3000,
                    backgroundColor: 'green',
                });
            }, 500); // Adjust the timeout as needed
    
    
        } catch (error) {
            console.error("Error uploading video:", error);
            Alert.alert('Error', 'Failed to upload video. Please try again.');
            setUploading(false); // Hide upload modal
        } finally {
            navigation.goBack();

        }
    };
    

    if (!videoUri) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No video selected. Please go back and try again.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.videoContainer}>
                <Video
                    source={{ uri: videoUri }}
                    resizeMode="cover"
                    style={styles.video}
                    controls={false}
                    repeat={true}
                    paused={false}
                />
            </View>

            {/* <Text style={styles.displayText}>{contentReel}</Text> */}

            <TextInput
                style={styles.textarea}
                placeholder="Nội dung video của bạn"
                value={contentReel}
                onChangeText={(text) => setContentReel(text)}
            />

            {/* Modal for uploading progress */}
            <Modal
                isVisible={uploading}
                backdropOpacity={0.5}
                animationIn="fadeIn"
                animationOut="fadeOut"
                style={styles.progressModal}
                propagateSwipe={true}
                coverScreen={true}
                swipeDirection={['down']}
                onBackButtonPress={() => null}
                onSwipeComplete={() => null}
                onBackdropPress={() => null}
                onDismiss={() => null}
            >
                <View style={styles.progressModalContent}>
                    <ActivityIndicator size="large" color={ColorServices.primaryColor} />
                    <Text style={styles.progressModalText}>Đang tải lên...</Text>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
    },
    videoContainer: {
        width: Dimensions.get("window").width / 2,
        height: Dimensions.get("window").height / 2 - 20,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 20, // Add margin to separate video and TextInput
    },
    video: {
        width: "100%",
        height: "100%",
        borderRadius: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "black",
        fontSize: 18,
    },
    textarea: {
        width: "90%",
        height: 150,
        borderColor: "#fff",
        borderRadius : 10,
        padding: 20,
        fontSize: 16,
        textAlignVertical: "top",
        backgroundColor: "#ececec",
    },
    displayText: {
        fontSize: 18,
        color: "black",
        marginBottom: 10,
        alignSelf: "flex-start",
        paddingHorizontal: 10,
    },
    progressModal: {
        margin: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    progressModalContent: {
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
    },
    progressModalText: {
        marginTop: 10,
        fontSize: 18,
        color: '#333',
    },
});

export default UploadReel;
