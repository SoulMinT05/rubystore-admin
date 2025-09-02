import React, { useContext, useState } from 'react';

import './SidebarComponent.scss';
import { Link } from 'react-router-dom';
import { Button, Divider } from '@mui/material';

import { RxDashboard } from 'react-icons/rx';
import { FaRegImage } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { FiUserCheck } from 'react-icons/fi';
import { RiProductHuntLine } from 'react-icons/ri';
import { TbCategory } from 'react-icons/tb';
import { IoBagCheckOutline } from 'react-icons/io5';
import { IoMdLogOut } from 'react-icons/io';
import { FaAngleDown } from 'react-icons/fa6';
import { IoKeyOutline } from 'react-icons/io5';
import { LuUserRoundPen } from 'react-icons/lu';
import { RiBloggerLine } from 'react-icons/ri';
import { RiCoupon2Line } from 'react-icons/ri';
import { FaRegComments } from 'react-icons/fa';
import { LuMessageCircleMore } from 'react-icons/lu';

import { Collapse } from 'react-collapse';
import { MyContext } from '../../App';

const SidebarComponent = () => {
    const context = useContext(MyContext);

    const [submenuIndex, setSubmenuIndex] = useState(null);
    const isOpenSubMenu = (index) => {
        if (submenuIndex === index) {
            setSubmenuIndex(null);
        } else {
            setSubmenuIndex(index);
        }
    };
    return (
        <div
            className={`sidebar fixed top-0 left-0 bg-[#fff] ${
                context.isOpenSidebar === true ? 'w-[18%]' : 'w-[0px]'
            } h-full overflow-y-auto border-r border-[rgba(0,0,0,0.1)] px-4 py-2`}
        >
            <div className="py-2 w-full">
                <Link to="/">
                    <img
                        src="https://serviceapi.spicezgold.com/download/1744255975457_logo.jpg"
                        alt=""
                        className="w-[200px]"
                    />
                </Link>
            </div>

            <ul className="mt-4">
                <li>
                    <Link to="/">
                        <Button className="w-full !normal-case !justify-start gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]">
                            <RxDashboard className="text-[18px]" />
                            Dashboard
                        </Button>
                    </Link>
                </li>
                {/* Home Slide */}
                <li>
                    <Button
                        className="w-full !normal-case !justify-start gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
                        onClick={() => isOpenSubMenu(1)}
                    >
                        <FaRegImage className="text-[18px]" />
                        <Link to="/home-slide">Home Sliders</Link>
                        <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                            <FaAngleDown className={`transition-all ${submenuIndex === 1 ? 'rotate-180' : ''}`} />
                        </span>
                    </Button>

                    <Collapse isOpened={submenuIndex === 1 ? true : false}>
                        <ul className="w-full">
                            <li className="w-full">
                                <Link to="/home-slide">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Danh sách Home Slide
                                    </Button>
                                </Link>
                            </li>
                            <li className="w-full">
                                <Link to="/home-slide/add">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Thêm Home Slide
                                    </Button>
                                </Link>
                            </li>
                        </ul>
                    </Collapse>
                </li>

                {/* Home Banner */}
                <li>
                    <Button
                        className="w-full !normal-case !justify-start gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
                        onClick={() => isOpenSubMenu(2)}
                    >
                        <FaRegImage className="text-[18px]" />
                        <Link to="/home-banner">Home Banners</Link>
                        <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                            <FaAngleDown className={`transition-all ${submenuIndex === 2 ? 'rotate-180' : ''}`} />
                        </span>
                    </Button>

                    <Collapse isOpened={submenuIndex === 2 ? true : false}>
                        <ul className="w-full">
                            <li className="w-full">
                                <Link to="/home-banner">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Danh sách Home Banner
                                    </Button>
                                </Link>
                            </li>
                            <li className="w-full">
                                <Link to="/home-banner/add">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Thêm Home Banner
                                    </Button>
                                </Link>
                            </li>
                        </ul>
                    </Collapse>
                </li>

                {/* User */}
                <li>
                    <Button
                        className="w-full !normal-case !justify-start gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
                        onClick={() => isOpenSubMenu(3)}
                    >
                        <FiUsers className="text-[18px]" />
                        <Link to="/users">Quản lý người dùng</Link>
                        <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                            <FaAngleDown className={`transition-all ${submenuIndex === 3 ? 'rotate-180' : ''}`} />
                        </span>
                    </Button>

                    <Collapse isOpened={submenuIndex === 3 ? true : false}>
                        <ul className="w-full">
                            <li className="w-full">
                                <Link to="/users">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Danh sách người dùng
                                    </Button>
                                </Link>
                            </li>
                            <li className="w-full">
                                <Button
                                    className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3"
                                    onClick={() =>
                                        context.setIsOpenFullScreenPanel({
                                            open: true,
                                            model: 'Thêm người dùng',
                                        })
                                    }
                                >
                                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                    Thêm người dùng
                                </Button>
                            </li>
                        </ul>
                    </Collapse>
                </li>

                {/* Staff / Admin */}
                <li>
                    <Button
                        className="w-full !normal-case !justify-start gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
                        onClick={() => isOpenSubMenu(4)}
                    >
                        <FiUserCheck className="text-[18px]" />
                        <Link to="/staffs">Quản lý nhân viên</Link>
                        <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                            <FaAngleDown className={`transition-all ${submenuIndex === 4 ? 'rotate-180' : ''}`} />
                        </span>
                    </Button>

                    <Collapse isOpened={submenuIndex === 4 ? true : false}>
                        <ul className="w-full">
                            <li className="w-full">
                                <Link to="/staffs">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Danh sách nhân viên
                                    </Button>
                                </Link>
                            </li>
                            <li className="w-full">
                                <Button
                                    className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3"
                                    onClick={() =>
                                        context.setIsOpenFullScreenPanel({
                                            open: true,
                                            model: 'Thêm nhân viên',
                                        })
                                    }
                                >
                                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                    Thêm nhân viên
                                </Button>
                            </li>
                        </ul>
                    </Collapse>
                </li>

                {/* Product */}
                <li>
                    <Button
                        className="w-full !normal-case !justify-start gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
                        onClick={() => isOpenSubMenu(5)}
                    >
                        <RiProductHuntLine className="text-[18px]" />
                        <Link to="/products">Quản lý sản phẩm</Link>
                        <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                            <FaAngleDown className={`transition-all ${submenuIndex === 5 ? 'rotate-180' : ''}`} />
                        </span>
                    </Button>

                    <Collapse isOpened={submenuIndex === 5 ? true : false}>
                        <ul className="w-full">
                            <li className="w-full">
                                <Link to="/products">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Danh sách sản phẩm
                                    </Button>
                                </Link>
                            </li>
                            <li className="w-full">
                                <Button
                                    className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3"
                                    onClick={() =>
                                        context.setIsOpenFullScreenPanel({
                                            open: true,
                                            model: 'Thêm sản phẩm',
                                        })
                                    }
                                >
                                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                    Thêm sản phẩm
                                </Button>
                            </li>
                            <li className="w-full">
                                <Link to="/product/ram">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Danh sách RAM
                                    </Button>
                                </Link>
                            </li>
                            <li className="w-full">
                                <Link to="/product/weight">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Danh sách cân nặng
                                    </Button>
                                </Link>
                            </li>
                            <li className="w-full">
                                <Link to="/product/size">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Danh sách size
                                    </Button>
                                </Link>
                            </li>
                        </ul>
                    </Collapse>
                </li>

                {/* Category */}
                <li>
                    <Button
                        className="w-full !normal-case !justify-start gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
                        onClick={() => isOpenSubMenu(6)}
                    >
                        <TbCategory className="text-[18px]" />
                        <Link to="/categories">Quản lý danh mục</Link>
                        <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                            <FaAngleDown className={`transition-all ${submenuIndex === 6 ? 'rotate-180' : ''}`} />
                        </span>
                    </Button>

                    <Collapse isOpened={submenuIndex === 6 ? true : false}>
                        <ul className="w-full">
                            <li className="w-full">
                                <Link to="/categories">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Danh sách danh mục
                                    </Button>
                                </Link>
                            </li>
                            <li className="w-full">
                                <Button
                                    className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3"
                                    onClick={() =>
                                        context.setIsOpenFullScreenPanel({
                                            open: true,
                                            model: 'Thêm danh mục',
                                        })
                                    }
                                >
                                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                    Thêm danh mục
                                </Button>
                            </li>
                            <li className="w-full">
                                <Link to="/sub-categories">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Danh mục con
                                    </Button>
                                </Link>
                            </li>
                            <li className="w-full">
                                <Button
                                    className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3"
                                    onClick={() =>
                                        context.setIsOpenFullScreenPanel({
                                            open: true,
                                            model: 'Thêm danh mục con',
                                        })
                                    }
                                >
                                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                    Thêm danh mục con
                                </Button>
                            </li>
                        </ul>
                    </Collapse>
                </li>

                {/* Order */}
                <li>
                    <Link to="/orders">
                        <Button className="w-full !normal-case !justify-start gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]">
                            <IoBagCheckOutline className="text-[20px]" />
                            Quản lý đơn hàng
                        </Button>
                    </Link>
                </li>

                {/* Voucher */}
                <li>
                    <Button
                        className="w-full !normal-case !justify-start gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
                        onClick={() => isOpenSubMenu(7)}
                    >
                        <RiCoupon2Line className="text-[18px]" />
                        <Link to="/vouchers">Quản lý voucher</Link>
                        <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                            <FaAngleDown className={`transition-all ${submenuIndex === 7 ? 'rotate-180' : ''}`} />
                        </span>
                    </Button>

                    <Collapse isOpened={submenuIndex === 7 ? true : false}>
                        <ul className="w-full">
                            <li className="w-full">
                                <Link to="/vouchers">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Danh sách voucher
                                    </Button>
                                </Link>
                            </li>
                            <li className="w-full">
                                <Button
                                    className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3"
                                    onClick={() =>
                                        context.setIsOpenFullScreenPanel({
                                            open: true,
                                            model: 'Thêm voucher',
                                        })
                                    }
                                >
                                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                    Thêm voucher
                                </Button>
                            </li>
                        </ul>
                    </Collapse>
                </li>

                {/* Blog */}
                <li>
                    <Button
                        className="w-full !normal-case !justify-start gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
                        onClick={() => isOpenSubMenu(8)}
                    >
                        <RiBloggerLine className="text-[18px]" />
                        <Link to="/blogs">Quản lý bài viết</Link>
                        <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                            <FaAngleDown className={`transition-all ${submenuIndex === 8 ? 'rotate-180' : ''}`} />
                        </span>
                    </Button>

                    <Collapse isOpened={submenuIndex === 8 ? true : false}>
                        <ul className="w-full">
                            <li className="w-full">
                                <Link to="/blogs">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Danh sách bài viết
                                    </Button>
                                </Link>
                            </li>
                            <li className="w-full">
                                <Button
                                    className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3"
                                    onClick={() =>
                                        context.setIsOpenFullScreenPanel({
                                            open: true,
                                            model: 'Thêm bài viết',
                                        })
                                    }
                                >
                                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                    Thêm bài viết
                                </Button>
                            </li>
                        </ul>
                    </Collapse>
                </li>

                {/* Comment / Review */}
                <li>
                    <Button
                        className="w-full !normal-case !justify-start gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
                        onClick={() => isOpenSubMenu(9)}
                    >
                        <FaRegComments className="text-[18px]" />
                        <Link to="/reviews">Quản lý đánh giá</Link>
                        <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                            <FaAngleDown className={`transition-all ${submenuIndex === 9 ? 'rotate-180' : ''}`} />
                        </span>
                    </Button>

                    <Collapse isOpened={submenuIndex === 9 ? true : false}>
                        <ul className="w-full">
                            <li className="w-full">
                                <Link to="/reviews">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Danh sách đánh giá
                                    </Button>
                                </Link>
                            </li>
                            <li className="w-full">
                                <Button
                                    className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3"
                                    onClick={() =>
                                        context.setIsOpenFullScreenPanel({
                                            open: true,
                                            model: 'Thêm đánh giá',
                                        })
                                    }
                                >
                                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                    Thêm đánh giá
                                </Button>
                            </li>
                        </ul>
                    </Collapse>
                </li>

                {/* Message */}
                {/* <li>
                    <Button
                        className="w-full !normal-case !justify-start gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]"
                        onClick={() => isOpenSubMenu(10)}
                    >
                        <LuMessageCircleMore className="text-[18px]" />
                        <Link to="/messages">Quản lý tin nhắn</Link>
                        <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
                            <FaAngleDown className={`transition-all ${submenuIndex === 10 ? 'rotate-180' : ''}`} />
                        </span>
                    </Button>

                    <Collapse isOpened={submenuIndex === 10 ? true : false}>
                        <ul className="w-full">
                            <li className="w-full">
                                <Link to="/messages">
                                    <Button className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3">
                                        <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                        Danh sách tin nhắn
                                    </Button>
                                </Link>
                            </li>
                            <li className="w-full">
                                <Button
                                    className="!text-[rgba(0,0,0,0.7)] !normal-case !justify-start !w-full text-[13px] !font-[500] !pl-9 flex gap-3"
                                    onClick={() =>
                                        context.setIsOpenFullScreenPanel({
                                            open: true,
                                            model: 'Thêm tin nhắn',
                                        })
                                    }
                                >
                                    <span className="block w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                                    Thêm tin nhắn
                                </Button>
                            </li>
                        </ul>
                    </Collapse>
                </li> */}

                <Divider />

                {/* Update info */}
                <li>
                    <Link to="/user-details">
                        <Button className="w-full !normal-case !justify-start gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]">
                            <LuUserRoundPen className="text-[20px]" />
                            Thông tin cá nhân
                        </Button>
                    </Link>
                </li>

                <li>
                    <Link to="/change-password">
                        <Button className="w-full !normal-case !justify-start gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]">
                            <IoKeyOutline className="text-[20px]" />
                            Đổi mật khẩu
                        </Button>
                    </Link>
                </li>

                <li>
                    <Button className="w-full !normal-case !justify-start gap-3 text-[14px] !text-[rgba(0,0,0,0.8)] !font-[500] items-center !py-2 hover:!bg-[#f1f1f1]">
                        <IoMdLogOut className="text-[20px] !text-[#ff5252]" />
                        <span className="!text-[#ff5252]">Đăng xuất</span>
                    </Button>
                </li>
            </ul>
        </div>
    );
};

export default SidebarComponent;
