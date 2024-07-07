import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Register = () => {
    const authContext = useContext(AuthContext);
    const { register, isAuthenticated, error, clearErrors } = authContext;

    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
    });

    const [showError, setShowError] = useState(false);

    const navigate = useNavigate();

    const { username, email, password, phone } = user;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); // Redirect to home page if authenticated
        }

        if (error) {
            setShowError(true);
        } else {
            setShowError(false);
        }
    }, [isAuthenticated, navigate, error]);

    const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        register({
            username,
            email,
            password,
            phone,
        });
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <Form onSubmit={onSubmit}>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        name="username"
                        value={username}
                        onChange={onChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter phone number"
                        name="phone"
                        value={phone}
                        onChange={onChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Register
                </Button>

                {showError && <Alert variant="danger" className="error-message mt-3">{error}</Alert>}
            </Form>
        </div>
    );
};

export default Register;
