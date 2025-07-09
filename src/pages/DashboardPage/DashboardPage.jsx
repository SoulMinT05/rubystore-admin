import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import './DashboardPage.scss';
import DashboardBoxComponent from '../../components/DashboardBoxComponent/DashboardBoxComponent';

import imgDashboard from '../../assets/img-dashboard.webp';

const DashboardPage = () => {
    const chartSimpleLineData = [
        {
            name: '1',
            'Tổng người dùng': 4000,
            'Tổng doanh thu': 2400,
            amt: 2400,
        },
        {
            name: '2',
            'Tổng người dùng': 3000,
            'Tổng doanh thu': 1398,
            amt: 2210,
        },
        {
            name: '3',
            'Tổng người dùng': 2000,
            'Tổng doanh thu': 9800,
            amt: 2290,
        },
        {
            name: '4',
            'Tổng người dùng': 2780,
            'Tổng doanh thu': 3908,
            amt: 2000,
        },
        {
            name: '5',
            'Tổng người dùng': 1890,
            'Tổng doanh thu': 4800,
            amt: 2181,
        },
        {
            name: '6',
            'Tổng người dùng': 2390,
            'Tổng doanh thu': 3800,
            amt: 2500,
        },
        {
            name: '7',
            'Tổng người dùng': 3490,
            'Tổng doanh thu': 4300,
            amt: 2100,
        },
        {
            name: '8',
            'Tổng người dùng': 2000,
            'Tổng doanh thu': 9800,
            amt: 2290,
        },
        {
            name: '9',
            'Tổng người dùng': 2780,
            'Tổng doanh thu': 3908,
            amt: 2000,
        },
        {
            name: '10',
            'Tổng người dùng': 1890,
            'Tổng doanh thu': 4800,
            amt: 2181,
        },
        {
            name: '11',
            'Tổng người dùng': 2390,
            'Tổng doanh thu': 3800,
            amt: 2500,
        },
        {
            name: '12',
            'Tổng người dùng': 3490,
            'Tổng doanh thu': 4300,
            amt: 2100,
        },
    ];

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

                <LineChart
                    width={1150}
                    height={500}
                    data={chartSimpleLineData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="none" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
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
            </div>
        </>
    );
};

export default DashboardPage;
