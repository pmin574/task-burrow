import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export const addTask = async (userId, task) => {
  if (!userId) return;

  try {
    const userTasksRef = collection(db, `users/${userId}/tasks`);
    const docRef = await addDoc(userTasksRef, {
      ...task,
      dueDate: task.dueDate || null,
      priority: task.priority || "Normal",
      completed: task.completed ?? false, // Default to false
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
      dueDate: doc.data().dueDate || null,
      priority: doc.data().priority || "Normal",
      completed: doc.data().completed ?? false, // Default to false
      createdAt: doc.data().createdAt?.toDate(),
    }));
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    return [];
  }
};

export const toggleTaskCompletion = async (userId, taskId, completed) => {
  if (!userId || !taskId) return;

  try {
    const taskRef = doc(db, `users/${userId}/tasks`, taskId);
    await updateDoc(taskRef, { completed });
  } catch (error) {
    console.error("Error updating task completion: ", error);
  }
};
