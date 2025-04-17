import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import { AiTwotoneGift, AiTwotonePieChart } from 'react-icons/ai';
import { IoStatsChartSharp } from 'react-icons/io5';
import { BsBank } from 'react-icons/bs';
import { RiProductHuntLine } from 'react-icons/ri';

import './DashboardBoxComponent.scss';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

const DashboardBoxComponent = () => {
    return (
        <>
            <Swiper
                slidesPerView={4}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                className="dashboardBoxesSlider"
            >
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
                        <AiTwotonePieChart className="text-[50px] text-[#10b981]" />
                        <div className="info w-[70%]">
                            <h3>Giảm giá</h3>
                            <b>{formatCurrency(20000000)}</b>
                        </div>
                        <IoStatsChartSharp className="text-[50px] text-[#10b981]" />
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
            </Swiper>
        </>
    );
};

export default DashboardBoxComponent;
