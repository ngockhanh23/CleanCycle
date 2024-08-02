import { getFirestore, doc, getDoc } from 'firebase/firestore';

const getUserInfo = async (userID:string) => {
    const firestore = getFirestore();
    const userRef = doc(firestore, 'Users', userID);

    try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
};

export default getUserInfo;
