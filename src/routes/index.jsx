// src/routes/index.jsx
import { createBrowserRouter } from 'react-router-dom';

import MainLayoutPage from '../pages/MainLayoutPage/MainLayoutPage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import UserPage from '../pages/UserPage/UserPage';
import ProductPage from '../pages/ProductPage/ProductPage';
import StaffPage from '../pages/StaffPage/StaffPage';
import OrderPage from '../pages/OrderPage/OrderPage';
import HomeBannerPage from '../pages/HomeBannerPage/HomeBannerPage';
import CategoryPage from '../pages/CategoryPage/CategoryPage';
import SubCategoryPage from '../pages/SubCategoryPage/SubCategoryPage';

import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage';
import VerifyPage from '../pages/VerifyPage/VerifyPage';
import ChangePasswordPage from '../pages/ChangePasswordPage/ChangePasswordPage';
import PrivateRoute from './PrivateRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayoutPage />,
        children: [
            {
                path: '',
                element: (
                    <PrivateRoute>
                        <DashboardPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'home-banner',
                element: (
                    <PrivateRoute>
                        <HomeBannerPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'users',
                element: (
                    <PrivateRoute>
                        <UserPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'staffs',
                element: (
                    <PrivateRoute>
                        <StaffPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'products',
                element: (
                    <PrivateRoute>
                        <ProductPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'categories',
                element: (
                    <PrivateRoute>
                        <CategoryPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'sub-categories',
                element: (
                    <PrivateRoute>
                        <SubCategoryPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'orders',
                element: (
                    <PrivateRoute>
                        <OrderPage />
                    </PrivateRoute>
                ),
            },
        ],
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
    },
    {
        path: '/verify',
        element: <VerifyPage />,
    },
    {
        path: '/change-password',
        element: <ChangePasswordPage />,
    },
]);

export default router;
