class User {
    id: string;
    userName: string;
    email: string;
    photoUrl: string;
  
    constructor(
        id: string = "",
        userName: string = "",
        email: string = "",
        photoUrl: string = "default-photo-url"
    ) {
        this.id = id;
        this.userName = userName;
        this.email = email;
        this.photoUrl = photoUrl;
    }
}

export default User;
