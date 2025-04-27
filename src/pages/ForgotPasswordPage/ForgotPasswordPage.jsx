import React, { useContext, useState } from 'react';

import './ForgotPasswordPage.scss';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import { FaRegUser } from 'react-icons/fa6';

import pattern from '../../assets/pattern.webp';
import { MyContext } from '../../App';
import axiosAuth from '../../apis/axiosAuth';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(MyContext);
    const navigate = useNavigate();

    const forgotPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (!email) {
                context.openAlertBox('error', 'Vui lòng điền email!');
                return;
            }

            const { data } = await axiosAuth.post('/api/staff/forgot-password', { email });
            if (data.success) {
                context.openAlertBox('success', 'Đã gửi mã xác nhận đến email của bạn!');
                sessionStorage.setItem('emailVerifyForgotPassword', email);
                navigate('/verify-password');
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
    return (
        <section className="bg-white w-full h-[160vh]">
            <header className="w-full fixed top-0 left-0 px-4 py-3 flex items-center justify-between z-50">
                <Link to="/">
                    <img
                        src="https://serviceapi.spicezgold.com/download/1744255975457_logo.jpg"
                        className="w-[200px]"
                        alt=""
                    />
                </Link>

                <div className="flex items-center gap-0">
                    <NavLink to="/register" exact={true} activeClassName="isActive">
                        <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-2">
                            <FaRegUser className="text-[15px]" />
                            Đăng ký
                        </Button>
                    </NavLink>
                </div>
            </header>

            <img src={pattern} alt="" className="w-full fixed top-0 left-0 opacity-5" />

            <div className="loginBox card w-[600px] h-[auto] pb-20 mx-auto pt-20 relative z-50">
                <div className="text-center">
                    <img src="https://ecommerce-admin-view.netlify.app/icon.svg" alt="" className="m-auto" />
                </div>
                <h1 className="text-center text-[35px] font-[800] mt-4">
                    Bạn quên mật khẩu?
                    <br />
                    Hãy đặt lại mật khẩu!
                </h1>

                <br />

                <div className="w-full px-8 mt-2">
                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Email</h4>
                        <input
                            name="email"
                            value={email}
                            disabled={isLoading === true ? true : false}
                            type="email"
                            className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md
                            focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3
                        "
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <Button className="!mt-2 btn-blue btn-lg w-full !normal-case" onClick={forgotPassword}>
                        {isLoading === true ? <CircularProgress color="inherit" /> : 'Đặt lại mật khẩu'}
                    </Button>

                    <br />
                    <br />
                    <div className="w-full flex items-center justify-center gap-2">
                        <span>Bạn đã nhớ mật khẩu?</span>
                        <Link
                            to="/login"
                            className="text-primary font-[600] text-[15px] hover:underline
                            hover:text-gray-700"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForgotPasswordPage;
