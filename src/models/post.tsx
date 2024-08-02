class PostModel {
    id: string;
    userID: string;
    privacy: string;
    uploadAt: Date;
    content: string;
    mediaList: any[];  

    constructor(
        id: string = "",
        userID: string = "",
        uploadAt: Date = new Date(),
        privacy: string = "",
        content: string = "",
        mediaList: any[] = []  
    ) {
        this.id = id;
        this.userID = userID;
        this.privacy = privacy;
        this.uploadAt = uploadAt;
        this.content = content;
        this.mediaList = mediaList;
    }
}

export default PostModel;
