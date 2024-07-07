import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image, ListGroup, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const { isAuthenticated, user } = useContext(AuthContext);

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
            setProduct(res.data);
        };

        fetchProduct();
    }, [id]);

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <Image src={product.image ? `${process.env.REACT_APP_API_URL}${product.image}` : 'https://via.placeholder.com/400'} alt={product.name} fluid />
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h3>{product.name}</h3>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <p>{product.description}</p>
                        </ListGroup.Item>
                        <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <Row>
                                    <Col>Price:</Col>
                                    <Col>
                                        <strong>${product.price}</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Status:</Col>
                                    <Col>
                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            {product.stock > 0 && (
                                <ListGroup.Item>
                                    <Button
                                        variant="primary"
                                        className="btn-block"
                                        disabled={user && user.role === 'admin'}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant="success"
                                        className="btn-block mt-2"
                                        disabled={user && user.role === 'admin'}
                                    >
                                        Buy Now
                                    </Button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Product;
