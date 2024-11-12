// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './Component/SingUp';
import Login from './Component/LogIn';
import TodoList from './Component/TodoList';
import PrivateRoute from './Component/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/todos" element={<PrivateRoute><TodoList/></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
