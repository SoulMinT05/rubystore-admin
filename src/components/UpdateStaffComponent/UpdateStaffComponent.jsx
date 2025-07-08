import React, { useContext, useEffect, useState } from 'react';

import './UpdateStaffComponent.scss';
import UploadImagesComponent from '../UploadImagesComponent/UploadImagesComponent';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Button, CircularProgress } from '@mui/material';
import { MyContext } from '../../App';
import axiosClient from '../../apis/axiosClient';
import { useDispatch } from 'react-redux';
import { updateStaffInfo } from '../../redux/staffSlice';

const UpdateStaffComponent = () => {
    const dispatch = useDispatch();
    const context = useContext(MyContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [streetLine, setStreetLine] = useState('');
    const [ward, setWard] = useState('');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');
    const [role, setRole] = useState('');

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    const [isLoadingUpdateUser, setIsLoadingUpdateUser] = useState(false);
    const { id } = context.isOpenFullScreenPanel || {};

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const { data } = await axiosClient.get(`/api/staff/getStaffOrAdminDetails/${id}`);
                if (data.success) {
                    setName(data?.staff?.name);
                    setEmail(data?.staff?.email);
                    setPhoneNumber(data?.staff?.phoneNumber);
                    setRole(data?.staff?.role);
                    setStreetLine(data?.staff?.address?.streetLine);
                    setWard(data?.staff?.address?.ward);
                    setDistrict(data?.staff?.address?.district);
                    setCity(data?.staff?.address?.city);
                    setAvatarPreview(data?.staff?.avatar);
                }
            } catch (error) {
                console.error('error: ', error);
            }
        };
        getUserDetails();
    }, []);

    const handleUploadAvatar = (file) => {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setIsLoadingUpdateUser(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phoneNumber', phoneNumber);
            formData.append('streetLine', streetLine);
            formData.append('ward', ward);
            formData.append('district', district);
            formData.append('city', city);

            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }
            const { data } = await axiosClient.patch(`/api/staff/updateStaffInfoFromAdmin/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(
                    updateStaffInfo({
                        staff: data?.staff,
                        staffId: data?.staffId,
                    })
                );
                context.setIsOpenFullScreenPanel({
                    open: false,
                });
            }
        } catch (error) {
            console.error('error: ', error);
            context.openAlertBox('error', error.response.data.message);
        } finally {
            setIsLoadingUpdateUser(false);
        }
    };

    return (
        <section className="p-5 bg-gray-50">
            <form onSubmit={handleUpdateUser} className="form p-8 py-3 max-h-[800px] ">
                <div className="scroll overflow-y-scroll">
                    <div className="grid grid-cols-4 gap-4 mb-3">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Họ và tên</h3>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Email</h3>
                            <input
                                value={email}
                                disabled
                                // onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Số điện thoại</h3>
                            <input
                                value={phoneNumber || ''}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Vai trò</h3>
                            {/* <input
                                disabled
                                value={role}
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            /> */}
                            <div
                                className={`w-full h-[40px] border border-[rgba(0,0,0,0.2)] rounded-sm p-3 text-sm flex items-center 
            ${role === 'staff' ? 'text-blue-600' : 'text-green-600'}
            bg-gray-100 cursor-not-allowed`}
                            >
                                {role === 'admin' ? 'Quản lý' : 'Nhân viên'}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 mb-3 gap-3">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Đường</h3>
                            <input
                                value={streetLine || ''}
                                onChange={(e) => setStreetLine(e.target.value)}
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Phường</h3>
                            <input
                                value={ward || ''}
                                onChange={(e) => setWard(e.target.value)}
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Quận</h3>
                            <input
                                value={district || ''}
                                onChange={(e) => setDistrict(e.target.value)}
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Thành phố</h3>
                            <input
                                value={city || ''}
                                onChange={(e) => setCity(e.target.value)}
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                    </div>

                    <div className="col w-full p-5 px-0">
                        <h3 className="font-[700] text-[18px] mb-3">Ảnh đại diện</h3>

                        <div className="grid grid-cols-7 gap-4">
                            <div className="uploadBoxWrapper relative">
                                {avatarPreview ? (
                                    <>
                                        <span
                                            onClick={() => {
                                                setAvatarFile(null);
                                                setAvatarPreview('');
                                            }}
                                            className="absolute w-[25px] h-[25px] rounded-full bg-red-700 -top-[10px] -right-[10px] z-50 flex items-center justify-center cursor-pointer"
                                        >
                                            <IoMdClose className="text-white text-[20px]" />
                                        </span>

                                        <div
                                            className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-full 
                    bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative"
                                        >
                                            <LazyLoadImage
                                                alt="Preview Avatar"
                                                className="w-full h-full object-cover"
                                                effect="blur"
                                                src={avatarPreview}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <UploadImagesComponent multiple={false} onUpload={handleUploadAvatar} />
                                )}
                            </div>
                        </div>
                    </div>

                    <br />
                    <Button type="submit" className="btn-blue w-full !normal-case flex gap-2">
                        {isLoadingUpdateUser ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-[25px] text-white" />
                                <span className="text-[16px]">Cập nhật thông tin người dùng</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default UpdateStaffComponent;
