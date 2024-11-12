
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const TodoModal = ({ show, handleClose, todo = null, onSave }) => {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    if (todo) {
      setName(todo.name);
      setDetails(todo.details);
    } else {
      setName('');
      setDetails('');
    }
  }, [todo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && details.trim()) {
      onSave(name.trim(), details.trim());
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{todo ? 'Edit Task' : 'Add New Task'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTodoName" className="mb-3">
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter task name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTodoDetails" className="mb-3">
            <Form.Label>Task Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter task details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">Cancel</Button>
            <Button type="submit" variant="primary">{todo ? 'Update' : 'Add'}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TodoModal;
