import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles.css';

const Footer = () => {
    return (
        <footer className="footer bg-dark text-white py-3">
            <Container>
                <Row>
                    <Col md={6}>
                        <p>&copy; {new Date().getFullYear()} ElectroMart All rights reserved.</p>
                    </Col>
                    <Col md={6} className="text-md-right">
                        <p>Follow us on: 
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white ml-2">Facebook</a> | 
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white ml-2">Twitter</a> | 
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white ml-2">Instagram</a>
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
