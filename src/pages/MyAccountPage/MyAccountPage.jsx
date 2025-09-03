import { Button, TextField, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';

import { MyContext } from '../../App';
import axiosClient from '../../apis/axiosClient';
import './MyAccountPage.scss';
import defaultAvatar from '../../assets/default_avatar.png';
const MyAccountPage = () => {
    const context = useContext(MyContext);
    const [name, setName] = useState(context?.userInfo?.name || '');
    const [phoneNumber, setPhoneNumber] = useState(context?.userInfo?.phoneNumber || '');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);
    const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);

    useEffect(() => {
        setIsLoadingUserInfo(true);

        const fetchInfo = async () => {
            try {
                const { data } = await axiosClient.get('/api/staff/user-details');
                if (data.success && data?.user) {
                    context.setUserInfo(data?.user);
                    setName(data?.user?.name);
                    setPhoneNumber(data?.user?.phoneNumber);
                }
            } catch (error) {
                console.error('Không thể lấy avatar', error);
            } finally {
                setIsLoadingUserInfo(false);
            }
        };

        fetchInfo();
    }, []);

    useEffect(() => {
        setIsLoadingAvatar(true);

        const fetchAvatar = async () => {
            try {
                const { data } = await axiosClient.get('/api/staff/user-details');
                if (data?.success && data?.user?.avatar) {
                    setPreview(data?.user?.avatar); // Set avatar từ backend
                    context.setUserInfo(data?.user);
                }
            } catch (error) {
                console.error('Không thể lấy avatar', error);
            } finally {
                setIsLoadingAvatar(false);
            }
        };

        fetchAvatar();
    }, []);

    const handleChangeFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
            context.openAlertBox('error', 'Chỉ chấp nhận ảnh định dạng jpeg, jpg, png, webp');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        setIsUploading(true);
        try {
            const { data } = await axiosClient.put('/api/staff/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (data.success) {
                setPreview(data?.avatar);
                context.openAlertBox('success', 'Cập nhật ảnh đại diện thành công');
            } else {
                context.openAlertBox('error', data.message || 'Tải ảnh thất bại');
            }
        } catch (error) {
            console.log(error);
            context.openAlertBox('error', 'Lỗi mạng khi upload');
        } finally {
            setIsUploading(false);
        }
    };

    const updateInfo = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axiosClient.put('/api/staff/update-info', {
                name,
                phoneNumber,
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                context.setUserInfo(data?.user);
            } else {
                context.openAlertBox('error', data.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <section className="py-5 w-full">
            <div className="container flex gap-5">
                <div className="col2 w-[100%]">
                    <div className="card bg-white p-5 shadow-md rounded-md">
                        <h1 className="text-center text-[30px] font-[800] mt-4">Thông tin cá nhân</h1>

                        <br />

                        {isLoadingUserInfo || isLoadingAvatar ? (
                            <div className="flex items-center justify-center w-full min-h-[400px]">
                                <CircularProgress color="inherit" />
                            </div>
                        ) : (
                            <div className="">
                                <div className="w-full p-5 flex items-center justify-center flex-col">
                                    <div className="w-[110px] h-[110px] rounded-full overflow-hidden mb-4 relative group flex items-center justify-center bg-gray-200">
                                        {isUploading === true ? (
                                            <CircularProgress color="inherit" />
                                        ) : (
                                            <img
                                                src={preview || defaultAvatar}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        <img
                                            src={preview || defaultAvatar}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />

                                        <div
                                            className="overlay w-[100%] h-[100%] absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.7)] 
                                            flex items-center justify-center cursor-pointer
                                            opacity-0 transition-all group-hover:opacity-100"
                                        >
                                            <FaCloudUploadAlt className="text-[#fff] text-[25px]" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                name="avatar"
                                                className="absolute top-0 left-0 w-full h-full opacity-0"
                                                onChange={handleChangeFile}
                                            />
                                        </div>
                                    </div>
                                    <h3 className="text-[16px]">{context?.userInfo?.name}</h3>
                                    <h6 className="text-[15px] font-[500]">{context?.userInfo?.email}</h6>
                                </div>

                                <form className="mt-5" onSubmit={updateInfo}>
                                    <div className="flex items-center gap-5">
                                        <div className="w-[100%]">
                                            <TextField
                                                value={context?.userInfo?.email || ''}
                                                label="Email"
                                                variant="outlined"
                                                size="small"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                    <p className="italic text-left text-[13px] mt-2">Bạn không thể thay đổi email.</p>
                                    <div className="flex items-center gap-5 mt-4">
                                        <div className="w-[50%]">
                                            <TextField
                                                onChange={(e) => setName(e.target.value)}
                                                value={name || ''}
                                                label="Họ và tên"
                                                variant="outlined"
                                                size="small"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="w-[50%]">
                                            {/* <PhoneInput
                                        defaultCountry="in"
                                        value={phoneNumber}
                                        disabled
                                        // disabled react-international-phone-input
                                        onChange={(phoneNumber) => setPhoneNumber(phoneNumber)}
                                    /> */}
                                            <TextField
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                value={phoneNumber || ''}
                                                label="Số điện thoại"
                                                variant="outlined"
                                                size="small"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <br />

                                    <div
                                        className="flex items-center justify-center p-5 border border-dashed border-[rgba(0,0,0,0.2)] bg-[#f1faff] hover:bg-[#e7f3f9] cursor-pointer"
                                        onClick={() =>
                                            context.setIsOpenFullScreenPanel({
                                                open: true,
                                                model: 'Cập nhật địa chỉ',
                                            })
                                        }
                                    >
                                        <span className="text-[14px] font-[500]">Cập nhật địa chỉ</span>
                                    </div>

                                    <br />
                                    <div className="flex items-center justify-end gap-4">
                                        <Button type="submit" className="btn-blue btn-lg w-full !normal-case">
                                            {isLoading === true ? (
                                                <CircularProgress color="inherit" />
                                            ) : (
                                                'Lưu thông tin'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MyAccountPage;
