import React, { useState, useEffect } from 'react';
import { Table, Button, Card } from 'react-bootstrap';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
        // Exclude admin users
        setUsers(res.data.filter(user => user.role !== 'admin'));
    };

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.REACT_APP_API_URL}/users/${id}`);
        fetchUsers();
    };

    return (
        <div>
            <Card>
                <Card.Header>
                    <h4>User Management</h4>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleDelete(user._id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default UserManagement;
