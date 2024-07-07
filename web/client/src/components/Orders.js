import React, { useState, useEffect, useContext } from 'react';
import { Container, Table } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import '../styles.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/orders`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setOrders(res.data);
        } catch (err) {
            console.error('Error fetching orders', err);
        }
    };

    return (
        <Container className="mt-4">
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
                <p>You have no orders.</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Products</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{new Date(order.date).toLocaleDateString()}</td>
                                <td>€{order.total.toFixed(2)}</td>
                                <td>
                                    <ul>
                                        {order.products.map(item => (
                                            <li key={item.product._id}>
                                                {item.product.name} x {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default Orders;
