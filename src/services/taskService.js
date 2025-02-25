import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, serverTimestamp, query, where } from "firebase/firestore";

export const addTask = async (userId, task) => {
  if (!userId) return; // Ensure a user is logged in

  try {
    const userTasksRef = collection(db, `users/${userId}/tasks`);
    const docRef = await addDoc(userTasksRef, {
      ...task,
      createdAt: serverTimestamp(),
    });

    return { id: docRef.id, ...task, createdAt: new Date() };
  } catch (error) {
    console.error("Error adding task: ", error);
  }
};

export const getTasks = async (userId) => {
  if (!userId) return [];

  try {
    const userTasksRef = collection(db, `users/${userId}/tasks`);
    const snapshot = await getDocs(userTasksRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    }));
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    return [];
  }
};
