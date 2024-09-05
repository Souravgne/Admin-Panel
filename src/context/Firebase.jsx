import { createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc ,  addDoc ,setDoc, doc , getDoc , updateDoc } from 'firebase/firestore';
import { getDatabase, set, ref } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAgGDd-BGv_Fz7vsqQlPRj5Zndgje99fho",
    authDomain: "mydream-5eff9.firebaseapp.com",
    databaseURL: "https://mydream-5eff9-default-rtdb.firebaseio.com",
    projectId: "mydream-5eff9",
    storageBucket: "mydream-5eff9.appspot.com",
    messagingSenderId: "383943894099",
    appId: "1:383943894099:web:1a2081fe991539c99392a6",
    measurementId: "G-46HYLPDMK4",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const database = getDatabase(firebaseApp);

export const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
    const signupUserWithEmailAndPassword = async (email, password) => {
        try {
            return await createUserWithEmailAndPassword(firebaseAuth, email, password);
        } catch (error) {
            console.error('Error signing up!', error);
        }
    };

    const getAndIncrementContestNumber = async () => {
        const contestNumberRef = doc(firestore, 'home', 'contestNumber');
        
        try {
            const contestNumberDoc = await getDoc(contestNumberRef);
    
            if (contestNumberDoc.exists()) {
                const currentCount = contestNumberDoc.data().count || 0;
                const newCount = currentCount + 1;
    
                // Update the count in Firestore
                await updateDoc(contestNumberRef, { count: newCount });
    
                return newCount;
            } else {
                // If document does not exist, initialize it
                await setDoc(contestNumberRef, { count: 1 });
                return 1;
            }
        } catch (error) {
            console.error("Error incrementing contest number:", error);
            throw error;
        }
    };
    const loginUserWithEmailAndPassword = async (email, password) => {
        try {
            return await signInWithEmailAndPassword(firebaseAuth, email, password);
        } catch (error) {
            console.error('Error signing in!', error);
        }
    };

    const putData = (key, data) => set(ref(database, key), data);

    const getDocument = async (collectionPath) => {
        try {
            const collectionSnapshot = await getDocs(collection(firestore, collectionPath));
            return collectionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error(`Error getting documents from ${collectionPath}: `, error);
            return [];
        }
    };

    const getDocumentbyId = async( path ,id)=>{
        try {
            const docRef = doc(firestore, path, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists()? docSnap.data() : null;
        } catch (error) {
            console.error(`Error getting document: ${error}`);
            return null;
        }  

    }

    const writeNewContest = async (path, data, id) => {
        try {
            const docRef = doc(firestore, path, id.toString()); // Ensure id is a string
            await setDoc(docRef, data);
            console.log("Document written with ID: ", id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };
    
    
    // update document 
    const updateDocument = async (path, id, data) => {
        try {
            const docRef = doc(firestore, path, id);
            await updateDoc(docRef, data);
            console.log("Document successfully updated!");
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };
    // Function to append new questions to an existing document
const appendQuestionsToContest = async (collection, docId, newQuestions) => {
    try {
      const docRef = doc(firestore, collection, docId);
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists()) {
        const existingQuestions = docSnapshot.data().questions || [];
  
        // Merge new questions with existing questions
        const updatedQuestions = [...existingQuestions, ...newQuestions];
  
        // Update the document with the new questions array
        await updateDoc(docRef, {
          questions: updatedQuestions,
        });
  
        console.log("Questions successfully appended!");
      } else {
        console.log("No existing document, creating a new one.");
        await setDoc(docRef, { questions: newQuestions });
      }
    } catch (error) {
      console.error("Error appending questions: ", error);
      throw error;
    }
  };
  
   

    const signOutUser = async () => {
        try {
            await signOut(firebaseAuth);
        } catch (error) {
            console.error('Error signing out!', error);
        }
    };

    const deleteDocument = async (path, id) => {
        try {
          const docRef = doc(firestore, path, id);
          await deleteDoc(docRef);
          console.log("Document successfully deleted!");
        } catch (error) {
          console.error("Error deleting document: ", error);
        }
      };
      
    return (
        <FirebaseContext.Provider value={{
            signupUserWithEmailAndPassword,
            loginUserWithEmailAndPassword,
            putData,
            getDocument,
            signOutUser, 
            writeNewContest, 
            getDocumentbyId, 
            updateDocument,
            deleteDocument , // Add this line
            getAndIncrementContestNumber, 
            appendQuestionsToContest 
        }}>
            {props.children}
        </FirebaseContext.Provider>
        
    );
};
