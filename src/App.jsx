import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createContext, useState } from 'react';
import MainLayoutPage from './pages/MainLayoutPage/MainLayoutPage';

import DashboardPage from './pages/DashboardPage/DashboardPage';
import ProductPage from './pages/ProductPage/ProductPage';

import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';

const MyContext = createContext();

function App() {
    const [isOpenSidebar, setIsOpenSidebar] = useState(true);
    const [isLogin, setIsLogin] = useState(false);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <MainLayoutPage />, // Layout dùng chung
            children: [
                {
                    path: '', // / → mặc định là Dashboard
                    element: <DashboardPage />,
                },
                // {
                //     path: 'users',
                //     element: <UserPage />,
                // },
                {
                    path: 'products',
                    element: <ProductPage />,
                },
                // {
                //     path: 'orders',
                //     element: <OrderPage />,
                // },
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
    ]);

    const values = {
        isOpenSidebar,
        setIsOpenSidebar,
        isLogin,
        setIsLogin,
    };

    return (
        <>
            <MyContext.Provider value={values}>
                <RouterProvider router={router} />
            </MyContext.Provider>
        </>
    );
}

export default App;
export { MyContext };
