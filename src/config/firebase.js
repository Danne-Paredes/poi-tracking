// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore,collection, doc, setDoc, getDocs  } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXHzDt-lisbhOOoNNSpOhGiZUlaNtIfLI",
  authDomain: "poi-tracking.firebaseapp.com",
  projectId: "poi-tracking",
  storageBucket: "poi-tracking.appspot.com",
  messagingSenderId: "343146005146",
  appId: "1:343146005146:web:1daeb5093c47f8c0c39523"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  'hd': 'knighted.com',
  'prompt': 'select_account'
});

export const updateCollection = async (collectionName, data) => {
  const collectionRef = collection(db, collectionName);
  const docRef = doc(collectionRef);

  try {
    await setDoc(docRef, data);
    console.log('Collection updated successfully!');
  } catch (error) {
    console.error('Error updating collection:', error);
  }
};

export const updateRoster = async (collectionName, documentId, data) => {
  const docRef = doc(db, collectionName, documentId);

  try {
    await setDoc(docRef, data);
    console.log('Document updated successfully!');
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

export const getDataVals = async () => {
  const collectionRef = collection(db, 'data_vals');
  const querySnapshot = await getDocs(collectionRef);
  const documents = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return documents[0];
};

export const getPoiData = async () => {
  const collectionRef = collection(db, 'poi');
  const querySnapshot = await getDocs(collectionRef);
  const documents = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return documents;
};





// Initialize Database
export const db = getFirestore(app)