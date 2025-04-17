import React, { useState } from 'react';

import './RegisterPage.scss';
import { Link, NavLink } from 'react-router-dom';
import { CgLogIn } from 'react-icons/cg';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { FaRegUser } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import { FaRegEye, FaEyeSlash } from 'react-icons/fa';

import { LoadingButton } from '@mui/lab';
import pattern from '../../assets/pattern.webp';

const RegisterPage = () => {
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [loadingFacebook, setLoadingFacebook] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);

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
                    <NavLink to="/login" exact={true} activeClassName="isActive">
                        <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-2">
                            <CgLogIn className="text-[18px]" />
                            Đăng nhập
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
                    Chưa có tài khoản?
                    <br />
                    Hãy đăng ký ngay!
                </h1>

                <div className="w-full px-8 mt-3">
                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Họ và tên</h4>
                        <input
                            type="text"
                            className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md
                            focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3
                        "
                        />
                    </div>
                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Email</h4>
                        <input
                            type="email"
                            className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md
                            focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3
                        "
                        />
                    </div>
                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Mật khẩu</h4>
                        <div className="relative w-full">
                            <input
                                type={isShowPassword === false ? 'text' : 'password'}
                                className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md
                            focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3
                        "
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

                    <Button className="!mt-3 btn-blue btn-lg w-full !normal-case">Đăng ký</Button>
                </div>

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
        </section>
    );
};

export default RegisterPage;
