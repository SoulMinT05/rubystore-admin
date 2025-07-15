import React, { useContext, useEffect, useRef, useState } from 'react';

import './HeaderComponent.scss';

import { RiMenu2Line } from 'react-icons/ri';
import {
    Button,
    CircularProgress,
    Badge,
    Tooltip,
    Menu,
    MenuItem,
    Divider,
    Popper,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    Box,
    Typography,
} from '@mui/material';
import { IoBagCheckOutline } from 'react-icons/io5';
import { FaRegComments } from 'react-icons/fa';
import { FaRegBell } from 'react-icons/fa';
import { FaRegUser } from 'react-icons/fa';
import { IoMdLogOut, IoMdNotificationsOutline } from 'react-icons/io';
import { MyContext } from '../../App';
import axiosClient from '../../apis/axiosClient';
import axiosToken from '../../apis/axiosToken';
import { Link, useNavigate } from 'react-router-dom';
import { IoKeyOutline } from 'react-icons/io5';
import Cookies from 'js-cookie';
import { LuSend } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import {
    addNotification,
    fetchNotifications,
    getUnreadCountNotifications,
    markNotificationRead,
} from '../../redux/notificationSlice';
import { socket } from '../../config/socket';

function formatDateUTCPlus7(dateString) {
    const date = new Date(dateString);
    date.setHours(date.getHours());

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year} `;
}

const tailwindColorMap = {
    'bg-blue-500': '#3b82f6',
    'bg-green-500': '#22c55e',
    'bg-yellow-500': '#eab308',
    'bg-purple-500': '#8b5cf6',
    'bg-red-500': '#ef4444',
    'bg-gray-500': '#6b7280',
};

const getNotificationAvatar = (type, bgColor) => {
    const hexColor = tailwindColorMap[bgColor] || '#6b7280';

    switch (type) {
        case 'order':
            return (
                <Avatar sx={{ bgcolor: hexColor }}>
                    <IoBagCheckOutline size={20} color="white" />
                </Avatar>
            );
        case 'review':
            return (
                <Avatar sx={{ bgcolor: hexColor }}>
                    <FaRegComments size={18} color="white" />
                </Avatar>
            );
        default:
            return <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />;
    }
};

const HeaderComponent = () => {
    const { notifications } = useSelector((state) => state.notification);
    const { unreadCountNotifications } = useSelector((state) => state.notification);
    const dispatch = useDispatch();

    const [anchorMyAccount, setAnchorMyAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const anchorRef = useRef(null);
    const [openNotifications, setOpenNotifications] = useState(false);

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
        socket.on('notificationStaffNewOrder', (data) => {
            console.log('Admin nhan notificationStaffNewOrder: ', data);
            dispatch(addNotification(data));
        });
        socket.on('notificationStaffCancelOrder', (data) => {
            console.log('Admin nhan notificationStaffCancelOrder: ', data);
            dispatch(addNotification(data));
        });
        socket.on('notificationStaffNewReview', (data) => {
            console.log('Admin nhan notificationStaffNewReview: ', data);
            dispatch(addNotification(data));
        });

        return () => {
            socket.off('notificationStaffNewOrder');
            socket.off('notificationStaffCancelOrder');
            socket.off('notificationStaffNewReview');
        };
    }, []);

    useEffect(() => {
        const getNotification = async () => {
            const { data } = await axiosClient.get('/api/notification/getNotificationsFromStaff?limit=4');
            console.log('dataNotificationStaf: ', data);
            if (data.success) {
                dispatch(fetchNotifications(data?.notifications));
                dispatch(getUnreadCountNotifications(data?.unreadCountNotifications));
            }
        };
        getNotification();
    }, []);

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

    const markNotificationAsRead = async (notificationId) => {
        try {
            const { data } = await axiosClient.post(
                `/api/notification/markNotificationAsReadFromStaff/${notificationId}`
            );
            if (data.success) {
                dispatch(markNotificationRead({ notificationId: data?.notificationId }));
            }
        } catch (error) {
            console.log(error);
            context.openAlertBox('error', error?.response?.data?.message || 'Đã xảy ra lỗi!');
        }
    };

    const handleMarkAsReadAndNavigate = async (notificationId) => {
        try {
            const { data } = await axiosClient.post(
                `/api/notification/markNotificationAsReadFromStaff/${notificationId}`
            );
            if (data.success) {
                dispatch(markNotificationRead({ notificationId: data?.notificationId }));
                setOpenNotifications(false);
                navigate(`${data.targetUrl}`);
            }
        } catch (error) {
            console.log(error);
            context.openAlertBox('error', error?.response?.data?.message || 'Đã xảy ra lỗi!');
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
                {context.isLogin === true ? (
                    <>
                        <li
                            onMouseEnter={() => setOpenNotifications(true)}
                            onMouseLeave={() => setOpenNotifications(false)}
                            className="relative mx-2 cursor-pointer z-2000 list-none "
                        >
                            <Tooltip title="Thông báo" placement="top">
                                <Badge
                                    className="icon-header"
                                    ref={anchorRef}
                                    badgeContent={unreadCountNotifications}
                                    color="primary"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            right: 2,
                                            top: 2,
                                        },
                                    }}
                                >
                                    <span className="w-[28px] h-[28px] flex items-center justify-center">
                                        <IoMdNotificationsOutline className="text-3xl" />
                                    </span>
                                </Badge>
                            </Tooltip>

                            {/* Pseudo hover bridge */}
                            <span className="absolute -left-[8px] right-0 w-[48px] h-[24px] -bottom-[24px] z-10" />

                            <Popper
                                open={openNotifications}
                                anchorEl={anchorRef.current}
                                placement="bottom"
                                disablePortal
                                modifiers={[
                                    {
                                        name: 'offset',
                                        options: {
                                            offset: [0, 8],
                                        },
                                    },
                                ]}
                                sx={{ cursor: 'pointer', zIndex: 1500 }}
                            >
                                <Paper
                                    elevation={3}
                                    sx={{
                                        width: 500,
                                        mt: 1,
                                        mr: 4,
                                        position: 'relative',
                                    }}
                                    tabIndex={-1} // ✅ Tránh lỗi focus gây aria-hidden
                                >
                                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                        {notifications?.length > 0 &&
                                            notifications?.map((notification) => {
                                                return (
                                                    <ListItem
                                                        onClick={() => handleMarkAsReadAndNavigate(notification._id)}
                                                        key={notification._id}
                                                        alignItems="flex-start"
                                                        className={`cursor-pointer hover:bg-gray-100 ${
                                                            notification?.isRead === false
                                                                ? 'bg-red-50 transition-colors'
                                                                : ''
                                                        } `}
                                                    >
                                                        <ListItemAvatar>
                                                            {notification?.type === 'order' ? (
                                                                getNotificationAvatar(
                                                                    notification?.type,
                                                                    notification?.bgColor
                                                                )
                                                            ) : (
                                                                <Avatar src={notification?.avatarSender} />
                                                            )}
                                                        </ListItemAvatar>
                                                        <Box className="flex flex-col justify-center w-full">
                                                            <Typography variant="body1" fontWeight={500}>
                                                                {notification?.title}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                className="mt-1"
                                                            >
                                                                {notification?.description}
                                                            </Typography>

                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                    marginTop: '12px',
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.disabled"
                                                                    className="!text-[13px]"
                                                                >
                                                                    {formatDateUTCPlus7(notification?.createdAt)}
                                                                </Typography>
                                                                <Typography
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        markNotificationAsRead(notification?._id);
                                                                    }}
                                                                    variant="caption"
                                                                    className={`!text-[13px] italic ${
                                                                        notification?.isRead
                                                                            ? 'text-gray-500'
                                                                            : 'text-blue-500 hover:underline cursor-pointer'
                                                                    }`}
                                                                >
                                                                    {notification?.isRead
                                                                        ? 'Đã đọc'
                                                                        : 'Đánh dấu là đã đọc'}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </ListItem>
                                                );
                                            })}
                                        <Divider sx={{ marginLeft: 0 }} variant="inset" component="li" />

                                        <ListItem
                                            className="justify-center hover:underline text-blue-600 cursor-pointer py-2"
                                            onClick={() => navigate('/notifications')} // Hoặc gọi hàm gì đó nếu có
                                        >
                                            <Typography variant="body2" className="font-medium !mx-auto">
                                                Xem tất cả
                                            </Typography>
                                        </ListItem>
                                    </List>
                                </Paper>
                            </Popper>
                        </li>
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
                                            <h3 className="text-[15px] font-[500] leading-5">
                                                {context.userInfo?.name}
                                            </h3>
                                            <p className="text-[12px] font-[400] opacity-70">
                                                {context.userInfo?.email}
                                            </p>
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
                    </>
                ) : (
                    <Button className="btn-blue btn-sm !rounded-full">Đăng nhập</Button>
                )}
            </div>
        </header>
    );
};

export default HeaderComponent;
