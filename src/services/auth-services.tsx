import { getAuth, signOut } from "@firebase/auth";
import firebaseConfigApp from "../../firebase-config";
import User from "../models/user";
import SharedPreferences from "react-native-shared-preferences";


class AuthServices {
    private static instance: AuthServices | null = null;
    private userLogged: User | null = null;

    private constructor() {
        // Private constructor to prevent instantiation outside of the class
    }

    public static getInstance(): AuthServices {
        if (!AuthServices.instance) {
            AuthServices.instance = new AuthServices();
        }
        return AuthServices.instance;
    }

    SetUserLogged(user: User | null) {
        this.userLogged = user;
    }

    GetUserLogged() {
        return this.userLogged;
    }

    async Logout() {
        const auth = getAuth(firebaseConfigApp);
        await signOut(auth);
        SharedPreferences.clear()
        this.SetUserLogged(null);
        console.log('user login : ' + this.userLogged)     
    }
}

export default AuthServices;
