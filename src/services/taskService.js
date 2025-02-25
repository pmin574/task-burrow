import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

const tasksCollection = collection(db, "tasks"); // Firestore collection reference

// Function to add a task
export const addTask = async (task) => {
  try {
    const docRef = await addDoc(tasksCollection, {
      ...task,
      createdAt: serverTimestamp(), // Firestore's automatic timestamp
    });
    return { id: docRef.id, ...task, createdAt: new Date() }; // Return object with local timestamp
  } catch (error) {
    console.error("Error adding task: ", error);
  }
};

// Function to fetch all tasks
export const getTasks = async () => {
  try {
    const snapshot = await getDocs(tasksCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(), // Convert Firestore timestamp to JS Date
    }));
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    return [];
  }
};
