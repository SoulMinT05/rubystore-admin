import React, { useContext, useState } from 'react';

import './ChangePasswordPage.scss';
import { Button, CircularProgress } from '@mui/material';
import { FaRegEye, FaEyeSlash } from 'react-icons/fa';
import axiosClient from '../../apis/axiosClient';
import { MyContext } from '../../App';

const ChangePasswordPage = () => {
    const [isShowOldPassword, setIsShowOldPassword] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(MyContext);

    const changePassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axiosClient.post('/api/staff/change-password', {
                email: context?.userInfo?.email,
                oldPassword,
                password,
                confirmPassword,
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                context.setUserInfo(data);
            } else {
                context.openAlertBox('error', data.message);
            }
        } catch (error) {
            console.log(error);
            context.openAlertBox('error', error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-5 bg-white w-full">
            <div className="loginBox card w-[600px] h-[auto] pb-20 mx-auto pt-20 relative z-50">
                <h1 className="text-center text-[30px] font-[800] mt-4">Đổi mật khẩu</h1>

                <br />

                <form onSubmit={changePassword} className="w-full px-8 mt-2">
                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Mật khẩu cũ</h4>
                        <div className="relative w-full">
                            <input
                                onChange={(e) => setOldPassword(e.target.value)}
                                type={isShowOldPassword === false ? 'text' : 'password'}
                                className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md
                            focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                            />
                            <Button
                                className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600"
                                onClick={() => setIsShowOldPassword(!isShowOldPassword)}
                            >
                                {isShowOldPassword === false ? (
                                    <FaRegEye className="text-[18px]" />
                                ) : (
                                    <FaEyeSlash className="text-[18px]" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Mật khẩu mới</h4>
                        <div className="relative w-full">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
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
                                onChange={(e) => setConfirmPassword(e.target.value)}
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

                    <Button type="submit" className="!mt-2 btn-blue btn-lg w-full !normal-case">
                        {isLoading === true ? <CircularProgress color="inherit" /> : 'Đổi mật khẩu'}
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default ChangePasswordPage;
