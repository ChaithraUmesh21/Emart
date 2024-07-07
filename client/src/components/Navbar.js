import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import '../styles/Navbar.css';

const categories = ['Smartphones', 'Laptops', 'Tablets', 'Accessories'];

const Navbar = () => {
    const authContext = useContext(AuthContext);
    const { isAuthenticated, logout, user, clearErrors, loadUser } = authContext;
    const navigate = useNavigate();

    useEffect(() => {
        loadUser();
        // eslint-disable-next-line
    }, []);

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    const authLinks = (
        <>
            {user && user.role !== 'admin' && (
                <>
                    <Nav.Link as={Link} to="/wishlist">Wishlist</Nav.Link>
                    <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
                    <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
                </>
            )}
            {user && user.role === 'admin' && (
                <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
            )}
        </>
    );

    const guestLinks = (
        <>
            <Nav.Link as={Link} to="/register" onClick={clearErrors}>Register</Nav.Link>
            <Nav.Link as={Link} to="/login" onClick={clearErrors}>Login</Nav.Link>
        </>
    );

    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
            <Container fluid>
                <BootstrapNavbar.Brand as={Link} to="/" className="ms-3">ElectroMart</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user && user.role !== 'admin' && (
                            <NavDropdown title="Categories" id="basic-nav-dropdown">
                                {categories.map(category => (
                                    <NavDropdown.Item as={Link} to={`/category/${category}`} key={category}>
                                        {category}
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>
                        )}
                        {isAuthenticated ? authLinks : guestLinks}
                    </Nav>
                    {isAuthenticated && (
                        <Nav className="ms-auto">
                            <Nav.Link onClick={onLogout} href="#!">
                                <i className="fas fa-sign-out-alt" /> Logout
                            </Nav.Link>
                        </Nav>
                    )}
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;
