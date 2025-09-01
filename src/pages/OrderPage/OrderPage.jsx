import React, { useContext, useState, useEffect } from 'react';
import { IoMdAdd } from 'react-icons/io';

import './OrderPage.scss';
import * as XLSX from 'xlsx';
import {
    Button,
    MenuItem,
    Select,
    Checkbox,
    Tooltip,
    Pagination,
    Stack,
    Typography,
    Dialog,
    DialogContent,
    Divider,
    CircularProgress,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BiExport } from 'react-icons/bi';
import { MyContext } from '../../App';
import { FaRegEye } from 'react-icons/fa6';
import { GoTrash } from 'react-icons/go';
import SearchBoxComponent from '../../components/SearchBoxComponent/SearchBoxComponent';
import { IoCloseSharp } from 'react-icons/io5';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import BadgeOrderStatusComponent from '../../components/BadgeOrderStatusComponent/BadgeOrderStatusComponent';
import axiosClient from '../../apis/axiosClient';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder, deleteMultipleOrders, deleteOrder, fetchOrders, updateOrderStatus } from '../../redux/orderSlice';
import { socket } from '../../config/socket';
import { Link } from 'react-router-dom';

const OrderPage = () => {
    const context = useContext(MyContext);
    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.orders);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const [orderId, setOrderId] = useState(null);
    const [open, setOpen] = useState(false);
    const [isLoadingDeleteOrder, setIsLoadingDeleteOrder] = useState(false);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [openMultiple, setOpenMultiple] = useState(false);
    const [isLoadingMultiple, setIsLoadingMultiple] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState([]);

    const [openOrderDetailsModal, setOpenOrderDetailsModal] = useState({
        open: false,
        order: null,
    });

    const handleCloseOrderDetailsModal = () => {
        setOpenOrderDetailsModal((prev) => ({
            ...prev,
            open: false,
        }));
        setTimeout(() => {
            setOpenOrderDetailsModal({
                open: false,
                order: null,
            });
        }, 300);
    };
    const printPDF = async () => {
        const element = document.getElementById('order-details');
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
            })
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
                pdf.save('order-details.pdf');
            } catch (err) {
                console.error('Lỗi tạo PDF:', err);
            }
        }, 300);
    };

    useEffect(() => {
        socket.on('updateOrderStatus', (data) => {
            console.log('Admin nhan su kien dataOrderStatus: ', data);
            dispatch(
                updateOrderStatus({
                    orderId: data?.orderId,
                    orderStatus: data?.newStatus,
                })
            );
        });
        socket.on('staffNewOrder', (data) => {
            console.log('Admin nhan su kien newOrder tu user: ', data);
            dispatch(addOrder(data));
        });

        return () => {
            socket.off('updateOrderStatus');
            socket.off('staffNewOrder');
        };
    }, []);

    useEffect(() => {
        const getOrders = async () => {
            setIsLoadingOrders(true);
            try {
                const { data } = await axiosClient.get('/api/order/ordersFromAdmin');
                if (data.success) {
                    dispatch(fetchOrders(data?.orders));
                }
            } catch (error) {
                console.error('error: ', error);
            } finally {
                setIsLoadingOrders(false);
            }
        };
        getOrders();
    }, []);

    const itemsPerPage = 10;
    // State lưu trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    // Tính tổng số trang
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    // Xử lý khi đổi trang
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };
    // Cắt dữ liệu theo trang
    const currentOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleExportExcel = () => {
        const exportData = [];

        orders.forEach((order) => {
            const cartItems = order?.selectedCartItems || [];

            cartItems.forEach((cartItem, index) => {
                exportData.push({
                    // Chỉ hiển thị thông tin đơn hàng ở dòng đầu tiên
                    'Mã đơn hàng': index === 0 ? order?._id : '',
                    'Ngày đặt hàng': index === 0 ? formatDate(order?.createdAt) : '',
                    'Trạng thái đơn hàng': index === 0 ? order?.orderStatus : '',
                    'Phương thức thanh toán':
                        index === 0
                            ? order?.paymentMethod === 'cod'
                                ? 'Thanh toán khi nhận hàng'
                                : order?.paymentMethod === 'momo'
                                ? 'Thanh toán bằng Momo'
                                : order?.paymentMethod === 'vnpay'
                                ? 'Thanh toán bằng VnPay'
                                : 'Không xác định'
                            : '',

                    // Khách hàng
                    'Tên khách hàng': index === 0 ? order?.userId?.name : '',
                    'Email khách hàng': index === 0 ? order?.userId?.email : '',
                    'SĐT khách hàng': index === 0 ? order?.userId?.phoneNumber : '',
                    'Địa chỉ giao hàng':
                        index === 0
                            ? `Đường ${order?.shippingAddress?.streetLine || ''}, Phường ${
                                  order?.shippingAddress?.ward || ''
                              }, Quận ${order?.shippingAddress?.district || ''}, Thành phố ${
                                  order?.shippingAddress?.city || ''
                              }`
                            : '',

                    // Sản phẩm
                    'Tên sản phẩm': cartItem?.name,
                    Size: cartItem?.sizeProduct,
                    'Số lượng': cartItem?.quantityProduct,
                    Giá: formatCurrency(cartItem?.price),

                    // Tổng quan đơn (hiện 1 lần)
                    'Tổng số lượng': index === 0 ? order?.totalQuantity : '',
                    'Tổng tiền sản phẩm': index === 0 ? formatCurrency(order?.totalPrice) : '',
                    'Phí vận chuyển': index === 0 ? formatCurrency(order?.shippingFee) : '',
                    'Voucher giảm giá':
                        index === 0
                            ? order?.discountType === 'percent'
                                ? `${order?.discountValue}%`
                                : formatCurrency(order?.discountValue)
                            : '',
                    'Tổng thanh toán': index === 0 ? formatCurrency(order?.finalPrice) : '',
                });
            });
        });

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'ChiTietDonHang');

        XLSX.writeFile(wb, 'ChiTietDonHang.xlsx');
    };

    const handleSelectOrder = (orderId) => {
        setSelectedOrders((prevSelectedOrders) => {
            let updatedSelectedOrders;

            if (prevSelectedOrders.includes(orderId)) {
                // Nếu đã chọn thì bỏ chọn
                updatedSelectedOrders = prevSelectedOrders.filter((id) => id !== orderId);
            } else {
                // Nếu chưa chọn thì chọn
                updatedSelectedOrders = [...prevSelectedOrders, orderId];
            }

            const allSelectedOnPage = currentOrders.every((order) => updatedSelectedOrders.includes(order._id));
            setIsCheckedAll(allSelectedOnPage);

            return updatedSelectedOrders;
        });
    };

    const handleSelectAll = () => {
        const currentPageIds = currentOrders.map((product) => product._id);
        if (!isCheckedAll) {
            // Thêm các sản phẩm ở trang hiện tại
            const newSelected = Array.from(new Set([...selectedOrders, ...currentPageIds]));
            setSelectedOrders(newSelected);
            setIsCheckedAll(true);
        } else {
            // Bỏ các sản phẩm ở trang hiện tại
            const newSelected = selectedOrders.filter((id) => !currentPageIds.includes(id));
            setSelectedOrders(newSelected);
            setIsCheckedAll(false);
        }
    };
    useEffect(() => {
        const allSelectedOnPage = currentOrders.every((order) => selectedOrders.includes(order._id));
        setIsCheckedAll(allSelectedOnPage);
    }, [currentOrders, selectedOrders]);

    useEffect(() => {
        setSelectedOrders(selectedOrders);
    }, [selectedOrders]);

    const handleDeleteMultipleOrder = async () => {
        setIsLoadingMultiple(true);

        try {
            const { data } = await axiosClient.delete(`/api/order/deleteMultipleOrdersFromAdmin`, {
                data: { orderIds: selectedOrders },
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(deleteMultipleOrders({ orderIds: selectedOrders }));

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
        setOrderId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseMultiple = () => {
        setOpenMultiple(false);
    };
    const handleDeleteOrder = async () => {
        setIsLoadingDeleteOrder(true);
        try {
            const { data } = await axiosClient.delete(`/api/order/${orderId}`);
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(deleteOrder({ _id: orderId }));
                handleClose();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoadingDeleteOrder(false);
        }
    };

    const handleChangeOrderStatus = async (orderId, currentStatus, newStatus) => {
        if (currentStatus === newStatus) return;

        try {
            const { data } = await axiosClient.patch(`/api/order/updateOrderStatusByAdmin/${orderId}`, {
                newStatus,
            });
            if (data.success) {
                // context.openAlertBox('success', 'Cập nhật trạng thái thành công');
                dispatch(
                    updateOrderStatus({
                        orderStatus: data?.order?.orderStatus,
                        orderId,
                    })
                );
            }
        } catch (err) {
            console.error(err);
            context.openAlertBox('error', 'Lỗi khi cập nhật trạng thái');
        }
    };

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0">
                <h2 className="text-[18px] font-[600]">Danh sách đơn hàng</h2>

                <div
                    className={`col ${
                        context.isisOpenSidebar === true ? 'w-[25%]' : 'w-[22%]'
                    }] ml-auto flex items-center gap-3`}
                >
                    {(isCheckedAll || selectedOrders.length > 1) && (
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
                </div>
            </div>

            <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
                <div className="flex items-center w-full justify-between px-5">
                    <div className="col w-[100%]">
                        <SearchBoxComponent />
                    </div>
                </div>

                <br />

                <div className="card my-4 shadow-md sm:rounded-lg bg-white">
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                            {!isLoadingOrders && currentOrders?.length > 0 && (
                                <thead className="text-xs text-gray-700 uppercase bg-white">
                                    <tr>
                                        <th scope="col" className="px-6 pr-0 py-2 ">
                                            <div className="w-[60px]">
                                                <Checkbox
                                                    {...label}
                                                    size="small"
                                                    checked={isCheckedAll}
                                                    onChange={handleSelectAll}
                                                />
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                            Order ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                            Sản phẩm
                                        </th>
                                        <th className="px-6 py-3 whitespace-nowrap">Size</th>
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
                                            Tổng thanh toán
                                        </th>
                                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                            Trạng thái
                                        </th>
                                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                            Đánh giá sản phẩm
                                        </th>
                                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                            Ngày đặt hàng
                                        </th>
                                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                            )}

                            <tbody>
                                {isLoadingOrders === false ? (
                                    orders?.length > 0 &&
                                    orders?.map((order) =>
                                        order.selectedCartItems.map((item, idx) => (
                                            <tr key={`${order._id}-${idx}`} className="bg-white border-b">
                                                {idx === 0 ? (
                                                    <>
                                                        <td
                                                            className="px-6 pr-0 py-2"
                                                            rowSpan={order.selectedCartItems.length}
                                                        >
                                                            <div className="w-[60px]">
                                                                <Checkbox
                                                                    {...label}
                                                                    size="small"
                                                                    checked={selectedOrders.includes(order._id)}
                                                                    onChange={() => handleSelectOrder(order._id)}
                                                                />
                                                            </div>
                                                        </td>

                                                        <td
                                                            className="px-6 py-4"
                                                            rowSpan={order.selectedCartItems.length}
                                                        >
                                                            <span
                                                                onClick={() =>
                                                                    setOpenOrderDetailsModal({
                                                                        open: true,
                                                                        order: order,
                                                                    })
                                                                }
                                                                className="text-red font-[600] cursor-pointer"
                                                            >
                                                                {order?._id}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex gap-2 items-center rounded-md overflow-hidden group">
                                                                <img
                                                                    src={item?.images[0]}
                                                                    alt=""
                                                                    className="w-[70px] h-[70px] object-cover rounded-md group-hover:scale-105 transition-all cursor-pointer"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-primary">{item?.sizeProduct}</span>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4 "
                                                            rowSpan={order.selectedCartItems.length}
                                                        >
                                                            <span className="text-primary font-[600]">
                                                                {order?.paymentMethod === 'cod' &&
                                                                    'Thanh toán khi nhận hàng'}
                                                                {order?.paymentMethod === 'momo' &&
                                                                    'Thanh toán bằng Momo'}
                                                                {order?.paymentMethod === 'vnoay' &&
                                                                    'Thanh toán bằng VnPay'}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4"
                                                            rowSpan={order.selectedCartItems.length}
                                                        >
                                                            {order?.userId?.name}
                                                        </td>
                                                        <td
                                                            className="px-6 py-4"
                                                            rowSpan={order.selectedCartItems.length}
                                                        >
                                                            {order?.userId?.email}
                                                        </td>
                                                        <td
                                                            className="px-6 py-4"
                                                            rowSpan={order.selectedCartItems.length}
                                                        >
                                                            {order?.userId?.phoneNumber}
                                                        </td>
                                                        <td
                                                            className="px-6 py-4"
                                                            rowSpan={order.selectedCartItems.length}
                                                        >
                                                            <span className="block w-[400px]">
                                                                {`Đường ${order?.shippingAddress?.streetLine}, Phường  ${order?.shippingAddress?.ward}, Quận  ${order?.shippingAddress?.district},  Thành phố ${order?.shippingAddress?.city}`}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4"
                                                            rowSpan={order.selectedCartItems.length}
                                                        >
                                                            <span className="text-red font-[600]">
                                                                {formatCurrency(order?.finalPrice)}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="px-6 py-4"
                                                            rowSpan={order.selectedCartItems.length}
                                                        >
                                                            <Select
                                                                MenuProps={{ disableScrollLock: true }}
                                                                labelId="demo-simple-select-label"
                                                                id="orderStatusOrder"
                                                                size="medium"
                                                                className="w-full"
                                                                label="Trạng thái đơn hàng"
                                                                sx={{
                                                                    color:
                                                                        order?.orderStatus === 'pending'
                                                                            ? '#3b82f6'
                                                                            : order?.orderStatus === 'shipping'
                                                                            ? '#ca8a04'
                                                                            : order?.orderStatus === 'delivered'
                                                                            ? '#22c55e'
                                                                            : order?.orderStatus === 'cancelled'
                                                                            ? '#ef4444'
                                                                            : 'inherit',
                                                                    fontWeight: 400,
                                                                }}
                                                                value={order?.orderStatus}
                                                                onChange={(e) =>
                                                                    handleChangeOrderStatus(
                                                                        order?._id,
                                                                        order?.orderStatus,
                                                                        e.target.value
                                                                    )
                                                                }
                                                            >
                                                                <MenuItem
                                                                    value="pending"
                                                                    sx={{ color: '#3b82f6', fontWeight: 400 }}
                                                                >
                                                                    Chờ xác nhận
                                                                </MenuItem>
                                                                <MenuItem
                                                                    value="shipping"
                                                                    sx={{ color: '#ca8a04', fontWeight: 400 }}
                                                                >
                                                                    Đang giao hàng
                                                                </MenuItem>
                                                                <MenuItem
                                                                    value="delivered"
                                                                    sx={{ color: '#22c55e', fontWeight: 400 }}
                                                                >
                                                                    Đã giao hàng
                                                                </MenuItem>
                                                                <MenuItem
                                                                    value="cancelled"
                                                                    sx={{ color: '#ef4444', fontWeight: 400 }}
                                                                >
                                                                    Đã huỷ
                                                                </MenuItem>
                                                            </Select>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {item?.isReviewed ? (
                                                                <span className="text-green-500 font-medium">
                                                                    Đã đánh giá
                                                                </span>
                                                            ) : (
                                                                <span className="text-red-500 font-medium">
                                                                    Chưa đánh giá
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td
                                                            className="px-6 py-4"
                                                            rowSpan={order.selectedCartItems.length}
                                                        >
                                                            {formatDate(order?.createdAt)}
                                                        </td>

                                                        <td
                                                            className="px-6 py-2"
                                                            rowSpan={order.selectedCartItems.length}
                                                        >
                                                            <div className="flex items-center gap-1">
                                                                <Tooltip title="Xem chi tiết" placement="top">
                                                                    <Button
                                                                        onClick={() =>
                                                                            setOpenOrderDetailsModal({
                                                                                open: true,
                                                                                order: order,
                                                                            })
                                                                        }
                                                                        className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                                                    >
                                                                        <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                                    </Button>
                                                                </Tooltip>
                                                                <Tooltip
                                                                    title="Cập nhật"
                                                                    placement="top"
                                                                    onClick={() =>
                                                                        context.setIsOpenFullScreenPanel({
                                                                            open: true,
                                                                            model: 'Cập nhật đơn hàng',
                                                                            id: order?._id,
                                                                        })
                                                                    }
                                                                ></Tooltip>
                                                                <Tooltip title="Xoá" placement="top">
                                                                    <Button
                                                                        onClick={() => handleClickOpen(order._id)}
                                                                        className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                                                    >
                                                                        <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                                    </Button>
                                                                </Tooltip>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="px-6 py-4">
                                                            <Link>
                                                                <div className="flex gap-2 items-center rounded-md overflow-hidden group">
                                                                    <img
                                                                        src={item?.images[0]}
                                                                        alt=""
                                                                        className="w-[70px] h-[70px] object-cover rounded-md group-hover:scale-105 transition-all cursor-pointer"
                                                                    />
                                                                </div>
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-primary">{item?.sizeProduct}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {item?.isReviewed ? (
                                                                <span className="text-green-500 font-medium">
                                                                    Đã đánh giá
                                                                </span>
                                                            ) : (
                                                                <span className="text-red-500 font-medium">
                                                                    Chưa đánh giá
                                                                </span>
                                                            )}
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))
                                    )
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
                            <Dialog
                                disableScrollLock
                                fullWidth={true}
                                maxWidth="lg"
                                open={openOrderDetailsModal.open}
                                onClose={handleCloseOrderDetailsModal}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                className="orderDetailsModal"
                            >
                                <DialogContent>
                                    <div className="bg-[#fff] p-4 container">
                                        <div className="w-full orderDetailsModalContainer relative">
                                            <Button
                                                className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[6px] right-[15px] !bg-[#f1f1f1]"
                                                onClick={handleCloseOrderDetailsModal}
                                            >
                                                <IoCloseSharp className="text-[20px]" />
                                            </Button>

                                            <div
                                                className="container bg-white p-6 rounded-lg shadow-md"
                                                id="order-details"
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
                                                        <span className="text-red">
                                                            {openOrderDetailsModal?.order?._id}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-500">Phương thức thanh toán</span>
                                                        <span className="text-gray-700 text-blue">
                                                            {openOrderDetailsModal?.order?.paymentMethod === 'cod' &&
                                                                'Thanh toán khi nhận hàng'}
                                                            {openOrderDetailsModal?.order?.paymentMethod === 'momo' &&
                                                                'Thanh toán bằng Momo'}
                                                            {openOrderDetailsModal?.order?.paymentMethod === 'vnoay' &&
                                                                'Thanh toán bằng VnPay'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-500">Ngày đặt hàng</span>
                                                        <span className="text-gray-700">
                                                            {formatDate(openOrderDetailsModal?.order?.createdAt)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-500">Trạng thái</span>
                                                        <span className="text-gray-700">
                                                            <BadgeOrderStatusComponent
                                                                status={openOrderDetailsModal?.order?.orderStatus}
                                                            />
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
                                                        <span className="text-gray-700">
                                                            {openOrderDetailsModal?.order?.userId?.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-500">Email</span>
                                                        <span className="text-gray-700">
                                                            {openOrderDetailsModal?.order?.userId?.email}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-500">Số điện thoại</span>
                                                        <span className="text-gray-700">
                                                            {openOrderDetailsModal?.order?.userId?.phoneNumber}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-500">Địa chỉ</span>
                                                        <span className="text-gray-700">
                                                            {`Đường ${
                                                                openOrderDetailsModal?.order?.shippingAddress
                                                                    ?.streetLine || ''
                                                            }, Phường ${
                                                                openOrderDetailsModal?.order?.shippingAddress?.ward ||
                                                                ''
                                                            }, Quận ${
                                                                openOrderDetailsModal?.order?.shippingAddress
                                                                    ?.district || ''
                                                            }, Thành phố ${
                                                                openOrderDetailsModal?.order?.shippingAddress?.city ||
                                                                ''
                                                            }`}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Product Info */}
                                                <h3 className="text-gray-700 text-xl pb-4 mb-1 mt-6 font-[600]">
                                                    Thông tin sản phẩm
                                                </h3>
                                                <div className="mt-4">
                                                    {openOrderDetailsModal?.order?.selectedCartItems?.length > 0 &&
                                                        openOrderDetailsModal?.order?.selectedCartItems?.map(
                                                            (cartItem) => {
                                                                return (
                                                                    <div
                                                                        key={cartItem?._id}
                                                                        className="flex items-center bg-gray-50 p-4 rounded-lg"
                                                                    >
                                                                        <div className="w-[20%] group cursor-pointer">
                                                                            <img
                                                                                alt="Image of an Apple iMac"
                                                                                className="w-[70px] h-[70px] object-cover rounded-md mr-4 group-hover:scale-105 transition-all"
                                                                                src={cartItem?.images[0]}
                                                                            />
                                                                        </div>
                                                                        <div className="mx-4 w-[47%]">
                                                                            <p className="text-gray-700">
                                                                                {cartItem?.name}
                                                                            </p>
                                                                        </div>
                                                                        <div className="w-[33%] flex items-center justify-end gap-5">
                                                                            <p className="text-gray-700">
                                                                                {cartItem?.sizeProduct}
                                                                            </p>
                                                                            <p className="text-gray-700">
                                                                                {cartItem?.quantityProduct}
                                                                            </p>
                                                                            <p className="text-gray-700 font-[600]">
                                                                                {formatCurrency(cartItem?.price)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        )}

                                                    {/* Price info */}
                                                    <h3 className="text-gray-700 text-xl pb-4 mb-1 mt-6 font-[600]">
                                                        Tổng quan giá
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-500">Tổng số lượng</span>
                                                            <span className="text-gray-700">
                                                                {openOrderDetailsModal?.order?.totalQuantity}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-500">Tổng tiền đơn</span>
                                                            <span className="text-gray-700">
                                                                {formatCurrency(
                                                                    openOrderDetailsModal?.order?.totalPrice
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-500">
                                                                Tổng tiền phí vận chuyển
                                                            </span>
                                                            <span className="text-gray-700">
                                                                {formatCurrency(
                                                                    openOrderDetailsModal?.order?.shippingFee
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-500">Voucher</span>
                                                            <span className="text-gray-700">
                                                                {openOrderDetailsModal?.order?.discountType ===
                                                                'percent'
                                                                    ? `${openOrderDetailsModal?.order?.discountValue}%`
                                                                    : `${formatCurrency(
                                                                          openOrderDetailsModal?.order?.discountValue
                                                                      )}`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mb-1 mt-6">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-700 text-xl pb-4 font-[600]">
                                                                Tổng thanh toán
                                                            </span>
                                                            <span className="font-[600] text-[28px] text-red">
                                                                {formatCurrency(
                                                                    openOrderDetailsModal?.order?.finalPrice
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <Divider />
                                                </div>
                                            </div>
                                            <div className="p-6 rounded-lg">
                                                <div className="flex items-center justify-end gap-3 mt-4">
                                                    <Button className="btn-org btn-login" onClick={printPDF}>
                                                        In đơn hàng
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </table>
                    </div>
                </div>

                {!isLoadingOrders && currentOrders?.length > 0 && (
                    <div className="flex items-center justify-center pt-5 pb-5 px-4">
                        <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} color="primary" />
                    </div>
                )}
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Xoá đơn hàng?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn xoá đơn hàng này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Huỷ</Button>
                    {isLoadingDeleteOrder === true ? (
                        <CircularProgress color="inherit" />
                    ) : (
                        <Button className="btn-red" onClick={handleDeleteOrder} autoFocus>
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
                <DialogTitle id="alert-dialog-title">{'Xoá tất cả đơn hàng?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn xoá tất cả đơn hàng này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMultiple}>Huỷ</Button>
                    {isLoadingMultiple === true ? (
                        <CircularProgress color="inherit" />
                    ) : (
                        <Button className="btn-red" onClick={handleDeleteMultipleOrder} autoFocus>
                            Xác nhận
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OrderPage;

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
