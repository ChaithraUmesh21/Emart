import React, { useState, useEffect, useContext } from 'react';
import { Carousel, Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import '../styles.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const { isAuthenticated, user } = useContext(AuthContext);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
            setProducts(res.data);
        } catch (err) {
            console.error('Error fetching products', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/categories`);
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories', err);
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

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        filterProducts(e.target.value, minPrice, maxPrice);
    };

    const handlePriceChange = () => {
        filterProducts(selectedCategory, minPrice, maxPrice);
    };

    const filterProducts = async (category, minPrice, maxPrice) => {
        try {
            let query = `${process.env.REACT_APP_API_URL}/products?`;
            if (category) query += `category=${category}&`;
            if (minPrice) query += `minPrice=${minPrice}&`;
            if (maxPrice) query += `maxPrice=${maxPrice}`;
            const res = await axios.get(query);
            setProducts(res.data);
        } catch (err) {
            console.error('Error filtering products', err);
        }
    };

    return (
        <div>
            <Carousel fade indicators={false} controls={false} className="carousel">
                <Carousel.Item>
                    <img className="d-block w-100" src="/assets/banner/1.png" alt="First slide" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src="/assets/banner/2.png" alt="Second slide" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src="/assets/banner/3.png" alt="Third slide" />
                </Carousel.Item>
            </Carousel>
            <Container className="mt-4">
                <Row>
                    <Col md={3}>
                        <h4>Filter By</h4>
                        <Form.Group controlId="formCategory">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" value={selectedCategory} onChange={handleCategoryChange}>
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formMinPrice" className="mt-3">
                            <Form.Label>Min Price</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="0" 
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                onBlur={handlePriceChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formMaxPrice" className="mt-3">
                            <Form.Label>Max Price</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="1000" 
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                onBlur={handlePriceChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={9}>
                        <Row>
                            {products.map(product => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={4} className="mb-4">
                                    <Card className="product-card">
                                        <Card.Img 
                                            variant="top" 
                                            src={product.image ? `http://localhost:5001${product.image}` : 'https://via.placeholder.com/150'} 
                                            alt={product.name}
                                        />
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
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Home;
