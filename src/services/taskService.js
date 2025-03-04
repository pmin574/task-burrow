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

// 🔹 Delete a single task
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

// 🔹 Clear all tasks for a user
export const clearTasks = async (userId) => {
  if (!userId) return;

  try {
    const userTasksRef = collection(db, `users/${userId}/tasks`);
    const snapshot = await getDocs(userTasksRef);
    const batch = writeBatch(db);

    snapshot.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });

    await batch.commit();
  } catch (error) {
    console.error("Error clearing tasks: ", error);
  }
};

// 🔹 Add a new task
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

// 🔹 Fetch tasks
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
      completed: doc.data().completed ?? false,
      createdAt: doc.data().createdAt?.toDate(),
    }));
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    return [];
  }
};

// 🔹 Update task (New for Editing)
export const updateTask = async (userId, taskId, field, newValue) => {
  if (!userId || !taskId) return;

  try {
    const taskRef = doc(db, `users/${userId}/tasks`, taskId);
    await updateDoc(taskRef, { [field]: newValue });
  } catch (error) {
    console.error("Error updating task: ", error);
  }
};
