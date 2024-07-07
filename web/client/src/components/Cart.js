import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [show, setShow] = useState(false);
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setCart(res.data);
        } catch (err) {
            console.error('Error fetching cart', err);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/cart/${productId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setCart(cart.filter(item => item.product._id !== productId));
        } catch (err) {
            console.error('Error removing from cart', err);
        }
    };

    const getTotal = () => {
        return cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
    };

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const validateCardDetails = () => {
        const { number, expiry, cvv } = cardDetails;
        const numberRegex = /^[0-9]{16}$/;
        const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        const cvvRegex = /^[0-9]{3,4}$/;

        if (!numberRegex.test(number)) {
            alert('Invalid card number');
            return false;
        }
        if (!expiryRegex.test(expiry)) {
            alert('Invalid expiry date');
            return false;
        }
        if (!cvvRegex.test(cvv)) {
            alert('Invalid CVV');
            return false;
        }
        return true;
    };

    const handleCheckout = async () => {
        if (!validateCardDetails()) {
            return;
        }
        
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/orders`, { cart }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert("Payment successful!");
            setCart([]);
            handleClose();
        } catch (err) {
            console.error('Error during checkout', err);
        }
    };

    return (
        <Container className="mt-4">
            <h2>Cart</h2>
            <Row>
                {cart.map(item => (
                    <Col key={item.product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                        <Card className="product-card">
                            <Card.Img variant="top" src={item.product.image ? `http://localhost:5001${item.product.image}` : 'https://via.placeholder.com/150'} alt={item.product.name} />
                            <Card.Body>
                                <Card.Title>{item.product.name}</Card.Title>
                                <Card.Text>{item.product.description}</Card.Text>
                                <Card.Text>${item.product.price} x {item.quantity}</Card.Text>
                                <Button
                                    variant="danger"
                                    onClick={() => removeFromCart(item.product._id)}
                                    disabled={user && user.role === 'admin'}
                                >
                                    Remove from Cart
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row className="mt-4">
                <Col>
                    <h3>Total: €{getTotal()}</h3>
                    <Button variant="success" onClick={handleShow} disabled={cart.length === 0}>
                        Checkout
                    </Button>
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Checkout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formCardNumber">
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter card number"
                                value={cardDetails.number}
                                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardExpiry" className="mt-3">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="MM/YY"
                                value={cardDetails.expiry}
                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardCVV" className="mt-3">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="CVV"
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCheckout}>
                        Complete Purchase
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Cart;
