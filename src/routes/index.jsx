// src/routes/index.jsx
import { createBrowserRouter } from 'react-router-dom';

import MainLayoutPage from '../pages/MainLayoutPage/MainLayoutPage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import UserPage from '../pages/UserPage/UserPage';
import ProductPage from '../pages/ProductPage/ProductPage';
import StaffPage from '../pages/StaffPage/StaffPage';
import OrderPage from '../pages/OrderPage/OrderPage';
import BannerPage from '../pages/BannerPage/BannerPage';
import CategoryPage from '../pages/CategoryPage/CategoryPage';
import SubCategoryPage from '../pages/SubCategoryPage/SubCategoryPage';
import HomeSlidePage from '../pages/HomeSlidePage/HomeSlidePage';

import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage';
import VerifyPasswordPage from '../pages/VerifyPasswordPage/VerifyPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage/ResetPasswordPage';
import ChangePasswordPage from '../pages/ChangePasswordPage/ChangePasswordPage';
import PrivateRoute from './PrivateRoute';
import VerifyPage from '../pages/VerifyPage/VerifyPage';
import MyAccountPage from '../pages/MyAccountPage/MyAccountPage';
import ProductDetailsPage from '../pages/ProductDetailsPage/ProductDetailsPage';
import ProductRamPage from '../pages/ProductRamPage/ProductRamPage';
import ProductWeightPage from '../pages/ProductWeightPage/ProductWeightPage';
import ProductSizePage from '../pages/ProductSizePage/ProductSizePage';
import BlogPage from '../pages/BlogPage/BlogPage';

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
                        <BannerPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'home-slide',
                element: (
                    <PrivateRoute>
                        <HomeSlidePage />
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
                path: 'product/:id',
                element: (
                    <PrivateRoute>
                        <ProductDetailsPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'product/ram',
                element: (
                    <PrivateRoute>
                        <ProductRamPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'product/weight',
                element: (
                    <PrivateRoute>
                        <ProductWeightPage />
                    </PrivateRoute>
                ),
            },
            {
                path: 'product/size',
                element: (
                    <PrivateRoute>
                        <ProductSizePage />
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
            {
                path: 'blogs',
                element: (
                    <PrivateRoute>
                        <BlogPage />
                    </PrivateRoute>
                ),
            },
            {
                path: '/user-details',
                element: <MyAccountPage />,
            },
            {
                path: '/change-password',
                element: <ChangePasswordPage />,
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
        path: '/verify-password',
        element: <VerifyPasswordPage />,
    },
    {
        path: '/reset-password',
        element: <ResetPasswordPage />,
    },
    {
        path: '/verify',
        element: <VerifyPage />,
    },
]);

export default router;
