import './App.css';

import { RouterProvider } from 'react-router-dom';
import { createContext, forwardRef, useEffect, useState } from 'react';

import AddUserComponent from './components/AddUserComponent/AddUserComponent';
import AddStaffComponent from './components/AddStaffComponent/AddStaffComponent';
import AddProductComponent from './components/AddProductComponent/AddProductComponent';
import AddHomeBannerComponent from './components/AddHomeBannerComponent/AddHomeBannerComponent';
import AddCategoryComponent from './components/AddCategoryComponent/AddCategoryComponent';
import AddSubCategoryComponent from './components/AddSubCategoryComponent/AddSubCategoryComponent';
import AddBlogComponent from './components/AddBlogComponent/AddBlogComponent';

import axiosClient from './apis/axiosClient';

import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Provider } from 'react-redux';
import store from './redux/store';

import { IoMdClose } from 'react-icons/io';
import router from './routes';
import AddAddressComponent from './components/AddAddressComponent/AddAddressComponent';
import AddVoucherComponent from './components/AddVoucherComponent/AddVoucherComponent';
import UpdateCategoryComponent from './components/UpdateCategoryComponent/UpdateCategoryComponent';
import UpdateHomeSlideComponent from './components/UpdateHomeSlideComponent/UpdateHomeSlideComponent';
import UpdateProductComponent from './components/UpdateProductComponent/UpdateProductComponent';
import AddHomeSlideComponent from './components/AddHomeSlideComponent/AddHomeSlideComponent';
import AddBannerComponent from './components/AddBannerComponent/AddBannerComponent';
import UpdateBannerComponent from './components/UpdateBannerComponent/UpdateBannerComponent';
import UpdateBlogComponent from './components/UpdateBlogComponent/UpdateBlogComponent';
import UpdateUserComponent from './components/UpdateUserComponent/UpdateUserComponent';
import UpdateStaffComponent from './components/UpdateStaffComponent/UpdateStaffComponent';
import UpdateVoucherComponent from './components/UpdateVoucherComponent/UpdateVoucherComponent';

// SOCKET IO
import { socket } from './config/socket';
import ReplyInputComponent from './components/ReplyInputComponent/ReplyInputComponent';
import { DialogContent } from '@mui/material';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MyContext = createContext();

