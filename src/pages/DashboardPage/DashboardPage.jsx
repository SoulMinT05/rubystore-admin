import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from 'recharts';

import './DashboardPage.scss';
import DashboardBoxComponent from '../../components/DashboardBoxComponent/DashboardBoxComponent';

import imgDashboard from '../../assets/img-dashboard.webp';
import axiosClient from '../../apis/axiosClient';

const statusMap = {
    pending: 'Chờ xác nhận',
    shipping: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy',
};

const colorMap = {
    pending: '#3872fa', // xanh dương
    shipping: '#facc15', // vàng
    delivered: '#10b981', // xanh lá
    cancelled: '#ef4444', // đỏ
};

const DashboardPage = () => {
    // const [lineChartData, setLineChartData] = useState([]);
    const [lineChartDataUserStaffAdmin, setLineChartDataUserStaffAdmin] = useState([]);
    const [revenueChartData, setRevenueChartData] = useState([]);
    const [pieChartOrderStatus, setPieChartOrderStatus] = useState([]);
    const [barChartDataProductCategoryOrderReview, setBarChartDataProductCategoryOrderReview] = useState([]);

    // useEffect(() => {
    //     const fetchBarChartData2 = async () => {
    //         try {
    //             const { data } = await axiosClient.get('/api/statistic/getMonthlyStatisticsBarChart2');
    //             console.log('lineChartData: ', data);
    //             if (data.success) {
    //                 setLineChartData(data?.barChartData);
    //             }
    //         } catch (error) {
    //             console.error('fetchBarChartData2 error:', error);
    //         }
    //     };
    //     fetchBarChartData2();
    // }, []);

    useEffect(() => {
        const fetchLineChartDataUserStaffAdmin = async () => {
            try {
                const { data } = await axiosClient.get('/api/statistic/getMonthlyStatisticsLineChartUserStaffAdmin');
                console.log('LineChartDataUserStaffAdmin: ', data);
                if (data.success) {
                    setLineChartDataUserStaffAdmin(data?.lineChartData);
                }
            } catch (error) {
                console.error('fetchLineChartDataUserStaffAdmin error:', error);
            }
        };
        fetchLineChartDataUserStaffAdmin();
    }, []);

    useEffect(() => {
        const fetchChartRevenue = async () => {
            try {
                const { data } = await axiosClient.get('/api/statistic/getMonthlyRevenueStatistics');
                console.log('revenueMonth: ', data);
                if (data.success) {
                    setRevenueChartData(data?.revenueChartData);
                }
            } catch (error) {
                console.error('fetchChartRevenue error:', error);
            }
        };
        fetchChartRevenue();
    }, []);

    useEffect(() => {
        const fetchPieChartOrderStatus = async () => {
            try {
                const { data } = await axiosClient.get('/api/statistic/getOrderStatusStatistics');
                console.log('orderStatusStat: ', data);
                if (data.success) {
                    setPieChartOrderStatus(data?.orderData);
                }
            } catch (error) {
                console.error('fetchPieChartOrderStatus error:', error);
            }
        };
        fetchPieChartOrderStatus();
    }, []);

    useEffect(() => {
        const fetchBarChartDataProductCategoryOrderReview = async () => {
            try {
                const { data } = await axiosClient.get(
                    '/api/statistic/getMonthlyStatisticsBarChartProductCategoryOrderReview'
                );
                console.log('barChartDataProductCategoryOrderReview: ', data);
                if (data.success) {
                    setBarChartDataProductCategoryOrderReview(data?.barChartData);
                }
            } catch (error) {
                console.error('fetchBarChartDataProductCategoryOrderReview error:', error);
            }
        };
        fetchBarChartDataProductCategoryOrderReview();
    }, []);

    return (
        <>
            <div className="w-full py-2 px-5 bg-white border border-[rgba(0,0,0,0.1)] flex items-center mb-5 gap-8 justify-between rounded-md">
                <div className="info">
                    <h1 className="text-[35px] font-bold leading-10 mb-3">
                        Chào buổi sáng, <br />
                        Tam Nguyen
                    </h1>
                    <p>Đây là những gì đã xảy ra trong ngày hôm nay. Cùng xem qua thống kê nhé!</p>
                </div>

                <img src={imgDashboard} alt="" className="w-[250px]" />
            </div>
            <DashboardBoxComponent />
            {/* Line Chart between Users and Revenues */}
            {/* <div className="card my-4 shadow-md sm:rounded-lg bg-white">
                <div className="flex items-center justify-between px-5 py-5 pb-0">
                    <h2 className="text-[18px] font-[600]">Biểu đồ số lượng người dùng và doanh thu</h2>
                </div>

                <div className="flex items-center gap-5 px-5 py-5 pt-1">
                    <span className="flex items-center gap-1 text-[15px]">
                        <span className="block w-[8px] h-[8px] rounded-full bg-[#10b981]"></span>
                        Tổng người dùng
                    </span>
                    <span className="flex items-center gap-1 text-[15px]">
                        <span className="block w-[8px] h-[8px] rounded-full bg-[#3872fa]"></span>
                        Tổng doanh thu
                    </span>
                </div>

                <ResponsiveContainer width="100%" height={500}>
                    <LineChart
                        data={lineChartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="none" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) =>
                                new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(value)
                            }
                        />
                        <Tooltip
                            formatter={(value, name) => {
                                if (name === 'Tổng doanh thu') {
                                    return new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(value);
                                }
                                return value;
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="Tổng người dùng"
                            stroke="#10b981"
                            strokeWidth={3}
                            activeDot={{ r: 8 }}
                        />
                        <Line type="monotone" dataKey="Tổng doanh thu" stroke="#3872fa" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div> */}
            {/* User, staff, admin */}
            <div className="card my-4 shadow-md sm:rounded-lg bg-white">
                <div className="flex items-center justify-between px-5 py-5 pb-0">
                    <h2 className="text-[18px] font-[600]">Biểu đồ số lượng người dùng, nhân viên và quản lý</h2>
                </div>

                <div className="flex items-center gap-5 px-5 py-5 pt-1">
                    <span className="flex items-center gap-1 text-[15px]">
                        <span className="block w-[8px] h-[8px] rounded-full bg-[#f97316]"></span>
                        Tổng người dùng
                    </span>
                    <span className="flex items-center gap-1 text-[15px]">
                        <span className="block w-[8px] h-[8px] rounded-full bg-[#3872fa]"></span>
                        Tổng nhân viên
                    </span>
                    <span className="flex items-center gap-1 text-[15px]">
                        <span className="block w-[8px] h-[8px] rounded-full bg-[#10b981]"></span>
                        Tổng quản lý
                    </span>
                </div>

                {/* Line Chart */}
                <ResponsiveContainer width="100%" height={500}>
                    <LineChart
                        data={lineChartDataUserStaffAdmin}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="none" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) =>
                                new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(value)
                            }
                        />
                        <Tooltip
                            formatter={(value, name) => {
                                if (name === 'Tổng doanh thu') {
                                    return new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(value);
                                }
                                return value;
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="Tổng người dùng"
                            stroke="#f97316"
                            strokeWidth={3}
                            activeDot={{ r: 8 }}
                        />
                        <Line type="monotone" dataKey="Tổng nhân viên" stroke="#3872fa" strokeWidth={3} />
                        <Line type="monotone" dataKey="Tổng quản lý" stroke="#10b981" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {/* Revenue */}
            <div className="card my-4 shadow-md sm:rounded-lg bg-white">
                <div className="flex items-center justify-between px-5 py-5 pb-0">
                    <h2 className="text-[18px] font-[600]">Biểu đồ doanh thu</h2>
                </div>

                <ResponsiveContainer width="100%" height={500}>
                    <AreaChart
                        data={revenueChartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis tick={{ fontSize: 12 }} dataKey="name" />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) =>
                                new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(value)
                            }
                        />
                        <Tooltip
                            formatter={(value) =>
                                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
                            }
                        />
                        <Area type="monotone" dataKey="Tổng doanh thu" stroke="#3872fa" fill="#93c5fd" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            {/* Order status */}
            <div className="card my-4 shadow-md sm:rounded-lg bg-white">
                <div className="flex items-center justify-between px-5 py-5 pb-0">
                    <h2 className="text-[18px] font-[600]">Biểu đồ trạng thái đơn hàng</h2>
                </div>

                {/* Chú thích */}
                <div className="flex flex-wrap items-center gap-5 px-5 py-5 pt-1">
                    {Object.entries(statusMap).map(([key, label]) => (
                        <span key={key} className="flex items-center gap-1 text-[15px]">
                            <span
                                className="block w-[8px] h-[8px] rounded-full"
                                style={{ backgroundColor: colorMap[key] }}
                            ></span>
                            {label}
                        </span>
                    ))}
                </div>

                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={pieChartOrderStatus.map((item) => ({
                                ...item,
                                status: statusMap[item.status] || item.status, // đổi status sang tiếng Việt
                            }))}
                            dataKey="total"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            label
                        >
                            {pieChartOrderStatus.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colorMap[entry.status] || '#8b5cf6'} />
                            ))}
                        </Pie>
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white p-2 rounded shadow-md text-sm">
                                            {payload.map((entry, index) => {
                                                return (
                                                    <div key={`item-${index}`} className="flex items-center gap-2">
                                                        <span
                                                            className="block w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: entry.payload.fill }}
                                                        ></span>
                                                        <span style={{ color: entry.payload.fill, fontWeight: 500 }}>
                                                            {entry.name}: {entry.value}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {/* Product, category, order, review */}
            <div className="card my-4 shadow-md sm:rounded-lg bg-white">
                <div className="flex items-center justify-between px-5 py-5 pb-0">
                    <h2 className="text-[18px] font-[600]">
                        Biểu đồ số lượng sản phẩm, danh mục, đơn hàng và đánh giá
                    </h2>
                </div>

                <div className="flex items-center gap-5 px-5 py-5 pt-1">
                    <span className="flex items-center gap-1 text-[15px]">
                        <span className="block w-[8px] h-[8px] rounded-full bg-[#10b981]"></span>
                        Tổng sản phẩm
                    </span>
                    <span className="flex items-center gap-1 text-[15px]">
                        <span className="block w-[8px] h-[8px] rounded-full bg-[#3872fa]"></span>
                        Tổng danh mục
                    </span>
                    <span className="flex items-center gap-1 text-[15px]">
                        <span className="block w-[8px] h-[8px] rounded-full bg-[#f97316]"></span>
                        Tổng đơn hàng
                    </span>
                    <span className="flex items-center gap-1 text-[15px]">
                        <span className="block w-[8px] h-[8px] rounded-full bg-[#9333ea]"></span>
                        Tổng đánh giá
                    </span>
                </div>

                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={barChartDataProductCategoryOrderReview}>
                        <CartesianGrid strokeDasharray="3 3" stroke="none" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />

                        <Bar dataKey="Tổng sản phẩm" fill="#10b981" />
                        <Bar dataKey="Tổng danh mục" fill="#3872fa" />
                        <Bar dataKey="Tổng đơn hàng" fill="#f97316" />
                        <Bar dataKey="Tổng đánh giá" fill="#9333ea" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

export default DashboardPage;
