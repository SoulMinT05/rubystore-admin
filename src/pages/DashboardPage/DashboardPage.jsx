import React, { useState, PureComponent, useContext, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import './DashboardPage.scss';
import DashboardBoxComponent from '../../components/DashboardBoxComponent/DashboardBoxComponent';
import { FaPlus } from 'react-icons/fa6';
import { Button, MenuItem, Select, Checkbox, Rating, Pagination, CircularProgress, Divider } from '@mui/material';
import TooltipMUI from '@mui/material/Tooltip';
import { IoCloseSharp } from 'react-icons/io5';
import { BiExport } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
import axiosClient from '../../apis/axiosClient';
import * as XLSX from 'xlsx';
import SearchBoxComponent from '../../components/SearchBoxComponent/SearchBoxComponent';

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

const DashboardPage = () => {
    const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
    const context = useContext(MyContext);
    const { products, setProducts } = useContext(MyContext);
    const [productId, setProductId] = useState(null);

    const [productCategory, setProductCategory] = useState('');
    const [productSubCategory, setProductSubCategory] = useState('');
    const [productThirdSubCategory, setProductThirdSubCategory] = useState('');

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [openMultiple, setOpenMultiple] = useState(false);
    const [isLoadingMultiple, setIsLoadingMultiple] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [, setFormFields] = useState({
        categoryId: '',
        categoryName: '',
        subCategoryId: '',
        subCategoryName: '',
        thirdSubCategoryId: '',
        thirdSubCategoryName: '',
    });

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

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

    const itemsPerPage = 10;
    // State lưu trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    // Tính tổng số trang
    const totalPages = Math.ceil(products.length / itemsPerPage);
    // Xử lý khi đổi trang
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };
    // Cắt dữ liệu theo trang
    const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            products.map((product) => ({
                'Hình ảnh': product.images.length > 0 ? product.images[0] : 'Không có hình ảnh',
                'Tên sản phẩm': product?.name,
                Giá: product?.price ? product?.price + 'VND' : '0 VND',
                'Giá cũ': product?.oldPrice ? product?.oldPrice + 'VND' : '0 VND',
                'ID danh mục': product?.categoryId,
                'Tên danh mục': product?.categoryName,
                'ID danh mục con cấp 2': product?.subCategoryId,
                'Tên danh mục con cấp 2': product?.subCategoryName,
                'ID danh mục con cấp 3': product?.thirdSubCategoryId,
                'Tên danh mục con cấp 3': product?.thirdSubCategoryName,
                'Số lượng trong kho': product?.countInStock,
                'Sản phẩm đặc trưng': product?.isFeatured === true ? 'Có' : 'Không',
                'Trạng thái công khai': product?.isPublished === true ? 'Có' : 'Không',
                'Giảm giá': product?.discount ? product?.discount + '%' : '0%',
                'RAM sản phẩm': product?.productRam,
                'Kích cỡ': product?.productSize,
                'Cân nặng': product?.productWeight,
            })),
        );

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sản phẩm');

        // Xuất file Excel
        XLSX.writeFile(wb, 'SanPham.xlsx');
    };
    const handleSelectProduct = (productId) => {
        setSelectedProducts((prevSelectedProducts) => {
            let updatedSelectedProducts;

            if (prevSelectedProducts.includes(productId)) {
                // Nếu đã chọn thì bỏ chọn
                updatedSelectedProducts = prevSelectedProducts.filter((id) => id !== productId);
            } else {
                // Nếu chưa chọn thì chọn
                updatedSelectedProducts = [...prevSelectedProducts, productId];
            }

            const allSelectedOnPage = currentProducts.every((product) => updatedSelectedProducts.includes(product._id));
            setIsCheckedAll(allSelectedOnPage);

            return updatedSelectedProducts;
        });
    };

    const handleSelectAll = () => {
        const currentPageIds = currentProducts.map((product) => product._id);
        if (!isCheckedAll) {
            // Thêm các sản phẩm ở trang hiện tại
            const newSelected = Array.from(new Set([...selectedProducts, ...currentPageIds]));
            setSelectedProducts(newSelected);
            setIsCheckedAll(true);
        } else {
            // Bỏ các sản phẩm ở trang hiện tại
            const newSelected = selectedProducts.filter((id) => !currentPageIds.includes(id));
            setSelectedProducts(newSelected);
            setIsCheckedAll(false);
        }
    };
    useEffect(() => {
        const allSelectedOnPage = currentProducts.every((product) => selectedProducts.includes(product._id));
        setIsCheckedAll(allSelectedOnPage);
    }, [currentProducts, selectedProducts]);

    useEffect(() => {
        setSelectedProducts(selectedProducts);
    }, [selectedProducts]);

    const handleDeleteMultipleProduct = async () => {
        setIsLoadingMultiple(true);

        try {
            const { data } = await axiosClient.delete(`/api/product/deleteMultipleProduct`, {
                data: { ids: selectedProducts },
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                context.getProducts();
                handleCloseMultiple();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoadingMultiple(false);
        }
    };

    const handleClickOpen = (id) => {
        setOpen(true);
        setProductId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseMultiple = () => {
        setOpenMultiple(false);
    };

    const selectCategoryByName = (name) => {
        setFormFields((prev) => ({
            ...prev,
            categoryName: name,
        }));
    };
    const handleChangeProductCategory = async (event) => {
        setProductCategory(event.target.value);
        setProductSubCategory('');
        setProductThirdSubCategory('');
        setIsLoadingProducts(true);
        const { data } = await axiosClient.get(`/api/product/all-products-category-id/${event.target.value}`);
        if (data?.success) {
            setProducts(data?.products);
            setTimeout(() => {
                setIsLoadingProducts(false);
            }, 300);
        }
    };

    const handleChangeProductSubCategory = async (event) => {
        setProductSubCategory(event.target.value);
        setProductCategory('');
        setProductThirdSubCategory('');
        setIsLoadingProducts(true);
        const { data } = await axiosClient.get(`/api/product/all-products-sub-category-id/${event.target.value}`);
        if (data?.success) {
            setProducts(data?.products);
            setTimeout(() => {
                setIsLoadingProducts(false);
            }, 300);
        }
    };
    const selectSubCategoryByName = (name) => {
        setFormFields((prev) => ({
            ...prev,
            subCategoryName: name,
        }));
    };

    const handleChangeProductThirdSubCategory = async (event) => {
        setProductThirdSubCategory(event.target.value);
        setProductCategory('');
        setProductSubCategory('');
        setIsLoadingProducts(true);
        const { data } = await axiosClient.get(`/api/product/all-products-third-sub-category-id/${event.target.value}`);
        if (data?.success) {
            setProducts(data?.products);
            setTimeout(() => {
                setIsLoadingProducts(false);
            }, 300);
        }
    };
    const selectThirdSubCategoryByName = (name) => {
        setFormFields((prev) => ({
            ...prev,
            thirdSubCategoryName: name,
        }));
    };

    useEffect(() => {
        const getProducts = async () => {
            try {
                setIsLoadingProducts(true);
                const { data } = await axiosClient.get('/api/product/all-products-admin');
                if (data.success) {
                    setTimeout(() => {
                        setProducts(data?.products);
                    }, 100);
                    setIsLoadingProducts(false);
                } else {
                    console.error('Lỗi lấy danh mục:', data.message);
                }
            } catch (error) {
                console.error('Lỗi API:', error);
                return [];
            }
        };
        getProducts();
    }, [context?.isOpenFullScreenPanel]);

    const handleDeleteProduct = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosClient.delete(`/api/product/${productId}`);
            if (data.success) {
                context.openAlertBox('success', data.message);
                context.getProducts();
                handleClose();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    const getStockLabelByQuantity = (countInStock) => {
        if (countInStock < 1) return 'Hết hàng';
        if (countInStock >= 1) return 'Còn hàng';
        return 'Sắp có hàng'; // nếu countInStock là null, undefined, hoặc lỗi
    };

    const getProductStatusBackgroundByStock = (countInStock) => {
        if (countInStock < 1) return 'outOfStock';
        if (countInStock >= 1) return 'active';

        return 'commingSoon'; // hoặc trạng thái mặc định
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

            <div className="flex items-center justify-between px-2 py-0 mt-5">
                <h2 className="text-[18px] font-[600]">Danh sách sản phẩm</h2>

                <div
                    className={`col ${
                        context.isisOpenSidebar === true ? 'w-[25%]' : 'w-[22%]'
                    }] ml-auto flex items-center gap-3`}
                >
                    {(isCheckedAll || selectedProducts.length > 1) && (
                        <Button
                            onClick={() => setOpenMultiple(true)}
                            className="btn !bg-red-500 !text-white !normal-case gap-1"
                        >
                            <BiExport />
                            Xoá tất cả
                        </Button>
                    )}
                    <Button onClick={handleExportExcel} className="btn !bg-green-500 !text-white !normal-case gap-1">
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
                        <IoMdAdd />
                        Thêm sản phẩm
                    </Button>
                </div>
            </div>

            <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
                <div className="flex items-center w-full justify-between px-5 gap-4">
                    <div className="col w-[15%]">
                        <h4 className="font-[600] text-[13px] mb-2">Danh mục cha</h4>

                        {context?.categories?.length !== 0 && (
                            <Select
                                style={{ zoom: '80%' }}
                                labelId="demo-simple-select-label"
                                id="productCategoryDrop"
                                size="small"
                                className="w-full"
                                value={productCategory}
                                label="Danh mục"
                                onChange={handleChangeProductCategory}
                            >
                                {context?.categories?.map((cat) => {
                                    return (
                                        <MenuItem value={cat?._id} onClick={() => selectCategoryByName(cat?.name)}>
                                            {cat?.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        )}
                    </div>

                    <div className="col w-[15%]">
                        <h4 className="font-[600] text-[13px] mb-2">Danh mục con cấp 2</h4>

                        {context?.categories?.length !== 0 && (
                            <Select
                                style={{ zoom: '80%' }}
                                labelId="demo-simple-select-label"
                                id="productSubCategoryDrop"
                                size="small"
                                className="w-full"
                                value={productSubCategory}
                                label="Danh mục con cấp 2"
                                onChange={handleChangeProductSubCategory}
                            >
                                {context?.categories?.map((cat) => {
                                    return (
                                        cat?.children?.length !== 0 &&
                                        cat?.children.map((subCat) => {
                                            return (
                                                <MenuItem
                                                    value={subCat?._id}
                                                    onClick={() => selectSubCategoryByName(subCat?.name)}
                                                >
                                                    {subCat?.name}
                                                </MenuItem>
                                            );
                                        })
                                    );
                                })}
                            </Select>
                        )}
                    </div>
                    <div className="col w-[15%]">
                        <h4 className="font-[600] text-[13px] mb-2">Danh mục con cấp 3</h4>

                        {context?.categories?.length !== 0 && (
                            <Select
                                style={{ zoom: '80%' }}
                                labelId="demo-simple-select-label"
                                id="productThirdCategoryDrop"
                                size="small"
                                className="w-full"
                                value={productThirdSubCategory}
                                label="Danh mục con cấp 3"
                                onChange={handleChangeProductThirdSubCategory}
                            >
                                {context?.categories?.map((cat) => {
                                    return (
                                        cat?.children?.length !== 0 &&
                                        cat?.children.map((subCat) => {
                                            return (
                                                subCat?.children?.length !== 0 &&
                                                subCat?.children?.map((thirdCat) => {
                                                    return (
                                                        <MenuItem
                                                            value={thirdCat?._id}
                                                            onClick={() => selectThirdSubCategoryByName(thirdCat?.name)}
                                                        >
                                                            {thirdCat?.name}
                                                        </MenuItem>
                                                    );
                                                })
                                            );
                                        })
                                    );
                                })}
                            </Select>
                        )}
                    </div>

                    <div className="col w-[20%] ml-auto">
                        <SearchBoxComponent />
                    </div>
                </div>

                <br />

                <div className="relative overflow-x-auto mt-1 pb-5">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                        {!isLoadingProducts && currentProducts?.length > 0 && (
                            <thead className="text-xs text-gray-700 uppercase bg-white">
                                <tr>
                                    <th scope="col" className="px-6 pr-0 py-2 ">
                                        <div className="w-[60px]">
                                            <Checkbox
                                                {...label}
                                                checked={isCheckedAll}
                                                onChange={handleSelectAll}
                                                size="small"
                                            />
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
                        )}

                        <tbody>
                            {isLoadingProducts === false ? (
                                currentProducts?.length > 0 &&
                                currentProducts?.map((product) => (
                                    <tr key={product._id} className="odd:bg-white  even:bg-gray-50 border-b">
                                        <td className="px-6 pr-0 py-2">
                                            <div className="w-[60px]">
                                                <Checkbox
                                                    {...label}
                                                    checked={selectedProducts.includes(product._id)}
                                                    onChange={() => handleSelectProduct(product._id)}
                                                    size="small"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-0 py-2">
                                            <div className="flex items-center gap-4 w-[330px]">
                                                <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                                    <Link to={`/product/${product?._id}`}>
                                                        <img
                                                            src={product?.images[0]}
                                                            className="w-full group-hover:scale-105 transition-all"
                                                            alt=""
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="info w-[75%]">
                                                    <h3 className="text-[12px] font-[600] leading-4 hover:text-primary transition-all">
                                                        <Link to={`/product/${product?._id}`}>{product?.name}</Link>
                                                    </h3>
                                                    <span className="text-[12px]">{product?.brand}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2">
                                            <p className="w-[80px]">{product?.categoryName}</p>
                                        </td>
                                        <td className="px-6 py-2">
                                            <p className="w-[80px]">{product?.subCategoryName}</p>
                                        </td>
                                        <td className="px-6 py-2">
                                            <div className="flex gap-1 flex-col">
                                                <span className="oldPrice line-through leading-3 text-gray-500 text-[14px] font-[500]">
                                                    {formatCurrency(product?.oldPrice)}
                                                </span>
                                                <span className="price text-primary text-[14px] font-[600]">
                                                    {formatCurrency(product?.price)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2">
                                            <p className="text-[14px] w-[130px]">
                                                <span className="font-[600]">
                                                    {getStockLabelByQuantity(product?.countInStock || 0)}{' '}
                                                </span>
                                                ({product?.countInStock || 0})
                                            </p>
                                            <ProgressProductStatusComponent
                                                value={product?.countInStock}
                                                status={getProductStatusBackgroundByStock(product?.countInStock || 0)}
                                            />
                                        </td>
                                        <td className="px-6 py-2">
                                            <Rating
                                                name="size-small"
                                                defaultValue={product?.rating}
                                                readOnly
                                                size="small"
                                            />
                                        </td>
                                        <td className="px-6 py-2">
                                            <div className="flex items-center gap-1">
                                                <TooltipMUI
                                                    title="Chỉnh sửa"
                                                    placement="top"
                                                    onClick={() =>
                                                        context.setIsOpenFullScreenPanel({
                                                            open: true,
                                                            model: 'Cập nhật sản phẩm',
                                                            id: product?._id,
                                                        })
                                                    }
                                                >
                                                    <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                        <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                                                    </Button>
                                                </TooltipMUI>
                                                <TooltipMUI title="Xem chi tiết" placement="top">
                                                    <Link to={`/product/${product?._id}`}>
                                                        <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                            <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                        </Button>
                                                    </Link>
                                                </TooltipMUI>
                                                <TooltipMUI title="Xoá" placement="top">
                                                    <Button
                                                        onClick={() => handleClickOpen(product._id)}
                                                        className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                                    >
                                                        <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                    </Button>
                                                </TooltipMUI>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={999}>
                                        <div className="flex items-center justify-center w-full min-h-[400px]">
                                            <CircularProgress color="inherit" />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoadingProducts && currentProducts?.length > 0 && (
                    <div className="flex items-center justify-center pt-5 pb-5 px-4">
                        <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} color="primary" />
                    </div>
                )}
            </div>

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

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Xoá sản phẩm?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn xoá sản phẩm này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Huỷ</Button>
                    {isLoading === true ? (
                        <CircularProgress color="inherit" />
                    ) : (
                        <Button className="btn-red" onClick={handleDeleteProduct} autoFocus>
                            Xác nhận
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog
                open={openMultiple}
                onClose={handleCloseMultiple}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Xoá tất cả sản phẩm?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn xoá tất cả sản phẩm này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMultiple}>Huỷ</Button>
                    {isLoadingMultiple === true ? (
                        <CircularProgress color="inherit" />
                    ) : (
                        <Button className="btn-red" onClick={handleDeleteMultipleProduct} autoFocus>
                            Xác nhận
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DashboardPage;