function App() {
    const [isOpenSidebar, setIsOpenSidebar] = useState(true);
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [isLogin, setIsLogin] = useState(true);
    const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
        open: false,
        model: '',
        id: '',
    });
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [emailVerify, setEmailVerify] = useState('');
    const [emailVerifyForgotPassword, setEmailVerifyForgotPassword] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [homeSlides, setHomeSlides] = useState([]);
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        socket.on('sendMessage', (message) => {
            console.log('message: ', message);
        });
        return () => {
            socket.off('sendMessage');
        };
    }, []);

    useEffect(() => {
        socket.emit('joinMessageRoom', userInfo?._id);
        console.log('Đã join message room');
    }, [isLogin, userInfo?._id]);

    useEffect(() => {
        socket.emit('joinRoom', userInfo?._id);
    }, [isLogin, userInfo?._id]);

    useEffect(() => {
        socket.on('notificationNewMessage', (data) => {
            console.log('ADmin nhan notificationNewMessage: ', data);
            // dispatch(addNotification(data));
        });
        return () => {
            socket.off('notificationNewMessage');
        };
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await axiosClient.get('/api/user/check-login', {
                    withCredentials: true,
                });
                if (data.success) {
                    setIsLogin(true);
                }
            } catch (error) {
                setIsLogin(false);
                console.log(error);
            } finally {
                setIsAuthChecking(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (!isLogin) return;

        const getUserDetails = async () => {
            try {
                const { data } = await axiosClient.get('/api/staff/user-details');
                console.log('dataStaff: ', data);
                setUserInfo(data?.user);
                localStorage.setItem('userId', data?.user?._id);
                localStorage.setItem('role', data?.user?.role);
            } catch (error) {
                console.log(error);
            }
        };
        getUserDetails();
    }, [isLogin]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const { data } = await axiosClient.get('/api/category/all-categories');
                setCategories(data?.categories);
            } catch (error) {
                console.log(error);
            }
        };
        getCategories();
    }, []);

    const getCategories = async () => {
        try {
            const { data } = await axiosClient.get('/api/category/all-categories');
            setCategories(data?.categories);
        } catch (error) {
            console.log(error);
        }
    };
    const getProducts = async () => {
        try {
            const { data } = await axiosClient.get('/api/product/all-products-admin');
            setProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };
    const getHomeSlides = async () => {
        try {
            const { data } = await axiosClient.get('/api/homeSlide/all-home-slides');
            setHomeSlides(data?.homeSlides);
        } catch (error) {
            console.log(error);
        }
    };
    const getBanners = async () => {
        try {
            const { data } = await axiosClient.get('/api/banner/all-banners');
            setBanners(data?.banners);
        } catch (error) {
            console.log(error);
        }
    };

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
        isChatOpen,
        setIsChatOpen,
        isAuthChecking,
        setIsAuthChecking,
        isOpenFullScreenPanel,
        setIsOpenFullScreenPanel,
        openAlertBox,
        emailVerify,
        setEmailVerify,
        emailVerifyForgotPassword,
        setEmailVerifyForgotPassword,
        userInfo,
        setUserInfo,
        products,
        setProducts,
        categories,
        setCategories,
        subCategories,
        setSubCategories,
        getCategories,
        getProducts,
        homeSlides,
        setHomeSlides,
        getHomeSlides,
        banners,
        setBanners,
        getBanners,
    };

    return (
        <>
            <Provider store={store}>
                <MyContext.Provider value={values}>
                    <RouterProvider router={router} />

                    <ToastContainer />

                    {isOpenFullScreenPanel?.model === 'Phản hồi' && (
                        <Dialog
                            disableScrollLock
                            fullWidth={true}
                            maxWidth="lg"
                            open={isOpenFullScreenPanel.open}
                            onClose={() =>
                                setIsOpenFullScreenPanel({
                                    open: false,
                                })
                            }
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            className="replyModal"
                        >
                            <DialogContent>
                                <ReplyInputComponent />
                            </DialogContent>
                        </Dialog>
                    )}

                    {isOpenFullScreenPanel?.model !== 'Phản hồi' && (
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

                            {isOpenFullScreenPanel?.model === 'Thêm banner' && <AddBannerComponent />}
                            {isOpenFullScreenPanel?.model === 'Cập nhật banner' && <UpdateBannerComponent />}
                            {isOpenFullScreenPanel?.model === 'Thêm home slide' && <AddHomeSlideComponent />}
                            {isOpenFullScreenPanel?.model === 'Cập nhật home slide' && <UpdateHomeSlideComponent />}
                            {isOpenFullScreenPanel?.model === 'Thêm người dùng' && <AddUserComponent />}
                            {isOpenFullScreenPanel?.model === 'Cập nhật người dùng' && <UpdateUserComponent />}
                            {isOpenFullScreenPanel?.model === 'Thêm nhân viên' && <AddStaffComponent />}
                            {isOpenFullScreenPanel?.model === 'Cập nhật nhân viên' && <UpdateStaffComponent />}
                            {isOpenFullScreenPanel?.model === 'Thêm sản phẩm' && <AddProductComponent />}
                            {isOpenFullScreenPanel?.model === 'Cập nhật sản phẩm' && <UpdateProductComponent />}
                            {isOpenFullScreenPanel?.model === 'Thêm danh mục' && <AddCategoryComponent />}
                            {isOpenFullScreenPanel?.model === 'Cập nhật danh mục' && <UpdateCategoryComponent />}
                            {isOpenFullScreenPanel?.model === 'Thêm danh mục con' && <AddSubCategoryComponent />}
                            {isOpenFullScreenPanel?.model === 'Thêm bài viết' && <AddBlogComponent />}
                            {isOpenFullScreenPanel?.model === 'Cập nhật bài viết' && <UpdateBlogComponent />}
                            {isOpenFullScreenPanel?.model === 'Cập nhật địa chỉ' && <AddAddressComponent />}
                            {isOpenFullScreenPanel?.model === 'Thêm voucher' && <AddVoucherComponent />}
                            {isOpenFullScreenPanel?.model === 'Cập nhật voucher' && <UpdateVoucherComponent />}
                        </Dialog>
                    )}
                </MyContext.Provider>
            </Provider>
        </>
    );
}

export default App;
export { MyContext };
