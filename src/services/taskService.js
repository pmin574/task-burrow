import { db } from "../firebaseConfig";
import {
  deleteDoc,
  writeBatch,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export const deleteTask = async (userId, taskId) => {
  if (!userId || !taskId) return;

  try {
    const taskRef = doc(db, `users/${userId}/tasks`, taskId);
    await deleteDoc(taskRef);
    console.log(`Task ${taskId} deleted from Firestore`);
  } catch (error) {
    console.error("Error deleting task: ", error);
  }
};

export const addTask = async (userId, task) => {
  if (!userId) return;

  try {
    const userTasksRef = collection(db, `users/${userId}/tasks`);
    const docRef = await addDoc(userTasksRef, {
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
      priority: task.priority || "Normal",
      completed: task.completed ?? false,
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
      dueDate: doc.data().dueDate ? new Date(doc.data().dueDate) : null,
      priority: doc.data().priority || "Normal",
      completed: doc.data().completed ?? false,
      createdAt: doc.data().createdAt?.toDate(),
    }));
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    return [];
  }
};

export const updateTask = async (userId, taskId, updates) => {
  if (!userId || !taskId) return;

  try {
    const taskRef = doc(db, `users/${userId}/tasks`, taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log(`Task ${taskId} updated in Firestore`);
  } catch (error) {
    console.error("Error updating task: ", error);
  }
};
