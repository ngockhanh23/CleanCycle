import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import CircleAvatar from "../circle-avatar/circle-avatar";
import ReelComments from "../../models/reel-comment";
import { useEffect, useState } from "react";
import getUserInfo from "../../services/get-user-infor";

const CommentReelItem = ({ reelComment }: { reelComment: ReelComments }) => {
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {

        getUserInfo(reelComment.userID).then((userInfo) => {
            setUserInfo(userInfo);
        }).catch((error) => {
            console.error('Error getting other user info:', error);
        });

    }, []);
    return <View style={styles.commentItem} >
        <View style={{ marginRight: 10 }}>
            <CircleAvatar width={60} height={60} url={userInfo !== null ? userInfo.photoUrl : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'} />


        </View>
        <View>
            <Text>{userInfo !== null ? userInfo.name : ''}</Text>
            <Text style={{ fontSize: 16, marginVertical: 5 }}>{reelComment.content}</Text>
            <View style={{ flexDirection: 'row' }}>
                <Text>{reelComment.dateComment.toLocaleTimeString()}</Text>


                <View style={{ width: 50 }}></View>

                <TouchableWithoutFeedback>
                    <Text>Trả lời</Text>
                </TouchableWithoutFeedback>
            </View>

        </View>
    </View>
}

const styles = StyleSheet.create({
    commentItem: {
        width: '100%',
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        // borderBottomColor: '#ececec',
        // borderBottomWidth: 1,

    },

});
export default CommentReelItem;