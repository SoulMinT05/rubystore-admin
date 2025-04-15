import React, { useState } from 'react';

import './HeaderComponent.scss';

import { RiMenu2Line } from 'react-icons/ri';
import { Button, Badge, Tooltip, Menu, MenuItem, Divider } from '@mui/material';
import { FaRegBell } from 'react-icons/fa';
import { FaRegUser } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';

const HeaderComponent = () => {
    const [anchorMyAccount, setAnchorMyAccount] = useState(null);
    const open = Boolean(anchorMyAccount);
    const handleClickMyAccount = (event) => {
        setAnchorMyAccount(event.currentTarget);
    };
    const handleCloseMyAccount = () => {
        setAnchorMyAccount(null);
    };
    return (
        <header className="w-full h-[auto] pl-64 py-2 pr-7 shadow-md bg-[#fff] flex items-center justify-between">
            <div className="part1">
                <Button className="!w-[40px] !h-[40px] !rounded-full !min-w-[40px] !text-[rgba(0,0,0,0.8)]">
                    <RiMenu2Line className="text-[18px] text-[rgba(0,0,0,0.8)]" />
                </Button>
            </div>
            <div className="part2 w-[40%] flex items-center justify-end gap-6">
                <Tooltip title="Thông báo" placement="top" className="cursor-pointer">
                    <Badge className="icon-header" badgeContent={4} color="secondary">
                        <FaRegBell className="text-xl" />
                    </Badge>
                </Tooltip>
                <div className="relative">
                    <div
                        className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer"
                        onClick={handleClickMyAccount}
                    >
                        <img
                            src="https://i.pinimg.com/736x/d8/8f/a6/d88fa61f19667a9e60eb9a001e9392e6.jpg"
                            className="w-full h-full object-cover"
                        ></img>
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
                                        src="https://i.pinimg.com/736x/d8/8f/a6/d88fa61f19667a9e60eb9a001e9392e6.jpg"
                                        className="w-full h-full object-cover"
                                    ></img>
                                </div>

                                <div className="info">
                                    <h3 className="text-[15px] font-[500] leading-5">Jisoo BlackPink</h3>
                                    <p className="text-[12px] font-[400] opacity-70">forworkdr@gmail.com</p>
                                </div>
                            </div>
                        </MenuItem>

                        <Divider />
                        <MenuItem className="flex items-center gap-3" onClick={handleCloseMyAccount}>
                            <FaRegUser className="text-[16px]" />
                            <span className="text-[14px]">Thông tin cá nhân</span>
                        </MenuItem>

                        <MenuItem className="flex items-center gap-3" onClick={handleCloseMyAccount}>
                            <IoMdLogOut className="text-[18px]" />
                            <span className="text-[14px]">Đăng xuất</span>
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </header>
    );
};

export default HeaderComponent;
