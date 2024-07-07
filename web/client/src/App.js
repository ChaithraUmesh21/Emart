import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthState from './context/AuthState';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import Wishlist from './components/Wishlist';
import Cart from './components/Cart';
import Category from './components/Category';
import Product from './components/Product';
import Orders from './components/Orders'; // Import Orders component
import AdminRoute from './components/AdminRoute';
import setAuthToken from './utils/setAuthToken';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    useEffect(() => {
        // Load user
    }, []);

    return (
        <AuthState>
            <Router>
                <div id="root">
                    <Navbar />
                    <div className="container">
                        <Routes>
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={<Home />} />
                            <Route element={<AdminRoute />}>
                                <Route path="/admin/*" element={<AdminDashboard />} />
                            </Route>
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/category/:categoryName" element={<Category />} />
                            <Route path="/product/:id" element={<Product />} />
                            <Route path="/product/:id/buy" element={<Product />} />
                            <Route path="/orders" element={<Orders />} /> {/* Add Orders route */}
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
        </AuthState>
    );
};

export default App;
