import { initializeApp } from "firebase/app";
import {getAuth, connectAuthEmulator} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// export declare function connectFirestoreEmulator(firestore: Firestore, host: string, port: number, options?: {
//   mockUserToken?: EmulatorMockTokenOptions | string;
// }): void;

//Enter the apikey and info provided by firebase below
const firebaseConfig = {
    apiKey: "AIzaSyAJkexboo4I4jhNRkpZvp0PmI-n7sx9BGM",
    authDomain: "podcast-university.firebaseapp.com",
    projectId: "podcast-university",
    storageBucket: "podcast-university.appspot.com",
    messagingSenderId: "590942439308",
    appId: "1:590942439308:web:e61d1158ff6cc4a70e78a9",
    measurementId: "G-RJJEFNDP1C"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// connectFirestoreEmulator(db, 'localhost', 8080);
const auth = getAuth(app);
// connectAuthEmulator(auth, "http://localhost:9099");
// Export firestore database
// It will be imported into your react app whenever it is needed

export { db, auth };