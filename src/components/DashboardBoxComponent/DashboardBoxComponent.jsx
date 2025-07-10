import React, { useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import { FaUser } from 'react-icons/fa';
import { FaUserCheck } from 'react-icons/fa';
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

import { AiTwotoneGift, AiTwotonePieChart } from 'react-icons/ai';
import { IoStatsChartSharp } from 'react-icons/io5';
import { BsBank } from 'react-icons/bs';

import './DashboardBoxComponent.scss';
import axiosClient from '../../apis/axiosClient';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

const DashboardBoxComponent = () => {
    const [statistics, setStatistics] = useState({});
    useEffect(() => {
        const getStatistics = async () => {
            const { data } = await axiosClient.get('/api/statistic/getDashboardStatistics');
            console.log('dataStatis: ', data);
            if (data.success) {
                setStatistics(data?.statistics);
            }
        };
        getStatistics();
    }, []);
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                    <FaUser className="text-[40px] text-[#10b981]" />
                    <div className="info w-[70%]">
                        <h3>Người dùng</h3>
                        <b>{statistics?.totalUsers}</b>
                    </div>
                    <IoStatsChartSharp className="text-[50px] text-[#10b981]" />
                </div>
                <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                    <FaUserCheck className="text-[50px] text-[#3b82f6]" />
                    <div className="info w-[70%]">
                        <h3>Nhân viên / Quản lý</h3>
                        <b>{statistics?.totalStaffs}</b>
                    </div>
                    <IoStatsChartSharp className="text-[50px] text-[#3b82f6]" />
                </div>
                <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                    <RiProductHuntLine className="text-[40px] text-[#f97316]" />
                    <div className="info w-[70%]">
                        <h3>Sản phẩm</h3>
                        <b>{statistics?.totalProducts}</b>
                    </div>
                    <IoStatsChartSharp className="text-[30px] text-[#f97316]" />
                </div>
                <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                    <TbCategory className="text-[40px] text-[#8b5cf6]" />
                    <div className="info w-[70%]">
                        <h3>Danh mục</h3>
                        <b>{statistics?.totalCategories}</b>
                    </div>
                    <IoStatsChartSharp className="text-[30px] text-[#8b5cf6]" />
                </div>
                <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                    <AiTwotoneGift className="text-[40px] text-[#facc15]" />
                    <div className="info w-[70%]">
                        <h3>Đơn hàng</h3>
                        <b>{statistics?.totalOrders}</b>
                    </div>
                    <IoStatsChartSharp className="text-[50px] text-[#facc15]" />
                </div>
                <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                    <RiCoupon2Line className="text-[40px] text-[#ec4899]" />
                    <div className="info w-[70%]">
                        <h3>Voucher</h3>
                        <b>{statistics?.totalVouchers}</b>
                    </div>
                    <IoStatsChartSharp className="text-[50px] text-[#ec4899]" />
                </div>
                <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                    <BsBank className="text-[40px] text-[#0ea5e9]" />
                    <div className="info w-[70%]">
                        <h3>Doanh thu</h3>
                        <b>{formatCurrency(statistics?.totalRevenue)}</b>
                    </div>
                    <IoStatsChartSharp className="text-[50px] text-[#0ea5e9]" />
                </div>

                <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                    <RiBloggerLine className="text-[40px] text-[#22c55e]" />
                    <div className="info w-[70%]">
                        <h3>Bài viết</h3>
                        <b>{statistics?.totalBlogs}</b>
                    </div>
                    <IoStatsChartSharp className="text-[50px] text-[#22c55e]" />
                </div>
                <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                    <FaRegComments className="text-[40px] text-[#e11d48]" />
                    <div className="info w-[70%]">
                        <h3>Đánh giá</h3>
                        <b>{statistics?.totalReviews}</b>
                    </div>
                    <IoStatsChartSharp className="text-[50px] text-[#e11d48]" />
                </div>
                <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                    <LuMessageCircleMore className="text-[40px] text-[#6366f1]" />
                    <div className="info w-[70%]">
                        <h3>Tin nhắn</h3>
                        <b>{statistics?.totalMessages || 0}</b>
                    </div>
                    <IoStatsChartSharp className="text-[50px] text-[#6366f1]" />
                </div>
            </div>
            {/* <Swiper
                slidesPerView={4}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                className="dashboardBoxesSlider"
            >
                <SwiperSlide>
                    <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                        <AiTwotonePieChart className="text-[50px] text-[#10b981]" />
                        <div className="info w-[70%]">
                            <h3>Người dùng</h3>
                            <b>20</b>
                        </div>
                        <IoStatsChartSharp className="text-[50px] text-[#10b981]" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                        <AiTwotonePieChart className="text-[50px] text-[#10b981]" />
                        <div className="info w-[70%]">
                            <h3>Nhân viên / Quản lý</h3>
                            <b>20</b>
                        </div>
                        <IoStatsChartSharp className="text-[50px] text-[#10b981]" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                        <RiProductHuntLine className="text-[40px] text-[#312be1d8]" />
                        <div className="info w-[70%]">
                            <h3>Sản phẩm</h3>
                            <b>{formatCurrency(20000000)}</b>
                        </div>
                        <IoStatsChartSharp className="text-[30px] text-[#312be1d8]" />
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                        <AiTwotoneGift className="text-[40px] text-[#3872fa]" />
                        <div className="info w-[70%]">
                            <h3>Đơn hàng</h3>
                            <b>{formatCurrency(20000000)}</b>
                        </div>
                        <IoStatsChartSharp className="text-[50px] text-[#3872fa]" />
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                        <BsBank className="text-[40px] text-[#7928ca]" />
                        <div className="info w-[70%]">
                            <h3>Doanh thu</h3>
                            <b>{formatCurrency(200000000)}</b>
                        </div>
                        <IoStatsChartSharp className="text-[50px] text-[#7928ca]" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                        <div className="info w-[70%]">
                            <h3>Voucher</h3>
                            <b>{formatCurrency(200000000)}</b>
                        </div>
                        <IoStatsChartSharp className="text-[50px] text-[#7928ca]" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                        
                        <div className="info w-[70%]">
                            <h3>Bài viết</h3>
                            <b>{formatCurrency(200000000)}</b>
                        </div>
                        <IoStatsChartSharp className="text-[50px] text-[#7928ca]" />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="box bg-white p-5 cursor-pointer hover:bg-[#f1faff] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
                        
                        <div className="info w-[70%]">
                            <h3>Đánh giá</h3>
                            <b>{formatCurrency(200000000)}</b>
                        </div>
                        <IoStatsChartSharp className="text-[50px] text-[#7928ca]" />
                    </div>
                </SwiperSlide>
            </Swiper> */}
        </>
    );
};

export default DashboardBoxComponent;
