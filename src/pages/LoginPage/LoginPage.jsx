import React, { useContext, useState } from 'react';

import './LoginPage.scss';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import { FaRegUser } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import { FaRegEye, FaEyeSlash } from 'react-icons/fa';

import { MyContext } from '../../App';

import { LoadingButton } from '@mui/lab';
import pattern from '../../assets/pattern.webp';
import Cookies from 'js-cookie';
import axiosAuth from '../../apis/axiosAuth';

const LoginPage = () => {
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [loadingFacebook, setLoadingFacebook] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        email: '',
        password: '',
    });
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const forgotPassword = () => {
        navigate('/forgot-password');
    };

    const validateValue = Object.values(formFields).every((el) => el);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (!validateValue) {
                context.openAlertBox('error', 'Vui lòng điền đầy đủ thông tin!');
                return;
            }

            const { data } = await axiosAuth.post('/api/staff/login', formFields);

            console.log('dataLogin: ', data);
            if (data.success) {
                context.openAlertBox('success', data.message);

                Cookies.set('accessToken', data?.data?.accessToken);

                context.setIsLogin(true);
                localStorage.setItem('userId', data?.user?._id);
                localStorage.setItem('role', data?.user?.role);

                navigate('/');
            } else {
                context.openAlertBox('error', data.message);
            }
        } catch (err) {
            console.log(err);
            context.openAlertBox('error', err?.response?.data?.message || 'Đã xảy ra lỗi!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClickGoogle = () => {
        setLoadingGoogle(true);
    };
    const handleClickFacebook = () => {
        setLoadingFacebook(true);
    };
    return (
        <section className="bg-white w-full">
            <header className="w-full fixed top-0 left-0 px-4 py-3 flex items-center justify-between z-50">
                <Link to="/">
                    <img
                        src="https://serviceapi.spicezgold.com/download/1744255975457_logo.jpg"
                        className="w-[200px]"
                        alt=""
                    />
                </Link>

                <div className="flex items-center gap-0">
                    <Link to="/register">
                        <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-2">
                            <FaRegUser className="text-[15px]" />
                            Đăng ký
                        </Button>
                    </Link>
                </div>
            </header>

            <img src={pattern} alt="" className="w-full fixed top-0 left-0 opacity-5" />

            <div className="loginBox card w-[600px] h-[auto] pb-20 mx-auto pt-20 relative z-50">
                <div className="text-center">
                    <img src="https://ecommerce-admin-view.netlify.app/icon.svg" alt="" className="m-auto" />
                </div>
                <h1 className="text-center text-[35px] font-[800] mt-4">
                    Chào bạn!
                    <br />
                    Hãy đăng nhập để tiếp tục!
                </h1>

                <br />

                <div className="w-full px-8 mt-2">
                    <form onSubmit={handleLogin}>
                        <div className="form-group mb-4 w-full">
                            <h4 className="text-[14px] font-[500] mb-1">Email</h4>
                            <input
                                name="email"
                                value={formFields.email}
                                disabled={isLoading === true ? true : false}
                                type="email"
                                className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md
                            focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3
                        "
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group mb-4 w-full">
                            <h4 className="text-[14px] font-[500] mb-1">Mật khẩu</h4>
                            <div className="relative w-full">
                                <input
                                    name="password"
                                    value={formFields.password}
                                    disabled={isLoading === true ? true : false}
                                    type={isShowPassword === false ? 'text' : 'password'}
                                    className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md
                            focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                                    onChange={handleChange}
                                />
                                <Button
                                    className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600"
                                    onClick={() => setIsShowPassword(!isShowPassword)}
                                >
                                    {isShowPassword === false ? (
                                        <FaRegEye className="text-[18px]" />
                                    ) : (
                                        <FaEyeSlash className="text-[18px]" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="form-group mb-4 w-full flex items-center justify-between">
                            <FormControlLabel control={<Checkbox />} label="Ghi nhớ tài khoản" />

                            <Link
                                to="/forgot-password"
                                className="text-primary font-[600] text-[15px] hover:underline
                            hover:text-gray-700"
                                onClick={forgotPassword}
                            >
                                Quên mật khẩu
                            </Link>
                        </div>

                        <Button type="submit" className="!mt-2 btn-blue btn-lg w-full !normal-case">
                            {isLoading === true ? <CircularProgress color="inherit" /> : 'Đăng nhập'}
                        </Button>
                    </form>
                    <br />
                    <br />

                    <div className="w-full flex items-center justify-center gap-3">
                        <span className="flex items-center w-[160px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
                        <span className="text-[15px] font-[500]">Hoặc đăng nhập bằng</span>
                        <span className="flex items-center w-[160px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
                    </div>

                    <div className="flex items-center justify-center w-full mt-5 gap-4">
                        <LoadingButton
                            size="small"
                            onClick={handleClickGoogle}
                            endIcon={<FcGoogle />}
                            loading={loadingGoogle}
                            loadingPosition="end"
                            variant="outlined"
                            className="!bg-none !py-2 !normal-case !text-[15px] !px-5 !text-[rgba(0,0,0,0.7)]"
                        >
                            Đăng nhập bằng Google
                        </LoadingButton>
                        <LoadingButton
                            size="small"
                            onClick={handleClickFacebook}
                            endIcon={<BsFacebook className="iconFacebook" />}
                            loading={loadingFacebook}
                            loadingPosition="end"
                            variant="outlined"
                            className="!bg-none !py-2 !normal-case !text-[15px] !px-5 !text-[rgba(0,0,0,0.7)]"
                        >
                            Đăng nhập bằng Facebook
                        </LoadingButton>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
