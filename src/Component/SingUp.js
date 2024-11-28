import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { Form, Button, Container, Card, Spinner } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true); // Show loader
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: `${firstName} ${lastName}` });

      // Store user information in Firestore
      await setDoc(doc(db, 'authentication', userCredential.user.uid), {
        firstName,
        lastName,
        email,
      });

      setLoading(false); // Hide loader
      toast.success('Signup successful! Redirecting...');
      navigate('/todos');
    } catch (err) {
      setLoading(false); // Hide loader
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center mb-4">Create an Account</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFirstName" className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formLastName" className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formConfirmPassword" className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          {error && <p className="text-danger text-center">{error}</p>}
          <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Sign Up'}
          </Button>
        </Form>
        <div className="text-center mt-3">
          <small className="text-muted">Already have an account?</small>
          <Button variant="link" onClick={() => navigate('/login')}>
            Login here
          </Button>
        </div>
      </Card>
      <ToastContainer position="top-center" />
    </Container>
  );
};

export default Signup;
