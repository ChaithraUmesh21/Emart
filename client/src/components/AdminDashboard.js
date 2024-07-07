import React from 'react';
import { Container, Row, Col, Nav, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Route, Routes } from 'react-router-dom';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
    return (
        <Container fluid className="p-4">
            <Row>
                <Col md={3}>
                    <Card>
                        <Card.Header>
                            <Nav defaultActiveKey="/admin/products" className="flex-column">
                                <LinkContainer to="/admin/products">
                                    <Nav.Link>Manage Products</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/admin/users">
                                    <Nav.Link>Manage Users</Nav.Link>
                                </LinkContainer>
                            </Nav>
                        </Card.Header>
                    </Card>
                </Col>
                <Col md={9}>
                    <Card>
                        <Card.Header>
                            <h4>Admin Dashboard</h4>
                        </Card.Header>
                        <Card.Body>
                            <Routes>
                                <Route path="products" element={<ProductManagement />} />
                                <Route path="users" element={<UserManagement />} />
                            </Routes>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
