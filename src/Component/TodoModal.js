import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const TodoModal = ({ show, handleClose, todo, onSave }) => {
  const [name, setName] = useState(todo?.name || "");
  const [details, setDetails] = useState(todo?.details || "");
  const [errors, setErrors] = useState({}); // State to store errors

  const handleSave = () => {
    onSave(name, details, setErrors); // Pass setErrors to handleSaveTodo
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{todo ? "Edit Task" : "Add New Task"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="taskName" className="mb-3">
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isInvalid={!!errors.name} // Highlight the field if there's an error
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="taskDetails" className="mb-3">
            <Form.Label>Task Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              isInvalid={!!errors.details} // Highlight the field if there's an error
            />
            <Form.Control.Feedback type="invalid">
              {errors.details}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TodoModal;
