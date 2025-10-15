import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Spinner
} from 'reactstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow">
            <CardBody className="p-5">
              <div className="text-center mb-4">
                <h2 className="text-primary fw-bold">Create Account</h2>
                <p className="text-muted">Sign up to get started with our service</p>
              </div>
              
              {error && (
                <Alert color="danger" className="text-center">
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <FormGroup className="mb-3">
                  <Label for="username" className="form-label fw-semibold">
                    Username
                  </Label>
                  <Input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="py-2"
                  />
                </FormGroup>

                <FormGroup className="mb-3">
                  <Label for="email" className="form-label fw-semibold">
                    Email
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="py-2"
                  />
                </FormGroup>
                
                <FormGroup className="mb-3">
                  <Label for="password" className="form-label fw-semibold">
                    Password
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="py-2"
                  />
                </FormGroup>

                <FormGroup className="mb-4">
                  <Label for="confirmPassword" className="form-label fw-semibold">
                    Confirm Password
                  </Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="py-2"
                  />
                </FormGroup>

                <Button 
                  type="submit" 
                  color="primary" 
                  disabled={loading}
                  className="w-100 py-2 fw-semibold"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-primary text-decoration-none fw-semibold"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;