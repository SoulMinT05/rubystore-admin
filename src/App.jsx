import './App.css';

import { RouterProvider } from 'react-router-dom';
import { createContext, forwardRef, useEffect, useState } from 'react';

import AddUserComponent from './components/AddUserComponent/AddUserComponent';
import AddStaffComponent from './components/AddStaffComponent/AddStaffComponent';
import AddProductComponent from './components/AddProductComponent/AddProductComponent';
import AddHomeBannerComponent from './components/AddHomeBannerComponent/AddHomeBannerComponent';
import AddCategoryComponent from './components/AddCategoryComponent/AddCategoryComponent';
import AddSubCategoryComponent from './components/AddSubCategoryComponent/AddSubCategoryComponent';

import axiosClient from './apis/axiosClient';

import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoMdClose } from 'react-icons/io';
import router from './routes';
import AddAddressComponent from './components/AddAddressComponent/AddAddressComponent';
import UpdateCategoryComponent from './components/UpdateCategoryComponent/UpdateCategoryComponent';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MyContext = createContext();

function App() {
    const [isOpenSidebar, setIsOpenSidebar] = useState(true);
    const [isLogin, setIsLogin] = useState(true);
    const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
        open: false,
        model: '',
        id: '',
    });
    const [emailVerify, setEmailVerify] = useState('');
    const [emailVerifyForgotPassword, setEmailVerifyForgotPassword] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const { data } = await axiosClient.get('/api/staff/user-details');
                setUserInfo(data?.user);
            } catch (error) {
                console.log(error);
            }
        };
        getUserDetails();
    }, []);

    const openAlertBox = (status, message) => {
        if (status === 'success') {
            toast.success(message);
        }
        if (status === 'error') {
            toast.error(message);
        }
    };

    const values = {
        isOpenSidebar,
        setIsOpenSidebar,
        isLogin,
        setIsLogin,
        isOpenFullScreenPanel,
        setIsOpenFullScreenPanel,
        openAlertBox,
        emailVerify,
        setEmailVerify,
        emailVerifyForgotPassword,
        setEmailVerifyForgotPassword,
        userInfo,
        setUserInfo,
        categories,
        setCategories,
    };

    return (
        <>
            <MyContext.Provider value={values}>
                <RouterProvider router={router} />

                <ToastContainer />

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
                    {isOpenFullScreenPanel?.model === 'Cập nhật danh mục' && <UpdateCategoryComponent />}
                    {isOpenFullScreenPanel?.model === 'Thêm danh mục con' && <AddSubCategoryComponent />}
                    {isOpenFullScreenPanel?.model === 'Cập nhật địa chỉ' && <AddAddressComponent />}
                </Dialog>
            </MyContext.Provider>
        </>
    );
}

export default App;
export { MyContext };
