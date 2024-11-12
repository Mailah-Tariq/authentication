import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const initialState = {
  lists: [],
  status: 'idle',
  error: null,
};

// Fetch todos only for the current user
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (userId) => {
  const q = query(collection(db, 'todos'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const todos = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return todos;
});

// Add todo with the current user's ID
export const addTodo = createAsyncThunk('todos/addTodo', async (newTodo) => {
  const docRef = await addDoc(collection(db, 'todos'), newTodo);
  return { id: docRef.id, ...newTodo };
});

export const updateTodo = createAsyncThunk('todos/updateTodo', async ({ id, updatedTodo }) => {
  const docRef = doc(db, 'todos', id);
  await updateDoc(docRef, updatedTodo);
  return { id, ...updatedTodo };
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id) => {
  await deleteDoc(doc(db, 'todos', id));
  return id;
});

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.lists = action.payload;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.lists.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) state.lists[index] = action.payload;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.lists = state.lists.filter((todo) => todo.id !== action.payload);
      });
  },
});

export default todoSlice.reducer;
