import React, { useContext, useState } from 'react';

import './RegisterPage.scss';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CgLogIn } from 'react-icons/cg';
import { Button, CircularProgress } from '@mui/material';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import { FaRegEye, FaEyeSlash } from 'react-icons/fa';

import { LoadingButton } from '@mui/lab';
import pattern from '../../assets/pattern.webp';
import { MyContext } from '../../App';

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

    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateValue = Object.values(formFields).every((el) => el);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (!validateValue) {
                context.openAlertBox('error', 'Vui lòng điền đầy đủ thông tin!');
                return;
            }

            const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/staff/register', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(formFields),
            });

            const data = await res.json();
            console.log('data: ', data);
            setFormFields({
                name: '',
                email: '',
                password: '',
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                context.setEmailVerify(formFields?.email);
                sessionStorage.setItem('verifyToken', data.token);
                navigate('/verify');
            } else {
                context.openAlertBox('error', data.message);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
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

                <form onSubmit={handleSubmit} className="w-full px-8 mt-3">
                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Họ và tên</h4>
                        <input
                            name="name"
                            value={formFields.name}
                            disabled={isLoading === true ? true : false}
                            onChange={handleChange}
                            type="text"
                            className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md
                            focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3
                        "
                        />
                    </div>
                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Email</h4>
                        <input
                            name="email"
                            value={formFields.email}
                            disabled={isLoading === true ? true : false}
                            onChange={handleChange}
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
                                name="password"
                                value={formFields.password}
                                disabled={isLoading === true ? true : false}
                                onChange={handleChange}
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

                    <Button type="submit" className="!mt-3 btn-blue btn-lg w-full !normal-case">
                        {isLoading === true ? <CircularProgress color="inherit" /> : 'Đăng ký'}
                    </Button>
                </form>

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
