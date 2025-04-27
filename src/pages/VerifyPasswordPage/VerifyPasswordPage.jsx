import React, { useContext, useState } from 'react';

import './VerifyPasswordPage.scss';
import { Link, useNavigate } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import { FaRegUser } from 'react-icons/fa6';

import pattern from '../../assets/pattern.webp';

import verify from '../../assets/verify.png';
import OtpBoxComponent from '../../components/OtpBoxComponent/OtpBoxComponent';
import { MyContext } from '../../App';
import axiosAuth from '../../apis/axiosAuth';

const VerifyPasswordPage = () => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const handleOtpChange = (value) => {
        setOtp(value);
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axiosAuth.post('/api/staff/verify-forgot-password', {
                email: sessionStorage.getItem('emailVerifyForgotPassword'),
                otp,
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                navigate('/reset-password');
            }
        } catch (err) {
            console.log(err);
            context.openAlertBox('error', err);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <section className="bg-white w-full h-[180vh]">
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
                    <img src={verify} alt="" className="w-[100px] m-auto" />
                </div>
                <h1 className="text-center text-[35px] font-[800] mt-4">
                    Chào bạn!
                    <br />
                    Hãy xác minh tài khoản qua email của bạn.
                </h1>

                <br />

                <p className="text-center text-[15px]">
                    OTP đã được gửi đến {'  '}
                    <span className="text-primary font-bold">
                        {sessionStorage.getItem('emailVerifyForgotPassword')}
                    </span>
                </p>

                <br />

                <form onSubmit={verifyOtp}>
                    <div className="text-center flex items-center justify-center flex-col">
                        <OtpBoxComponent length={6} onChange={handleOtpChange} />
                    </div>
                    <br />
                    <div className="w-full m-auto">
                        <Button type="submit" className="w-full btn-blue">
                            {isLoading === true ? <CircularProgress color="inherit" /> : 'Gửi OTP'}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default VerifyPasswordPage;
