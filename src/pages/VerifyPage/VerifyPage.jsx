import React, { useState } from 'react';

import './VerifyPage.scss';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@mui/material';
import { FaRegUser } from 'react-icons/fa6';

import pattern from '../../assets/pattern.webp';

import verify from '../../assets/verify.png';
import OtpBoxComponent from '../../components/OtpBoxComponent/OtpBoxComponent';

const VerifyPage = () => {
    const [otp, setOtp] = useState('');
    const handleOtpChange = (value) => {
        setOtp(value);
    };
    const verifyOtp = (e) => {
        e.preventDefault();
        alert(e);
    };
    return (
        <section className="bg-white w-full h-[100vh]">
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
                    <img src={verify} alt="" className="w-[100px] m-auto" />
                </div>
                <h1 className="text-center text-[35px] font-[800] mt-4">
                    Chào bạn!
                    <br />
                    Hãy xác minh tài khoản qua email của bạn.
                </h1>

                <br />

                <p className="text-center text-[15px]">
                    OTP đã được gửi đến
                    <span className="text-primary font-bold"> tamnguyen@gmail.com</span>
                </p>

                <br />

                <div className="text-center flex items-center justify-center flex-col">
                    <OtpBoxComponent length={6} onChange={handleOtpChange} />
                </div>
                <br />
                <div className="w-full m-auto">
                    <Button type="submit" className="w-full btn-blue">
                        Gửi OTP
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default VerifyPage;
