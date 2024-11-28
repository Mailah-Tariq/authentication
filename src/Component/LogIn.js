import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Spinner } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Show loader

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false); // Hide loader
      toast.success('Login successful!');
      navigate('/todos');
    } catch (err) {
      setLoading(false); // Hide loader
      if (err.code === 'auth/user-not-found') {
        setError("You don't have an account. Please sign up.");
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
      toast.error(error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center mb-4">Welcome Back!</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          {error && <p className="text-danger text-center">{error}</p>}
          <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
          </Button>
        </Form>
        <div className="text-center mt-3">
          <small className="text-muted">Don't have an account?</small>
          <Button variant="link" onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </div>
      </Card>
      <ToastContainer position="top-center" />
    </Container>
  );
};

export default Login;
