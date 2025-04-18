import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createContext, forwardRef, useState } from 'react';
import MainLayoutPage from './pages/MainLayoutPage/MainLayoutPage';

import DashboardPage from './pages/DashboardPage/DashboardPage';
import UserPage from './pages/UserPage/UserPage';
import ProductPage from './pages/ProductPage/ProductPage';

import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';

import AddUserComponent from './components/AddUserComponent/AddUserComponent';
import AddStaffComponent from './components/AddStaffComponent/AddStaffComponent';
import AddProductComponent from './components/AddProductComponent/AddProductComponent';
import AddHomeBannerComponent from './components/AddHomeBannerComponent/AddHomeBannerComponent';
import AddCategoryComponent from './components/AddCategoryComponent/AddCategoryComponent';
import AddSubCategoryComponent from './components/AddSubCategoryComponent/AddSubCategoryComponent';

import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';

import { IoMdClose } from 'react-icons/io';
import HomeBannerPage from './pages/HomeBannerPage/HomeBannerPage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import SubCategoryPage from './pages/SubCategoryPage/SubCategoryPage';
import StaffPage from './pages/StaffPage/StaffPage';
import OrderPage from './pages/OrderPage/OrderPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';
import VerifyPage from './pages/VerifyPage/VerifyPage';
import ChangePasswordPage from './pages/ChangePasswordPage/ChangePasswordPage';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MyContext = createContext();

function App() {
    const [isOpenSidebar, setIsOpenSidebar] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
        open: false,
        model: '',
    });

    const router = createBrowserRouter([
        {
            path: '/',
            element: <MainLayoutPage />, // Layout dùng chung
            children: [
                {
                    path: '', // / → mặc định là Dashboard
                    element: <DashboardPage />,
                },
                {
                    path: 'home-banner',
                    element: <HomeBannerPage />,
                },
                {
                    path: 'users',
                    element: <UserPage />,
                },
                {
                    path: 'staffs',
                    element: <StaffPage />,
                },
                {
                    path: 'products',
                    element: <ProductPage />,
                },
                {
                    path: 'categories',
                    element: <CategoryPage />,
                },
                {
                    path: 'sub-categories',
                    element: <SubCategoryPage />,
                },
                {
                    path: 'orders',
                    element: <OrderPage />,
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

    const values = {
        isOpenSidebar,
        setIsOpenSidebar,
        isLogin,
        setIsLogin,
        isOpenFullScreenPanel,
        setIsOpenFullScreenPanel,
    };

    return (
        <>
            <MyContext.Provider value={values}>
                <RouterProvider router={router} />

                <Dialog
                    fullScreen
                    open={isOpenFullScreenPanel.open}
                    onClose={() =>
                        setIsOpenFullScreenPanel({
                            open: false,
                        })
                    }
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={() =>
                                    setIsOpenFullScreenPanel({
                                        open: false,
                                    })
                                }
                                aria-label="close"
                            >
                                <IoMdClose className="text-gray-800" />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                <span className="text-gray-800">{isOpenFullScreenPanel?.model}</span>
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    {isOpenFullScreenPanel?.model === 'Thêm banner' && <AddHomeBannerComponent />}
                    {isOpenFullScreenPanel?.model === 'Thêm người dùng' && <AddUserComponent />}
                    {isOpenFullScreenPanel?.model === 'Thêm nhân viên' && <AddStaffComponent />}
                    {isOpenFullScreenPanel?.model === 'Thêm sản phẩm' && <AddProductComponent />}
                    {isOpenFullScreenPanel?.model === 'Thêm danh mục' && <AddCategoryComponent />}
                    {isOpenFullScreenPanel?.model === 'Thêm danh mục con' && <AddSubCategoryComponent />}
                </Dialog>
            </MyContext.Provider>
        </>
    );
}

export default App;
export { MyContext };
