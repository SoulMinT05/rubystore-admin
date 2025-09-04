import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import './DashboardPage.scss';
import DashboardBoxComponent from '../../components/DashboardBoxComponent/DashboardBoxComponent';

import imgDashboard from '../../assets/img-dashboard.webp';
import axiosClient from '../../apis/axiosClient';

const DashboardPage = () => {
    const [barChartData, setBarChartData] = useState([]);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const { data } = await axiosClient.get('/api/statistic/getMonthlyStatisticsBarChart');
                console.log('barChartData: ', data);
                if (data.success) {
                    setBarChartData(data?.barChartData);
                }
            } catch (error) {
                console.error('fetchChartData error:', error);
            }
        };
        fetchChartData();
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
            <div className="card my-4 shadow-md sm:rounded-lg bg-white">
                <div className="flex items-center justify-between px-5 py-5 pb-0">
                    <h2 className="text-[18px] font-[600]">Biểu đồ người dùng và doanh thu</h2>
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

                {/* Bar Chart */}
                <ResponsiveContainer width="100%" height={500}>
                    <LineChart
                        data={barChartData}
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
            </div>
        </>
    );
};

export default DashboardPage;
