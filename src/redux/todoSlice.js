import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure this points to your Firebase config

const initialState = {
  lists: [],
  status: 'idle',
  addStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: {}, // Object to track delete operation per todo ID
  error: null,
};

// Async actions

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (userId) => {
  const q = query(collection(db, 'todos'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
});

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

// Redux slice
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lists = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTodo.pending, (state) => {
        state.addStatus = 'loading';
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.addStatus = 'succeeded';
        state.lists.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.addStatus = 'failed';
      })
      .addCase(updateTodo.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.lists.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) state.lists[index] = action.payload;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.updateStatus = 'failed';
      })
      .addCase(deleteTodo.pending, (state, action) => {
        state.deleteStatus[action.meta.arg] = 'loading'; // Track loading for specific todo ID
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        delete state.deleteStatus[action.payload];
        state.lists = state.lists.filter((todo) => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.deleteStatus[action.meta.arg] = 'failed';
      });
  },
});

export default todoSlice.reducer;
