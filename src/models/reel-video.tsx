class ReelVideo {
    id: string;
    content : string;

    videoUrl: string;
    createdAt : Date;
    userID : string
  
    constructor(id: string,content : string, videoUrl: string, createdAt : Date, userID : string) {
      this.id = id;
      this.content = content;
      this.videoUrl = videoUrl;
      this.createdAt = createdAt;
      this.userID = userID;

    }
  }
  export default ReelVideo;