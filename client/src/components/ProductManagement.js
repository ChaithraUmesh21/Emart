import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card } from 'react-bootstrap';
import axios from 'axios';

const categories = ['Smartphones', 'Laptops', 'Tablets', 'Accessories'];

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
        setProducts(res.data);
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', currentProduct.name);
        formData.append('category', currentProduct.category);
        formData.append('price', currentProduct.price);
        formData.append('stock', currentProduct.stock);
        formData.append('description', currentProduct.description);
        if (image) {
            formData.append('image', image);
        }

        if (currentProduct._id) {
            await axios.put(`${process.env.REACT_APP_API_URL}/products/${currentProduct._id}`, formData);
        } else {
            await axios.post(`${process.env.REACT_APP_API_URL}/products`, formData);
        }
        setShowModal(false);
        fetchProducts();
    };

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`);
        fetchProducts();
    };

    const handleChange = (e) => {
        setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div>
            <Card>
                <Card.Header>
                    <Button variant="primary" onClick={() => { setCurrentProduct(null); setShowModal(true); }}>
                        Add Product
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{product.price}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <Button variant="info" className="me-2" onClick={() => { setCurrentProduct(product); setShowModal(true); }}>
                                            Edit
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDelete(product._id)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={currentProduct?.name || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" name="category" value={currentProduct?.category || ''} onChange={handleChange}>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" name="price" value={currentProduct?.price || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control type="number" name="stock" value={currentProduct?.stock || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="description" value={currentProduct?.description || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" onChange={handleImageChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductManagement;
