import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = () => {
    const authContext = useContext(AuthContext);
    const { isAuthenticated, user } = authContext;

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated || (user && user.role !== 'admin')) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default AdminRoute;
