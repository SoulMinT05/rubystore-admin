import React, { useState } from 'react';

import './ChangePasswordPage.scss';
import { Link, NavLink } from 'react-router-dom';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { FaRegUser } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import { FaRegEye, FaEyeSlash } from 'react-icons/fa';

import { LoadingButton } from '@mui/lab';
import pattern from '../../assets/pattern.webp';

const ChangePasswordPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

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
                    Chào bạn!
                    <br />
                    Bạn có thể đổi mật khẩu bên dưới.
                </h1>

                <br />

                <div className="w-full px-8 mt-2">
                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Mật khẩu mới</h4>
                        <div className="relative w-full">
                            <input
                                type={isShowPassword === false ? 'text' : 'password'}
                                className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md
                            focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
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
                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Xác nhận mật khẩu</h4>
                        <div className="relative w-full">
                            <input
                                type={isShowConfirmPassword === false ? 'text' : 'password'}
                                className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md
                            focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                            />
                            <Button
                                className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600"
                                onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                            >
                                {isShowConfirmPassword === false ? (
                                    <FaRegEye className="text-[18px]" />
                                ) : (
                                    <FaEyeSlash className="text-[18px]" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <Button className="!mt-2 btn-blue btn-lg w-full !normal-case">Đổi mật khẩu</Button>
                </div>
            </div>
        </section>
    );
};

export default ChangePasswordPage;
