import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { MyContext } from '../App';

const PrivateRoute = ({ children }) => {
    const { isLogin, isAuthChecking } = useContext(MyContext);

    if (isAuthChecking) {
        return null; // hoặc một <LoadingSpinner />
    }
    return isLogin ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
