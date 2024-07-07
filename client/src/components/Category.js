import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import '../styles.css'; // Ensure this path is correct to include your custom CSS

const Category = () => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const { isAuthenticated, user } = useContext(AuthContext);

    useEffect(() => {
        fetchProductsByCategory();
    }, [categoryName]);

    const fetchProductsByCategory = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/products?category=${categoryName}`);
            setProducts(res.data);
        } catch (err) {
            console.error('Error fetching products by category', err);
        }
    };

    const addToWishlist = async (productId) => {
        if (isAuthenticated) {
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/wishlist/${productId}`);
                alert("Product added to wishlist.");
            } catch (err) {
                console.error('Error adding to wishlist', err);
                alert("Error adding to wishlist.");
            }
        } else {
            alert("Please login to add to wishlist.");
        }
    };

    const addToCart = async (productId) => {
        if (isAuthenticated) {
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/cart/${productId}`, { quantity: 1 });
                alert("Product added to cart.");
            } catch (err) {
                console.error('Error adding to cart', err);
                alert("Error adding to cart.");
            }
        } else {
            alert("Please login to add to cart.");
        }
    };

    return (
        <Container className="mt-4">
            <h2>{categoryName}</h2>
            <Row>
                {products.map(product => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                        <Card className="product-card">
                            <Card.Img variant="top" src={product.image ? `http://localhost:5001${product.image}` : 'https://via.placeholder.com/150'} alt={product.name} />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>{product.description}</Card.Text>
                                <Card.Text>${product.price}</Card.Text>
                                {product.stock > 0 ? (
                                    <>
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => addToWishlist(product._id)}
                                            disabled={user && user.role === 'admin'}
                                        >
                                            Add to Wishlist
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={() => addToCart(product._id)}
                                            disabled={user && user.role === 'admin'}
                                            className="ml-2"
                                        >
                                            Add to Cart
                                        </Button>
                                    </>
                                ) : (
                                    <div className="out-of-stock">Out of Stock</div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Category;
