class PostComments {
    id: string;
    userID: string;
    postID: string;
    content: string;
    dateComment: Date;

    constructor(
        id: string = "",
        userID: string = "",
        postID: string = "",
        content: string = "",
        dateComment: Date = new Date()
    ) {
        this.id = id;
        this.userID = userID;
        this.postID = postID;
        this.content = content;
        this.dateComment = dateComment;
    }
}

export default PostComments;
