import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { MyContext } from '../App';

const PrivateRoute = ({ children }) => {
    const { isLogin } = useContext(MyContext);

    return isLogin ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
