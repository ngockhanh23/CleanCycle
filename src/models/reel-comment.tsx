class ReelComments {
    id: string;
    userID: string;
    reelVideoID: string;
    content: string;
    dateComment: Date;

    constructor(
        id: string = "",
        userID: string = "",
        reelVideoID: string = "",
        content: string = "",
        dateComment: Date = new Date()
    ) {
        this.id = id;
        this.userID = userID;
        this.reelVideoID = reelVideoID;
        this.content = content;
        this.dateComment = dateComment;
    }
}

export default ReelComments;
