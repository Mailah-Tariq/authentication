
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, deleteTodo, addTodo, updateTodo } from '../redux/todoSlice';
import TodoModal from './TodoModal';
import { Button, Container } from 'react-bootstrap';
import { auth } from '../firebaseConfig';
import LogOut from './LogOut';

const TodoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.lists);
  const [showModal, setShowModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      dispatch(fetchTodos(auth.currentUser.uid));
    }
  }, [dispatch]);

  const openModal = (todo = null) => {
    setSelectedTodo(todo);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTodo(null);
  };

  // Function to handle saving a new or updated todo
  const handleSaveTodo = (name, details) => {
    if (selectedTodo) {
      // Update the existing todo
      dispatch(updateTodo({ id: selectedTodo.id, updatedTodo: { name, details } }));
    } else {
      // Add a new todo
      dispatch(addTodo({ name, details, userId: auth.currentUser.uid }));
    }
    closeModal();
  };

  return (
    <Container className="my-5">
 <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="flex-grow-1 d-flex justify-content-center">
          <h1>Your To-Do List</h1>
        </div>
        <div className="d-flex">
          <Button variant="success" onClick={() => openModal()} className="me-2">
            Add New Task
          </Button>
          <LogOut />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th className="text-center">Task Name</th>
              <th className="text-center">Task Details</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td className="align-middle">{todo.name}</td>
                <td className="align-middle">{todo.details}</td>
                <td className="text-center align-middle">
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <Button variant="primary" size="sm" onClick={() => openModal(todo)} className="me-2">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => dispatch(deleteTodo(todo.id))}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TodoModal
        show={showModal}
        handleClose={closeModal}
        todo={selectedTodo}
        onSave={handleSaveTodo} // Pass the handleSaveTodo function as onSave
      />
    </Container>
  );
};

export default TodoList;
