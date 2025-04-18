import React, { useState, PureComponent, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import './DashboardPage.scss';
import DashboardBoxComponent from '../../components/DashboardBoxComponent/DashboardBoxComponent';
import { FaPlus } from 'react-icons/fa6';
import { Button, Divider, MenuItem, Pagination, Rating, Select } from '@mui/material';
import TooltipMUI from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import { IoCloseSharp } from 'react-icons/io5';
import { BiExport } from 'react-icons/bi';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

import BadgeOrderStatusComponent from '../../components/BadgeOrderStatusComponent/BadgeOrderStatusComponent';
import imgDashboard from '../../assets/img-dashboard.webp';
import { Link } from 'react-router-dom';
import ProgressProductStatusComponent from '../../components/ProgressProductStatusComponent/ProgressProductStatusComponent';

import { AiOutlineEdit } from 'react-icons/ai';
import { FaRegEye } from 'react-icons/fa6';
import { GoTrash } from 'react-icons/go';
import { MyContext } from '../../App';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// const columns = [
//     { id: 'product', label: 'SẢN PHẨM', minWidth: 150 },
//     { id: 'category', label: 'DANH MỤC', minWidth: 100 },
//     { id: 'subcategory', label: 'DANH MỤC CON', minWidth: 150 },
//     { id: 'price', label: 'GIÁ', minWidth: 130 },
//     { id: 'status', label: 'TÌNH TRẠNG', minWidth: 100 },
//     { id: 'rating', label: 'XẾP HẠNG', minWidth: 100 },
//     { id: 'action', label: 'HÀNH ĐỘNG', minWidth: 120 },
// ];

// function createData(name, code, population, size) {
//     const density = population / size;
//     return { name, code, population, size, density };
// }

// const rows = [
//     createData('India', 'IN', 1324171354, 3287263),
//     createData('China', 'CN', 1403500365, 9596961),
//     createData('Italy', 'IT', 60483973, 301340),
//     createData('United States', 'US', 327167434, 9833520),
//     createData('Canada', 'CA', 37602103, 9984670),
//     createData('Australia', 'AU', 25475400, 7692024),
//     createData('Germany', 'DE', 83019200, 357578),
//     createData('Ireland', 'IE', 4857000, 70273),
//     createData('Mexico', 'MX', 126577691, 1972550),
//     createData('Japan', 'JP', 126317000, 377973),
//     createData('France', 'FR', 67022000, 640679),
//     createData('United Kingdom', 'GB', 67545757, 242495),
//     createData('Russia', 'RU', 146793744, 17098246),
//     createData('Nigeria', 'NG', 200962417, 923768),
//     createData('Brazil', 'BR', 210147125, 8515767),
// ];

const DashboardPage = () => {
    const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
    const context = useContext(MyContext);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    // const [page, setPage] = React.useState(0);
    // const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(+event.target.value);
    //     setPage(0);
    // };

    const [categoryFilterVal, setCaterogyFilterVal] = useState('');
    // const [chartSimpleLineData, setChartSimpleLineData] = useState([
    //     {
    //         name: '1',
    //         'Tổng người dùng': 4000,
    //         'Tổng doanh thu': 2400,
    //         amt: 2400,
    //     },
    //     {
    //         name: '2',
    //         'Tổng người dùng': 3000,
    //         'Tổng doanh thu': 1398,
    //         amt: 2210,
    //     },
    //     {
    //         name: '3',
    //         'Tổng người dùng': 2000,
    //         'Tổng doanh thu': 9800,
    //         amt: 2290,
    //     },
    //     {
    //         name: '4',
    //         'Tổng người dùng': 2780,
    //         'Tổng doanh thu': 3908,
    //         amt: 2000,
    //     },
    //     {
    //         name: '5',
    //         'Tổng người dùng': 1890,
    //         'Tổng doanh thu': 4800,
    //         amt: 2181,
    //     },
    //     {
    //         name: '6',
    //         'Tổng người dùng': 2390,
    //         'Tổng doanh thu': 3800,
    //         amt: 2500,
    //     },
    //     {
    //         name: '7',
    //         'Tổng người dùng': 3490,
    //         'Tổng doanh thu': 4300,
    //         amt: 2100,
    //     },
    //     {
    //         name: '8',
    //         'Tổng người dùng': 2000,
    //         'Tổng doanh thu': 9800,
    //         amt: 2290,
    //     },
    //     {
    //         name: '9',
    //         'Tổng người dùng': 2780,
    //         'Tổng doanh thu': 3908,
    //         amt: 2000,
    //     },
    //     {
    //         name: '10',
    //         'Tổng người dùng': 1890,
    //         'Tổng doanh thu': 4800,
    //         amt: 2181,
    //     },
    //     {
    //         name: '11',
    //         'Tổng người dùng': 2390,
    //         'Tổng doanh thu': 3800,
    //         amt: 2500,
    //     },
    //     {
    //         name: '12',
    //         'Tổng người dùng': 3490,
    //         'Tổng doanh thu': 4300,
    //         amt: 2100,
    //     },
    // ]);

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
    const handleChangeCaterogyFilterVal = (event) => {
        setCaterogyFilterVal(event.target.value);
    };

    const handleCloseProductDetailsModal = () => {
        setOpenProductDetailsModal(false);
    };
    const printPDF = async () => {
        const element = document.getElementById('order-details-admin');
        if (!element) {
            console.error('Không tìm thấy element');
            return;
        }

        // Đảm bảo ảnh đã load xong
        const images = element.querySelectorAll('img');
        await Promise.all(
            Array.from(images).map((img) => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }),
        );

        // Delay nhỏ để chắc chắn ảnh được render hoàn chỉnh
        setTimeout(async () => {
            try {
                const canvas = await html2canvas(element, {
                    useCORS: true,
                    scale: 2,
                    backgroundColor: '#ffffff', // fix background nếu transparent
                });

                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const pdf = new jsPDF('p', 'mm', 'a4');

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('order-details-admin.pdf');
            } catch (err) {
                console.error('Lỗi tạo PDF:', err);
            }
        }, 300);
    };

    return (
        <>
            <div className="w-full py-2 px-5 bg-white border border-[rgba(0,0,0,0.1)] flex items-center mb-5 gap-8 justify-between rounded-md">
                <div className="info">
                    <h1 className="text-[35px] font-bold leading-10 mb-3">
                        Chào buổi sáng, <br />
                        Tam Nguyen
                    </h1>
                    <p>Đây là những gì đã xảy ra trong ngày hôm nay. Cùng xem qua thống kê nhé!</p>
                    <br />
                    <Button
                        className="btn-blue !normal-case !gap-2"
                        onClick={() =>
                            context.setIsOpenFullScreenPanel({
                                open: true,
                                model: 'Thêm sản phẩm',
                            })
                        }
                    >
                        <FaPlus />
                        Thêm sản phẩm
                    </Button>
                </div>

                <img src={imgDashboard} alt="" className="w-[250px]" />
            </div>

            <DashboardBoxComponent />

            <div className="card my-4 shadow-md sm:rounded-lg bg-white">
                <div className="flex items-center justify-between px-5 py-5">
                    <h2 className="text-[18px] font-[600]">Sản phẩm mới nhất (Tailwind CSS)</h2>
                </div>

                <div className="flex items-center w-full justify-between pl-5 pr-5">
                    <div className="col w-[20%]">
                        <h4 className="font-[600] text-[13px] mb-2">Phân loại theo</h4>

                        <Select
                            className="w-full"
                            size="small"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={categoryFilterVal}
                            label="Danh mục"
                            onChange={handleChangeCaterogyFilterVal}
                        >
                            <MenuItem value={10}>Nam</MenuItem>
                            <MenuItem value={20}>Nữ</MenuItem>
                            <MenuItem value={30}>Trẻ em</MenuItem>
                        </Select>
                    </div>

                    <div
                        className={`col ${
                            context.isisOpenSidebar === true ? 'w-[25%]' : 'w-[22%]'
                        }] ml-auto flex items-center gap-3`}
                    >
                        <Button className="btn !bg-green-500 !text-white !normal-case gap-1">
                            <BiExport />
                            Xuất file
                        </Button>
                        <Button
                            className="btn-blue !text-white !normal-case"
                            onClick={() =>
                                context.setIsOpenFullScreenPanel({
                                    open: true,
                                    model: 'Thêm sản phẩm',
                                })
                            }
                        >
                            Thêm sản phẩm
                        </Button>
                    </div>
                </div>

                <div className="relative overflow-x-auto mt-1 pb-5">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                        <thead className="text-xs text-gray-700 uppercase bg-white">
                            <tr>
                                <th scope="col" className="px-6 pr-0 py-2 ">
                                    <div className="w-[60px]">
                                        <Checkbox {...label} size="small" />
                                    </div>
                                </th>
                                <th scope="col" className="px-0 py-3 whitespace-nowrap">
                                    Sản phẩm
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Danh mục
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Danh mục con
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Giá
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Tình trạng
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Xếp hạng
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="odd:bg-white  even:bg-gray-50 border-b">
                                <td className="px-6 pr-0 py-2">
                                    <div className="w-[60px]">
                                        <Checkbox {...label} size="small" />
                                    </div>
                                </td>
                                <td className="px-0 py-2">
                                    <div className="flex items-center gap-4 w-[330px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                            <Link to="/product/2">
                                                <img
                                                    src="https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg"
                                                    className="w-full group-hover:scale-105 transition-all"
                                                    alt=""
                                                />
                                            </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="text-[12px] font-[600] leading-4 hover:text-primary transition-all">
                                                <Link to="/product/2">
                                                    Váy dạ tiệc xinh màu đen quý phái hiện đại Dior | Louis Vuitton
                                                </Link>
                                            </h3>
                                            <span className="text-[12px]">Váy</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="w-[80px]">Thời trang</p>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="w-[80px]">Phụ nữ</p>
                                </td>
                                <td className="px-6 py-2">
                                    <div className="flex gap-1 flex-col">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px] font-[500]">
                                            {formatCurrency(200000)}
                                        </span>
                                        <span className="price text-primary text-[14px] font-[600]">
                                            {formatCurrency(180000)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="text-[14px] w-[130px]">
                                        <span className="font-[600]">Còn hàng </span>
                                        (500)
                                    </p>
                                    <ProgressProductStatusComponent value={8} status="draft" />
                                </td>
                                <td className="px-6 py-2">
                                    <Rating name="size-small" defaultValue={4.7} readOnly size="small" />
                                </td>
                                <td className="px-6 py-2">
                                    <div className="flex items-center gap-1">
                                        <TooltipMUI title="Chỉnh sửa" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                                            </Button>
                                        </TooltipMUI>
                                        <TooltipMUI title="Xem chi tiết" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                            </Button>
                                        </TooltipMUI>
                                        <TooltipMUI title="Xoá" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                            </Button>
                                        </TooltipMUI>
                                    </div>
                                </td>
                            </tr>

                            <tr className="odd:bg-white  even:bg-gray-50 border-b">
                                <td className="px-6 pr-0 py-2">
                                    <div className="w-[60px]">
                                        <Checkbox {...label} size="small" />
                                    </div>
                                </td>
                                <td className="px-0 py-2">
                                    <div className="flex items-center gap-4 w-[330px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                            <Link to="/product/2">
                                                <img
                                                    src="https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg"
                                                    className="w-full group-hover:scale-105 transition-all"
                                                    alt=""
                                                />
                                            </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="text-[12px] font-[600] leading-4 hover:text-primary transition-all">
                                                <Link to="/product/2">
                                                    Váy dạ tiệc xinh màu đen quý phái hiện đại Dior | Louis Vuitton
                                                </Link>
                                            </h3>
                                            <span className="text-[12px]">Váy</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="w-[80px]">Thời trang</p>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="w-[80px]">Phụ nữ</p>
                                </td>
                                <td className="px-6 py-2">
                                    <div className="flex gap-1 flex-col">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px] font-[500]">
                                            {formatCurrency(200000)}
                                        </span>
                                        <span className="price text-primary text-[14px] font-[600]">
                                            {formatCurrency(180000)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="text-[14px] w-[130px]">
                                        <span className="font-[600]">Còn hàng </span>
                                        (500)
                                    </p>
                                    <ProgressProductStatusComponent value={8} status="draft" />
                                </td>
                                <td className="px-6 py-2">
                                    <Rating name="size-small" defaultValue={4.7} readOnly size="small" />
                                </td>
                                <td className="px-6 py-2">
                                    <div className="flex items-center gap-1">
                                        <TooltipMUI title="Chỉnh sửa" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                                            </Button>
                                        </TooltipMUI>
                                        <TooltipMUI title="Xem chi tiết" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                            </Button>
                                        </TooltipMUI>
                                        <TooltipMUI title="Xoá" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                            </Button>
                                        </TooltipMUI>
                                    </div>
                                </td>
                            </tr>
                            <tr className="odd:bg-white  even:bg-gray-50 border-b">
                                <td className="px-6 pr-0 py-2">
                                    <div className="w-[60px]">
                                        <Checkbox {...label} size="small" />
                                    </div>
                                </td>
                                <td className="px-0 py-2">
                                    <div className="flex items-center gap-4 w-[330px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                            <Link to="/product/2">
                                                <img
                                                    src="https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg"
                                                    className="w-full group-hover:scale-105 transition-all"
                                                    alt=""
                                                />
                                            </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="text-[12px] font-[600] leading-4 hover:text-primary transition-all">
                                                <Link to="/product/2">
                                                    Váy dạ tiệc xinh màu đen quý phái hiện đại Dior | Louis Vuitton
                                                </Link>
                                            </h3>
                                            <span className="text-[12px]">Váy</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="w-[80px]">Thời trang</p>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="w-[80px]">Phụ nữ</p>
                                </td>
                                <td className="px-6 py-2">
                                    <div className="flex gap-1 flex-col">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px] font-[500]">
                                            {formatCurrency(200000)}
                                        </span>
                                        <span className="price text-primary text-[14px] font-[600]">
                                            {formatCurrency(180000)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="text-[14px] w-[130px]">
                                        <span className="font-[600]">Còn hàng </span>
                                        (500)
                                    </p>
                                    <ProgressProductStatusComponent value={8} status="draft" />
                                </td>
                                <td className="px-6 py-2">
                                    <Rating name="size-small" defaultValue={4.7} readOnly size="small" />
                                </td>
                                <td className="px-6 py-2">
                                    <div className="flex items-center gap-1">
                                        <TooltipMUI title="Chỉnh sửa" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                                            </Button>
                                        </TooltipMUI>
                                        <TooltipMUI title="Xem chi tiết" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                            </Button>
                                        </TooltipMUI>
                                        <TooltipMUI title="Xoá" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                            </Button>
                                        </TooltipMUI>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-center pt-5 pb-5 px-4">
                    <Pagination count={10} color="primary" />
                </div>
            </div>

            {/* <div className="card my-4 shadow-md sm:rounded-lg bg-white">
                <div className="flex items-center justify-between px-5 py-5">
                    <h2 className="text-[18px] font-[600]">Sản phẩm mới nhất (Material UI)</h2>
                </div>

                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Checkbox {...label} size="small" />
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    {' '}
                                    <Checkbox {...label} size="small" />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex items-center gap-4 w-[330px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                            <Link to="/product/2">
                                                <img
                                                    src="https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg"
                                                    className="w-full group-hover:scale-105 transition-all"
                                                    alt=""
                                                />
                                            </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="text-[12px] font-[600] leading-4 hover:text-primary transition-all">
                                                <Link to="/product/2">
                                                    Váy dạ tiệc xinh màu đen quý phái hiện đại Dior | Louis Vuitton
                                                </Link>
                                            </h3>
                                            <span className="text-[12px]">Váy</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className="w-[80px]">Thời trang</p>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className="w-[80px]">Phụ nữ</p>
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex gap-1 flex-col">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px] font-[500]">
                                            {formatCurrency(200000)}
                                        </span>
                                        <span className="price text-primary text-[14px] font-[600]">
                                            {formatCurrency(180000)}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <p className="text-[14px] w-[130px]">
                                        <span className="font-[600]">Còn hàng </span>
                                        (500)
                                    </p>
                                    <ProgressProductStatusComponent value={8} status="draft" />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <Rating name="size-small" defaultValue={4.7} readOnly size="small" />
                                </TableCell>
                                <TableCell style={{ minWidth: columns.minWidth }}>
                                    <div className="flex items-center gap-1">
                                        <TooltipMUI title="Chỉnh sửa" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                                            </Button>
                                        </TooltipMUI>
                                        <TooltipMUI title="Xem chi tiết" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                            </Button>
                                        </TooltipMUI>
                                        <TooltipMUI title="Xoá" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                            </Button>
                                        </TooltipMUI>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <div className="flex items-center justify-end pt-5 pb-5 px-4">
                    <Pagination count={10} color="primary" />
                </div>
            </div> */}

            {/* Latest Orders */}
            <div className="card my-4 shadow-md sm:rounded-lg bg-white">
                <div className="flex items-center justify-between px-5 py-5">
                    <h2 className="text-[18px] font-[600]">Đơn hàng mới nhất</h2>
                </div>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                        <thead className="text-xs text-gray-700 uppercase bg-white">
                            <tr>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Sản phẩm
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Order ID
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Phương thức thanh toán
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Họ và tên
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Số điện thoại
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Địa chỉ
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Tổng tiền
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Trạng thái
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Ngày đặt hàng
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border-b">
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 items-center rounded-md overflow-hidden group">
                                        <img
                                            src="https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg"
                                            alt=""
                                            className="w-[70px] h-[70px] object-cover rounded-md group-hover:scale-105 transition-all cursor-pointer"
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-primary font-[600]">6b9283273230ase</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-primary font-[600]">Tiền mặt</span>
                                </td>
                                <td className="px-6 py-4">Tam Nguyen</td>
                                <td className="px-6 py-4">tamnguyenforwork@gmail.com</td>
                                <td className="px-6 py-4">02199232323</td>
                                <td className="px-6 py-4">
                                    <span className="block w-[400px]">
                                        137 Trần Hoà Bình, Phường 17, Quận Gò Vấp, Thành phố Hồ Chí Minh
                                    </span>
                                </td>
                                <td className="px-6 py-4">{formatCurrency(250000)}</td>
                                <td className="px-6 py-4">
                                    <BadgeOrderStatusComponent status="success" />
                                </td>
                                <td className="px-6 py-4">{formatDate('2025-04-10')}</td>
                                <td
                                    className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                    onClick={() => setOpenProductDetailsModal(true)}
                                >
                                    <span className="text-gray-500 link transition-all">Xem chi tiết</span>
                                </td>
                            </tr>
                        </tbody>
                        <Dialog
                            fullWidth={true}
                            maxWidth="lg"
                            open={openProductDetailsModal}
                            onClose={handleCloseProductDetailsModal}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            className="productDetailsModal"
                        >
                            <DialogContent>
                                <div className="bg-[#fff] p-4 container">
                                    <div className="flex items-center w-full productDetailsModalContainer relative">
                                        <Button
                                            className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[-8px] right-[-12px] !bg-[#f1f1f1]"
                                            onClick={handleCloseProductDetailsModal}
                                        >
                                            <IoCloseSharp className="text-[20px]" />
                                        </Button>

                                        <div
                                            className="container bg-white p-6 rounded-lg shadow-md"
                                            id="order-details-admin"
                                        >
                                            <h2 className="text-gray-700 text-xl border-b pb-4 mb-4 font-[600]">
                                                Chi tiết đơn hàng
                                            </h2>
                                            <h3 className="text-gray-700 text-lg font-[600] mt-6 mb-4">
                                                Thông tin đơn hàng
                                            </h3>
                                            {/* Order Info */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Order ID</span>
                                                    <span className="text-gray-700">6b9283273230ase</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Phương thức thanh toán</span>
                                                    <span className="text-gray-700">Tiền mặt</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Ngày đặt hàng</span>
                                                    <span className="text-gray-700">24 November 2023</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Trạng thái</span>
                                                    <span className="text-gray-700">
                                                        <BadgeOrderStatusComponent status="success" />
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Customer Info */}
                                            <h3 className="text-gray-700 text-xl pb-4 mb-1 mt-6 font-[600]">
                                                Thông tin khách hàng
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Họ và tên</span>
                                                    <span className="text-gray-700">Tam Soo</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Email</span>
                                                    <span className="text-gray-700">name@example.com</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Số điện thoại</span>
                                                    <span className="text-gray-700">+123 456 7890</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Địa chỉ</span>
                                                    <span className="text-gray-700">
                                                        62 Miles Drive St, Newark, NJ 07103, California
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <h3 className="text-gray-700 text-xl pb-4 mb-1 mt-6 font-[600]">
                                                Thông tin sản phẩm
                                            </h3>
                                            <div className="mt-4">
                                                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                                                    <div className="w-[20%] group cursor-pointer">
                                                        <img
                                                            alt="Image of an Apple iMac"
                                                            className="w-[70px] h-[70px] object-cover rounded-md mr-4 group-hover:scale-105 transition-all"
                                                            src="https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg"
                                                        />
                                                    </div>
                                                    <div className="mx-4 w-[60%]">
                                                        <p className="text-gray-700">
                                                            PC system All in One APPLE iMac (2023) mqrq3ro/a, Apple M3,
                                                            24" Retina 4.5K, 8GB, SSD 256GB, 10-core GPU, macOS Sonoma,
                                                            Blue, Keyboard layout INT
                                                        </p>
                                                    </div>
                                                    <div className="w-[20%] flex items-center justify-end gap-5">
                                                        <p className="text-gray-700">x1</p>
                                                        <p className="text-gray-700 font-[600]">
                                                            {formatCurrency(3000000)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                                                    <div className="w-[20%] group cursor-pointer">
                                                        <img
                                                            alt="Image of an Apple iMac"
                                                            className="w-[70px] h-[70px] object-cover rounded-md mr-4 group-hover:scale-105 transition-all"
                                                            src="https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg"
                                                        />
                                                    </div>
                                                    <div className="mx-4 w-[60%]">
                                                        <p className="text-gray-700">
                                                            PC system All in One APPLE iMac (2023) mqrq3ro/a, Apple M3,
                                                            24" Retina 4.5K, 8GB, SSD 256GB, 10-core GPU, macOS Sonoma,
                                                            Blue, Keyboard layout INT
                                                        </p>
                                                    </div>
                                                    <div className="w-[20%] flex items-center justify-end gap-5">
                                                        <p className="text-gray-700">x1</p>
                                                        <p className="text-gray-700 font-[600]">
                                                            {formatCurrency(3000000)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                                                    <div className="w-[20%] group cursor-pointer">
                                                        <img
                                                            alt="Image of an Apple iMac"
                                                            className="w-[70px] h-[70px] object-cover rounded-md mr-4 group-hover:scale-105 transition-all"
                                                            src="https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg"
                                                        />
                                                    </div>
                                                    <div className="mx-4 w-[60%]">
                                                        <p className="text-gray-700">
                                                            PC system All in One APPLE iMac (2023) mqrq3ro/a, Apple M3,
                                                            24" Retina 4.5K, 8GB, SSD 256GB, 10-core GPU, macOS Sonoma,
                                                            Blue, Keyboard layout INT
                                                        </p>
                                                    </div>
                                                    <div className="w-[20%] flex items-center justify-end gap-5">
                                                        <p className="text-gray-700">x1</p>
                                                        <p className="text-gray-700 font-[600]">
                                                            {formatCurrency(3000000)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price info */}
                                            <h3 className="text-gray-700 text-xl pb-4 mb-1 mt-6 font-[600]">
                                                Tổng quan giá
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Giá sản phẩm</span>
                                                    <span className="text-gray-700">{formatCurrency(3000000)}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Phí ship</span>
                                                    <span className="text-gray-700">{formatCurrency(0)}</span>
                                                </div>
                                            </div>
                                            <div className="mb-1 mt-6">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-700 text-xl pb-4 font-[600]">
                                                        Tổng giá
                                                    </span>
                                                    <span className="text-gray-700 font-[600]">
                                                        {formatCurrency(3000000)}
                                                    </span>
                                                </div>
                                            </div>

                                            <Divider />
                                        </div>
                                    </div>
                                    <div className="pt-6 pb-3 rounded-lg">
                                        <div className="flex items-center justify-between gap-3 mt-4">
                                            <Button className="btn-org btn-login" onClick={printPDF}>
                                                In đơn hàng
                                            </Button>
                                            <Button className="btn-border btn-login">Huỷ đơn</Button>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </table>
                </div>
            </div>

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
