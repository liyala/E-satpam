import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import bgimg from "./imgfile/bg-gramed.jpg"
import Navvadmin from "./Navbar-Comp/NavbarAdmin"
import Navvuser from "./Navbar-Comp/NavbarUser"
import Landing from "./HeroSection"
import Footer from "./Footer"
import {
  Container, Row, Col, Card, CardHeader, CardBody, Table,
  Button, Spinner, Badge, Input
} from 'reactstrap';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [dashboardData, setDashboardData] = useState('');
  const [loading, setLoading] = useState(false);

  // 👉 state untuk tambah user baru
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  useEffect(() => {
    loadDashboardData();
    if (isAdmin()) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      let response;
      if (isAdmin()) {
        response = await authAPI.getAdminDashboard();     
      } else {
        response = await authAPI.getUserDashboard();
      }
      setDashboardData(response.data.message);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setDashboardData('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await authAPI.updateUserRole(userId, newRole);
      loadUsers(); // Refresh user list
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role');
    }
  };

  // 👉 Tambah user
  const handleAddUser = async () => {
    try {
      await authAPI.registerUser(newUser);
      setNewUser({ username: "", email: "", password: "", role: "user" });
      loadUsers();
      alert("User berhasil ditambahkan!");
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan user");
    }
  };

  // 👉 Hapus user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    try {
      await authAPI.deleteUser(id);
      loadUsers();
      alert("User berhasil dihapus!");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus user");
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner color="primary" />
        <p className="mt-2">Loading...</p>
      </Container>
    );
  }

  return (
    <div className="dashboard">
      {isAdmin() ?  <div> <Navvadmin/> <Landing bgImage={bgimg}/> </div>  : <div><Navvuser/> <Landing bgImage={bgimg}/> </div> }
      <Container className="mt-4 ">
        {/* Welcome Section */}
        <Row>
          <Col>
            <Card className="mb-4 shadow-sm">
              <CardHeader>
                <h4 className="mb-0">Dashboard</h4>
              </CardHeader>
              <CardBody>
                <h5>{dashboardData}</h5>
                <p>Selamat Datang <Button size='sm' color="success" disabled  >{user?.username}</Button></p>
                {/* <Button color="danger" size="md" onClick={logout}>
                  Logout
                </Button> */}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Admin Section */}
        {isAdmin() && (
          <Row>
            <Col>
              <Card className="mb-4 shadow-sm">
                <CardHeader>
                  <h5>User Management</h5>
                </CardHeader>
                <CardBody>
                  {/* Form Tambah User */}
                  <div className="mb-4">
                    <h6>Tambah User Baru</h6>
                    <Row className="mb-2">
                      <Col md="3">
                        <Input required={true}
                          style={{marginBottom:"10px"}}  
                          type="text"
                          placeholder="Username"
                          value={newUser.username}
                          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        />
                      </Col>
                      <Col md="3">
                        <Input required={true}
                          style={{marginBottom:"10px"}}
                          type="email"
                          placeholder="Email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                      </Col>
                      <Col md="2">
                        <Input
                          required
                          style={{marginBottom:"10px"}}
                          type="password"
                          placeholder="Password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                      </Col>
                      <Col md="2">
                        <Input 
                          style={{marginBottom:"10px"}}
                          type="select"
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </Input>
                      </Col>
                      <Col md="2">
                        <Button color="success" onClick={handleAddUser} required>
                          Add User
                        </Button>
                      </Col>
                    </Row>
                  </div>

                  {/* Tabel User */}
                  {users.length === 0 ? (
                    <p>No users found</p>
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((userItem) => (
                          <tr key={userItem.id}>
                            <td>{userItem.id}</td>
                            <td>{userItem.username}</td>
                            <td>{userItem.email}</td>
                            <td>
                              <Badge color={userItem.role === 'admin' ? 'primary' : 'secondary'}>
                                {userItem.role}
                              </Badge>
                            </td>
                            <td>
                              {userItem.id !== user.id ? (
                                <div className="d-flex gap-2">
                                  <Input
                                    type="select"
                                    value={userItem.role}
                                    onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                                    bsSize="sm"
                                  >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                  </Input>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => handleDeleteUser(userItem.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              ) : (
                                <Badge color="success">Current User</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {/* User Profile */}
        <Row>
          <Col>
            <Card className="shadow-sm ">
              <CardHeader>
                <h5>Your Profile</h5>
              </CardHeader>
              <CardBody>
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p>
                  <strong>Role:</strong>{' '}
                  <Badge size="" color={user?.role === 'admin' ? 'primary' : 'secondary'}>
                    {user?.role}
                  </Badge>
                </p>
                <p><strong>User ID:</strong> {user?.id}</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
        </Container >
<Footer/>
      
    </div>
  );
};

export default Dashboard;
