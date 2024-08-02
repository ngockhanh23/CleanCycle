class PostCommentLikes {
    userID: string;
    postID: string;

    constructor(userID: string = "", postID: string = "") {
        this.userID = userID;
        this.postID = postID;
    }
}

export default PostCommentLikes;
