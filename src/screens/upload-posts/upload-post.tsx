import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, Button, Image, View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { storageConfig } from '../../../firebase-config';
import { getDownloadURL, getMetadata, ref, uploadBytes } from 'firebase/storage';
import AuthServices from '../../services/auth-services';
import CircleAvatar from '../../components/circle-avatar/circle-avatar';
import ColorServices from '../../services/color-services';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';



const UploadPost = ({ navigation }: any) => {
    const userLogged = AuthServices.getInstance().GetUserLogged();
    const [privacy, setPrivacy] = useState('public');
    const [category, setCategory] = useState('Sống xanh');

    const [content, setContent] = useState('');
    const [mediaList, setMediaList] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);

    const [isModalPrivacyShow, setModalPrivacyShow] = useState(false);
    const [isModalCategoryShow, setModalCategoryShow] = useState(false);

    useEffect(() => {

    }, []);

    
    const handlePostUpload = async () => {
        setUploading(true);
    
        let lstMediaPost: any = [];
        if (mediaList.length > 0) {
            try {
                const uploadedUrls = await Promise.all(mediaList.map(async (media, index) => {
                    const currentTimestamp = Date.now();
                    const fileName = `${currentTimestamp}_${media.uri.substring(media.uri.lastIndexOf('/') + 1)}`;
                    const storageRef = ref(storageConfig, `${userLogged?.id}/post-media/${fileName}`);
                    const response = await fetch(media.uri);
                    const blob = await response.blob();
                    await uploadBytes(storageRef, blob);
    
                    const metadata = await getMetadata(storageRef);
                    const uploadedFileName = metadata.name;
    
                    const downloadUrl = await getDownloadURL(storageRef);
                    console.log(`Media ${index + 1} URL:`, downloadUrl);
                    console.log('Uploaded file name:', uploadedFileName);
    
                    let fileType = '';
                    if (metadata.contentType) {
                        if (metadata.contentType.startsWith('image')) {
                            fileType = 'image';
                        } else if (metadata.contentType.startsWith('video')) {
                            fileType = 'video';
                        } else {
                            fileType = 'unknown';
                        }
                    } else {
                        fileType = 'unknown';
                    }
    
                    lstMediaPost.push({
                        fileName: uploadedFileName,
                        url: downloadUrl,
                        type: fileType
                    });
                }));
    
                console.log('All uploaded URLs:', uploadedUrls);
            } catch (error) {
                console.error('Error uploading media:', error);
                // Xử lý lỗi tải lên nếu cần
            }
        }
    
        try {
            // Xử lý tải lên các media (đã có trong mã của bạn)
    
            // Xử lý tải lên media xong, chuẩn bị dữ liệu post
            let post = {
                userID: userLogged?.id,
                privacy: privacy,
                uploadAt: new Date(),
                content: content,
                media: lstMediaPost,
                category: category
            };
    
            const firestore = getFirestore();
            await addDoc(collection(firestore, 'Posts'), post);
    
            // Hiển thị Snackbar sau khi thêm bài viết thành công
            setTimeout(() => {
                Snackbar.show({
                    text: 'Đã tải lên bài viết của bạn',
                    duration: 3000,
                    backgroundColor: 'green',
                });
            }, 500); // Đợi 500ms trước khi hiển thị Snackbar
    
        } catch (error) {
            console.error('Error adding post:', error);
            // Xử lý lỗi nếu cần
        } finally {
            setUploading(false);
            setContent('');
            setMediaList([]);
            navigation.goBack();
            // Sau khi upload, reset nội dung và danh sách media
        }
    };
    





    const handleChooseMedia = () => {
        if (mediaList.length >= 10) {
            Alert.alert('Giới hạn tối đa', 'Bạn chỉ có thể chọn tối đa 10 ảnh/video.');
            return;
        }

        launchImageLibrary({ mediaType: 'mixed', selectionLimit: 10 - mediaList.length }, (response: any) => {
            if (response.didCancel) {
                console.log('User cancelled media picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const assets = response.assets.map((asset: any) => ({
                    uri: asset.uri,
                    type: asset.type
                }));
                setMediaList([...mediaList, ...assets]);
            }
        });
    };

    const handleRemoveMedia = (index: number) => {
        setMediaList(mediaList.filter((_, i) => i !== index));
    };

    const openPrivacyChanges = () => {
        setModalPrivacyShow(true);
    }

    const closePrivacyChanges = () => {
        setModalPrivacyShow(false);
    }

    const changePrivacy = (privacy: string) => {
        setPrivacy(privacy);
        setModalPrivacyShow(false);
    }

    const openCategoryChanges = () => {
        setModalCategoryShow(true);
    }

    const closeCategoryChanges = () => {
        setModalCategoryShow(false);
    }

    const changeCategory = (category: string) => {
        setCategory(category);
        setModalCategoryShow(false);
    }

    const getCategoryName = (category: string) => {
        switch (category) {
            case 'green-action':
                return 'Hành động xanh';
            case 'green-lifestyle':
                return 'Lối sống xanh';
            case 'garbage-classification':
                return 'Phân loại rác';
            case 'donate-old-items':
                return 'Tặng đồ cũ';
            case 'beautiful-nature':
                return 'Thiên nhiên tươi đẹp';
            default:
                return 'Chọn danh mục';
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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

            <View style={styles.topContent}>
                <CircleAvatar width={80} height={80} url={userLogged!.photoUrl} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.label}>{userLogged?.userName}</Text>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <TouchableOpacity onPress={openPrivacyChanges} style={styles.dropdownOption}>
                            {privacy === 'public'
                                ? <Image style={styles.iconDrowdownLabel} source={require('../../../assets/icons/ic_public.png')} />
                                : <Image style={styles.iconDrowdownLabel} source={require('../../../assets/icons/ic_private.png')} />
                            }
                            <Text style={styles.textDropdownStyle}>{privacy === 'public' ? 'Công khai' : 'Riêng tư'}</Text>
                            <Image style={styles.icDropdown} source={require('../../../assets/icons/ic_dropdown.png')} />
                        </TouchableOpacity>

                        <View style={{ width: 5 }}></View>

                        <TouchableOpacity onPress={openCategoryChanges} style={styles.dropdownOption}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textDropdownStyle}>{getCategoryName(category)}</Text>
                            <Image style={styles.icDropdown} source={require('../../../assets/icons/ic_dropdown.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Hành động hôm nay của bạn là gì ?"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
            />
            <View style={styles.mediaContainer}>
                {mediaList.map((media, index) => (
                    <View key={index} style={styles.mediaItem}>
                        {media.type.startsWith('video') ? (
                            <Video source={{ uri: media.uri }} style={styles.media} resizeMode='contain' muted={true} />
                        ) : (
                            <Image source={{ uri: media.uri }} style={styles.media} />
                        )}
                        <TouchableOpacity
                            style={styles.removeIcon}
                            onPress={() => handleRemoveMedia(index)}
                        >
                            <Image source={require('../../../assets/icons/ic_close.png')} style={styles.closeIcon} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <TouchableOpacity onPress={handleChooseMedia} style={styles.actionButton}>
                <Image source={require('../../../assets/icons/ic_image.png')} style={styles.actionImage} />
                <Text style={styles.actionText}>Ảnh/Video</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePostUpload} style={styles.uploadButton}><Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: ColorServices.primaryColor }}>Chia sẽ bài đăng của bạn</Text></TouchableOpacity>



            <Modal
                isVisible={isModalPrivacyShow}
                onBackdropPress={closePrivacyChanges}
                style={styles.bottomModal}
                swipeDirection='down'
            >
                <View style={styles.modalContent}>
                    <View style={{ padding: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Đối tượng xem bài viết</Text>

                    </View>
                    <View style={{ width: '100%', borderTopWidth: 1, borderTopColor: '#ebefee', padding: 5 }}></View>

                    <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
                        <Text style={{ fontSize: 18 }}>Ai có thể xem bài viết của bạn ?</Text>

                        <TouchableOpacity style={styles.modalContentOptionItem} onPress={() => changePrivacy('public')}>
                            <View style={{ width: 15, height: 15, borderColor: privacy === 'public' ? 'green' : 'grey', backgroundColor: privacy === 'public' ? 'green' : 'transparent', borderWidth: 1, borderRadius: 100, marginRight: 10 }}></View>
                            <Image style={styles.modalContentOptionItemIcon} source={require('../../../assets/icons/ic_public_grey.png')} />
                            <Text style={styles.modalContentOptionItemText}>Công khai</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalContentOptionItem} onPress={() => changePrivacy('private')}>
                            <View style={{ width: 15, height: 15, borderColor: privacy === 'private' ? 'green' : 'grey', backgroundColor: privacy === 'private' ? 'green' : 'transparent', borderWidth: 1, borderRadius: 100, marginRight: 10 }}></View>
                            <Image style={styles.modalContentOptionItemIcon} source={require('../../../assets/icons/ic_private_grey.png')} />
                            <Text style={styles.modalContentOptionItemText}>Riêng tư</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                isVisible={isModalCategoryShow}
                onBackdropPress={closeCategoryChanges}
                style={styles.bottomModal}
                swipeDirection='down'
            >
                <View style={styles.modalContent}>
                    <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 50, height: 50, resizeMode: 'contain' }} source={require('../../../assets/icons/ic_song_xanh.png')} />
                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'green', marginLeft: 10 }}>Sống xanh</Text>
                        </View>
                        <View style={{ width: '100%', borderTopWidth: 1, borderTopColor: '#ebefee', marginVertical: 10 }}></View>

                        <TouchableOpacity style={styles.modalContentOptionItem} onPress={() => changeCategory('green-action')}>
                            <View style={{ width: 15, height: 15, borderColor: category === 'green-action' ? 'green' : 'grey', backgroundColor: category === 'green-action' ? 'green' : 'transparent', borderWidth: 1, borderRadius: 100, marginRight: 10 }}></View>
                            <Text style={styles.modalContentOptionItemText}>Hành động xanh</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalContentOptionItem} onPress={() => changeCategory('green-lifestyle')}>
                            <View style={{ width: 15, height: 15, borderColor: category === 'green-lifestyle' ? 'green' : 'grey', backgroundColor: category === 'green-lifestyle' ? 'green' : 'transparent', borderWidth: 1, borderRadius: 100, marginRight: 10 }}></View>
                            <Text style={styles.modalContentOptionItemText}>Lối sống xanh</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalContentOptionItem} onPress={() => changeCategory('garbage-classification')}>
                            <View style={{ width: 15, height: 15, borderColor: category === 'garbage-classification' ? 'green' : 'grey', backgroundColor: category === 'garbage-classification' ? 'green' : 'transparent', borderWidth: 1, borderRadius: 100, marginRight: 10 }}></View>
                            <Text style={styles.modalContentOptionItemText}>Phân loại rác</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalContentOptionItem} onPress={() => changeCategory('donate-old-items')}>
                            <View style={{ width: 15, height: 15, borderColor: category === 'donate-old-items' ? 'green' : 'grey', backgroundColor: category === 'donate-old-items' ? 'green' : 'transparent', borderWidth: 1, borderRadius: 100, marginRight: 10 }}></View>
                            <Text style={styles.modalContentOptionItemText}>Tặng đồ cũ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalContentOptionItem} onPress={() => changeCategory('beautiful-nature')}>
                            <View style={{ width: 15, height: 15, borderColor: category === 'beautiful-nature' ? 'green' : 'grey', backgroundColor: category === 'beautiful-nature' ? 'green' : 'transparent', borderWidth: 1, borderRadius: 100, marginRight: 10 }}></View>
                            <Text style={styles.modalContentOptionItemText}>Thiên nhiên tươi đẹp</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        height: '100%'
    },
    topContent: {
        flexDirection: 'row',
        marginBottom: 20
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        // borderWidth: 1,
        // borderColor: '#ccc',
        // borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    mediaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
    },
    mediaItem: {
        position: 'relative',
        margin: 5,
    },
    media: {
        width: 100,
        height: 100,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#ebefee'
    },
    removeIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },

    actionText: {
        fontSize: 20,
        marginLeft: 10
    },
    closeIcon: {
        width: 24,
        height: 24,
    },
    dropdownOption: {
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
        padding: 10,
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    textDropdownStyle: {
        color: ColorServices.primaryColor,
        fontWeight: 'bold',
        marginHorizontal: 5,
        maxWidth: 120
    },
    iconDrowdownLabel: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
    },
    icDropdown: {
        width: 10,
        height: 10,
        resizeMode: 'contain'
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        // padding: 22,
        position: 'relative',
        borderTopLeftRadius: 17,
        borderTopRightRadius: 17,
    },
    modalContentOptionItem: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    modalContentOptionItemText: {
        fontSize: 20,
        marginLeft: 10
    },
    modalContentOptionItemIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    uploadButton: {
        backgroundColor: ColorServices.primaryBackgroundColor,
        padding: 10,
        marginVertical: 20,
        borderRadius: 50,
        // Đổ bóng cho Android
        elevation: 5,
        // Đổ bóng cho iOS
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
   
    modalOption: {
        padding: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    textModalStyle: {
        fontSize: 18,
        marginLeft: 10,
        color: 'black',
        fontWeight: 'bold'
    },
    
    progressModal: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
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
        fontWeight: 'bold',
        color: 'black',
    },
});

export default UploadPost;
