import React, { useContext, useEffect, useState } from 'react';

import './HeaderComponent.scss';

import { RiMenu2Line } from 'react-icons/ri';
import { Button, CircularProgress, Badge, Tooltip, Menu, MenuItem, Divider } from '@mui/material';
import { FaRegBell } from 'react-icons/fa';
import { FaRegUser } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import { MyContext } from '../../App';
import axiosClient from '../../apis/axiosClient';
import axiosToken from '../../apis/axiosToken';
import { Link, useNavigate } from 'react-router-dom';
import { IoKeyOutline } from 'react-icons/io5';
import Cookies from 'js-cookie';
import { LuSend } from 'react-icons/lu';

const HeaderComponent = () => {
    const [anchorMyAccount, setAnchorMyAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const open = Boolean(anchorMyAccount);
    const handleClickMyAccount = (event) => {
        setAnchorMyAccount(event.currentTarget);
    };
    const handleCloseMyAccount = () => {
        setAnchorMyAccount(null);
    };
    const navigate = useNavigate();
    const context = useContext(MyContext);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const { data } = await axiosClient.get('/api/staff/user-details');
                if (data?.success && data?.user?.avatar) {
                    context.setUserInfo(data?.user);
                }
            } catch (error) {
                console.error('Không thể lấy avatar', error);
            }
        };

        fetchAvatar();
    }, [context?.userInfo?.avatar]);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const { data } = await axiosClient.get('/api/staff/check-login', {
                    withCredentials: true,
                });
                if (data?.success) {
                    context.setIsLogin(true);
                } else {
                    context.setIsLogin(false);
                }
            } catch (error) {
                console.log('errorCheckLogin: ', error);
                context.setIsLogin(false);
            }
        };
        checkLogin();
    }, [context?.isLogin]);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosToken.post('/api/staff/logout', {
                withCredentials: true,
            });
            if (data.success) {
                Cookies.remove('accessToken');
                context.setIsLogin(false);
                context.openAlertBox('success', data.message);
                navigate('/login');
            } else {
                context.openAlertBox('error', data.message);
            }
        } catch (err) {
            console.log(err);
            context.openAlertBox('error', err?.response?.data?.message || 'Đã xảy ra lỗi!');
        } finally {
            setIsLoading(false);
            setAnchorMyAccount(null);
        }
    };

    return (
        <header
            className={`w-full h-[auto] ${
                context.isOpenSidebar === true ? 'pl-64' : 'pl-5'
            } py-2 pr-7 shadow-md bg-[#fff] flex items-center justify-between`}
        >
            <div className="part1">
                <Button
                    className={`!w-[40px] !h-[40px] !rounded-full !min-w-[40px] !text-[rgba(0,0,0,0.8)] ${
                        context.isOpenSidebar === true ? '!ml-[60px]' : ''
                    }`}
                    onClick={() => context.setIsOpenSidebar(!context.isOpenSidebar)}
                >
                    <RiMenu2Line className="text-[18px] text-[rgba(0,0,0,0.8)]" />
                </Button>
            </div>
            <div className="part2 w-[40%] flex items-center justify-end gap-6">
                <Tooltip title="Thông báo" placement="top" className="cursor-pointer">
                    <Badge className="icon-header" badgeContent={4} color="secondary">
                        <FaRegBell className="text-xl" />
                    </Badge>
                </Tooltip>

                {context.isLogin === true ? (
                    <div className="relative">
                        <div
                            className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer"
                            onClick={handleClickMyAccount}
                        >
                            <img src={context?.userInfo?.avatar} className="w-full h-full object-cover"></img>
                        </div>

                        <Menu
                            anchorEl={anchorMyAccount}
                            id="account-menu"
                            open={open}
                            onClose={handleCloseMyAccount}
                            onClick={handleCloseMyAccount}
                            slotProps={{
                                paper: {
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&::before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleCloseMyAccount} className="!bg-white">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer"
                                        onClick={handleClickMyAccount}
                                    >
                                        <img
                                            src={context?.userInfo?.avatar}
                                            className="w-full h-full object-cover"
                                        ></img>
                                    </div>

                                    <div className="info">
                                        <h3 className="text-[15px] font-[500] leading-5">{context.userInfo?.name}</h3>
                                        <p className="text-[12px] font-[400] opacity-70">{context.userInfo?.email}</p>
                                    </div>
                                </div>
                            </MenuItem>

                            <Divider />
                            <MenuItem onClick={handleCloseMyAccount}>
                                <Link to="/user-details" className="flex items-center gap-3">
                                    <FaRegUser className="text-[16px]" />
                                    <span className="text-[14px]">Thông tin cá nhân</span>
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleCloseMyAccount}>
                                <Link to="/message" className="flex items-center gap-3">
                                    <LuSend className="text-[16px]" />
                                    <span className="text-[14px]">Tin nhắn</span>
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleCloseMyAccount}>
                                <Link to="/change-password" className="flex items-center gap-3">
                                    <IoKeyOutline className="text-[16px]" />
                                    <span className="text-[14px]">Đổi mật khẩu</span>
                                </Link>
                            </MenuItem>

                            <MenuItem className="flex items-center gap-3" onClick={handleCloseMyAccount}>
                                {isLoading === true ? (
                                    <CircularProgress color="inherit" />
                                ) : (
                                    <div className="flex gap-2" onClick={handleLogout}>
                                        <IoMdLogOut className="text-[18px]  text-[#ff5252]" />
                                        <span className="text-[14px]  text-[#ff5252]">Đăng xuất</span>
                                    </div>
                                )}
                            </MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <Button className="btn-blue btn-sm !rounded-full">Đăng nhập</Button>
                )}
            </div>
        </header>
    );
};

export default HeaderComponent;
