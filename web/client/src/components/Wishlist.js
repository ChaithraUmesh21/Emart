import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import '../styles.css';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const { isAuthenticated, user } = useContext(AuthContext);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/wishlist`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setWishlist(res.data);
        } catch (err) {
            console.error('Error fetching wishlist', err);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/wishlist/${productId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setWishlist(wishlist.filter(item => item._id !== productId));
        } catch (err) {
            console.error('Error removing from wishlist', err);
        }
    };

    const moveToCart = async (productId) => {
        if (isAuthenticated) {
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/cart/${productId}`, { quantity: 1 });
                removeFromWishlist(productId);
                alert("Product moved to cart.");
            } catch (err) {
                console.error('Error moving to cart', err);
                alert("Error moving to cart.");
            }
        } else {
            alert("Please login to move to cart.");
        }
    };

    return (
        <Container className="mt-4">
            <h2>Wishlist</h2>
            <Row>
                {wishlist.map(product => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                        <Card className="product-card">
                            <Card.Img variant="top" src={product.image ? `http://localhost:5001${product.image}` : 'https://via.placeholder.com/150'} alt={product.name} />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>{product.description}</Card.Text>
                                <Card.Text>${product.price}</Card.Text>
                                <Button
                                    variant="danger"
                                    onClick={() => removeFromWishlist(product._id)}
                                    disabled={user && user.role === 'admin'}
                                >
                                    Remove from Wishlist
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => moveToCart(product._id)}
                                    disabled={user && user.role === 'admin'}
                                    className="ml-2"
                                >
                                    Move to Cart
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Wishlist;
