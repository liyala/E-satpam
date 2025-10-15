import React, { useState } from 'react';
import {
  Container,Row,Col,Card,CardBody,Form,FormGroup,Label,Input,Button,Alert,Spinner
} from 'reactstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import NavvPublic from "./Navbar-Comp/NavbarPublic"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
   
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {login } = useAuth();
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
    setLoading(true);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
    <NavvPublic/>
      </div>
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      
      <Row className="w-100">
        <Col md={6} lg={5} className="mx-auto">
          <Card className="shadow-lg">
            <CardBody className="p-5">
              <div className="text-center mb-4">
                <h2 className="text-dark fw-bold">LOGIN</h2>
                <p className="text-muted">Welcome back! Please sign in to your account.</p>
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
                
                <FormGroup className="mb-4">
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

                <Button 
                  type="submit" 
                  color="success" 
                  disabled={loading}
                  className="w-100 py-2 fw-semibold"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </Form>

              {/* <div className="text-center mt-4">
                <p className="text-muted">
                  Don't have an account?{' '}
                  <Link 
                    to="/regis" 
                    className="text-primary text-decoration-none fw-semibold"
                  >
                    Register here
                  </Link>
                </p>
              </div> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
  
};

export default LoginPage;