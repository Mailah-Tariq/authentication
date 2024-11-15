import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, deleteTodo, addTodo, updateTodo } from '../redux/todoSlice';
import TodoModal from './TodoModal';
import { Button, Container, Spinner } from 'react-bootstrap';
import { auth } from '../firebaseConfig';
import LogOut from './LogOut';

const TodoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.lists);
  const addStatus = useSelector((state) => state.todos.addStatus);
  const updateStatus = useSelector((state) => state.todos.updateStatus);
  const deleteStatus = useSelector((state) => state.todos.deleteStatus);

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
    setSelectedTodo(null); // Reset selectedTodo to clear the fields in TodoModal
  };

  const handleSaveTodo = (name, details, setErrors) => {
    const errors = {};
    if (!name.trim()) {
      errors.name = "Task Name is required.";
    }
    if (!details.trim()) {
      errors.details = "Task Details are required.";
    }
  
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
  
    if (selectedTodo) {
      dispatch(updateTodo({ id: selectedTodo.id, updatedTodo: { name, details } }));
    } else {
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
          <Button
            variant="success"
            onClick={() => openModal()}
            className="me-2"
            disabled={addStatus === 'loading'}
          >
            {addStatus === 'loading' ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              'Add New Task'
            )}
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
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openModal(todo)}
                      className="me-2"
                      disabled={updateStatus === 'loading'}
                    >
                      {updateStatus === 'loading' && selectedTodo?.id === todo.id ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        'Edit'
                      )}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => dispatch(deleteTodo(todo.id))}
                      disabled={deleteStatus[todo.id] === 'loading'}
                    >
                      {deleteStatus[todo.id] === 'loading' ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        'Delete'
                      )}
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
        onSave={handleSaveTodo}
      />
    </Container>
  );
};

export default TodoList;
