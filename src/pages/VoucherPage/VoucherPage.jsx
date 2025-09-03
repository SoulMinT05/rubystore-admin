import React, { forwardRef, useContext, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

import './VoucherPage.scss';
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
    AppBar,
    IconButton,
    Slide,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IoCloseSharp } from 'react-icons/io5';
import { BiExport } from 'react-icons/bi';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaRegEye } from 'react-icons/fa6';
import { GoTrash } from 'react-icons/go';
import SearchBoxComponent from '../../components/SearchBoxComponent/SearchBoxComponent';
import axiosClient from '../../apis/axiosClient';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { Toolbar } from 'react-simple-wysiwyg';
import { IoMdClose } from 'react-icons/io';
import { deleteMultipleVouchers, deleteVoucher, fetchVouchers, toggleActiveVoucher } from '../../redux/voucherSlice';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const VoucherPage = () => {
    const context = useContext(MyContext);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const { vouchers } = useSelector((state) => state.vouchers);
    const dispatch = useDispatch();

    const [voucherId, setVoucherId] = useState(null);
    const [open, setOpen] = useState(false);
    const [isLoadingDeleteVoucher, setIsLoadingDeleteVoucher] = useState(false);
    const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);
    const [openMultiple, setOpenMultiple] = useState(false);
    const [isLoadingMultiple, setIsLoadingMultiple] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [selectedVouchers, setSelectedVouchers] = useState([]);

    const [searchField, setSearchField] = useState('code');
    const [searchValue, setSearchValue] = useState('');
    const [discountTypeValue, setDiscountTypeValue] = useState('');
    const [minOrderValuePrice, setMinOrderValuePrice] = useState('');
    const [quantityVoucherValue, setQuantityVoucherValue] = useState('');

    const handleChangeSearchField = (event) => {
        setSearchField(event.target.value);
    };

    const [openVoucherDetailsModal, setOpenVoucherDetailsModal] = useState({
        open: false,
        voucher: null,
    });

    const handleCloseVoucherDetailsModal = () => {
        // Bước 1: chỉ đóng modal
        setOpenVoucherDetailsModal((prev) => ({
            ...prev,
            open: false,
        }));

        // Bước 2: sau khi modal thực sự đóng, mới xóa voucher (delay ~300ms là đủ)
        setTimeout(() => {
            setOpenVoucherDetailsModal({
                open: false,
                voucher: null,
            });
        }, 300);
    };

    const itemsPerPage = import.meta.env.VITE_LIMIT_DEFAULT;
    const [currentPage, setCurrentPage] = useState(1); // State lưu trang hiện tại
    const [totalPages, setTotalPages] = useState(1);
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    // Reset currentPage về 1 mỗi khi searchValue thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue, discountTypeValue, minOrderValuePrice, quantityVoucherValue]);

    useEffect(() => {
        setIsLoadingVouchers(true);

        const handleDebounced = setTimeout(() => {
            const getVouchers = async () => {
                let url = `/api/voucher/getAllVouchers?page=${currentPage}&perPage=${itemsPerPage}`;

                try {
                    let finalValue = searchValue;
                    if (searchField === 'discountType') {
                        finalValue = discountTypeValue;
                    }

                    if (searchField === 'minOrderValue') {
                        finalValue = minOrderValuePrice;
                    }

                    if (searchField === 'quantityVoucher') {
                        finalValue = quantityVoucherValue;
                    }

                    if (searchField && finalValue) {
                        url += `&field=${searchField}&value=${finalValue}`;
                    }
                    const { data } = await axiosClient.get(url);
                    console.log('dataVouchers: ', data);
                    if (data.success) {
                        dispatch(fetchVouchers(data?.vouchers));
                        setTotalPages(data?.totalPages);
                    }
                } catch (error) {
                    console.error('error: ', error);
                } finally {
                    setIsLoadingVouchers(false);
                }
            };
            getVouchers();
        }, 500);

        return () => {
            clearTimeout(handleDebounced);
        };
    }, [currentPage, searchValue, discountTypeValue, minOrderValuePrice, quantityVoucherValue]);

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            vouchers.map((voucher) => ({
                Code: voucher?.code,
                'Loại voucher': voucher?.discountType === 'fixed' ? '%' : 'VND',
                'Giá trị voucher': voucher?.discountValue,
                'Giá trị đơn hàng tối thiểu': voucher?.minOrderValue,
                'Trạng thái voucher': voucher?.isActive ? 'Kích hoạt' : 'Vô hiệu hóa',
                'Ngày hết hạn': voucher?.expiresAt ? formatDate(voucher?.expiresAt) : 'Chưa có',
                'Ngày tạo': voucher?.createdAt ? formatDate(voucher?.createdAt) : '',
            }))
        );

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Voucher');

        // Xuất file Excel
        XLSX.writeFile(wb, 'Voucher.xlsx');
    };

    const handleSelectVoucher = (voucherId) => {
        setSelectedVouchers((prevSelectedVouchers) => {
            let updatedSelectedVouchers;

            if (prevSelectedVouchers?.includes(voucherId)) {
                // Nếu đã chọn thì bỏ chọn
                updatedSelectedVouchers = prevSelectedVouchers?.filter((id) => id !== voucherId);
            } else {
                // Nếu chưa chọn thì chọn
                updatedSelectedVouchers = [...prevSelectedVouchers, voucherId];
            }

            const allSelectedOnPage = vouchers?.every((voucher) => updatedSelectedVouchers?.includes(voucher._id));
            setIsCheckedAll(allSelectedOnPage);

            return updatedSelectedVouchers;
        });
    };

    const handleSelectAll = () => {
        const currentPageIds = vouchers?.map((product) => product._id);
        if (!isCheckedAll) {
            // Thêm các sản phẩm ở trang hiện tại
            const newSelected = Array.from(new Set([...selectedVouchers, ...currentPageIds]));
            setSelectedVouchers(newSelected);
            setIsCheckedAll(true);
        } else {
            // Bỏ các sản phẩm ở trang hiện tại
            const newSelected = selectedVouchers?.filter((id) => !currentPageIds.includes(id));
            setSelectedVouchers(newSelected);
            setIsCheckedAll(false);
        }
    };
    useEffect(() => {
        const allSelectedOnPage = vouchers?.every((voucher) => selectedVouchers?.includes(voucher._id));
        setIsCheckedAll(allSelectedOnPage);
    }, [vouchers, selectedVouchers]);

    useEffect(() => {
        setSelectedVouchers(selectedVouchers);
    }, [selectedVouchers]);

    const handleDeleteMultipleVouchers = async () => {
        setIsLoadingMultiple(true);

        try {
            const { data } = await axiosClient.delete(`/api/voucher/deleteMultipleVouchers`, {
                data: { voucherIds: selectedVouchers },
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(deleteMultipleVouchers({ voucherIds: selectedVouchers }));
                setSelectedVouchers([]);
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
        setVoucherId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseMultiple = () => {
        setOpenMultiple(false);
    };
    const handleDeleteVoucher = async () => {
        setIsLoadingDeleteVoucher(true);
        try {
            const { data } = await axiosClient.delete(`/api/voucher/deleteVoucher/${voucherId}`);
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(deleteVoucher({ _id: voucherId }));
                handleClose();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoadingDeleteVoucher(false);
        }
    };

    const handleToggleIsActive = async (voucherId) => {
        try {
            const { data } = await axiosClient.patch(`/api/voucher/toggleVoucherActiveStatus/${voucherId}`);
            if (data.success) {
                dispatch(
                    toggleActiveVoucher({
                        voucherId,
                        isActive: data.isActive,
                    })
                );
                context.openAlertBox('success', data.message);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật isLocked:', error);
            context.openAlertBox('error', 'Cập nhật trạng thái thất bại');
        }
    };

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0">
                <h2 className="text-[18px] font-[600]">Danh sách voucher</h2>

                <div
                    className={`col ${
                        context.isisOpenSidebar === true ? 'w-[25%]' : 'w-[22%]'
                    }] ml-auto flex items-center gap-3`}
                >
                    {(isCheckedAll || selectedVouchers?.length > 1) && vouchers?.length > 1 && (
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
                                model: 'Thêm voucher',
                            })
                        }
                    >
                        <IoMdAdd />
                        Thêm voucher
                    </Button>
                </div>
            </div>

            <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
                <div className="flex items-center w-full justify-between px-5">
                    <div className="col w-[30%]">
                        <h4 className="font-[600] text-[13px] mb-2">Tìm kiếm theo</h4>

                        {context?.categories?.length !== 0 && (
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                sx={{ height: '42px' }}
                                labelId="demo-simple-select-label"
                                id="userSearchDrop"
                                size="small"
                                className="w-full !h-[42px] "
                                value={searchField}
                                onChange={handleChangeSearchField}
                                label="Tìm kiếm"
                            >
                                <MenuItem disabled value="">
                                    Chọn tiêu chí
                                </MenuItem>
                                <MenuItem value="code">Code</MenuItem>
                                <MenuItem value="discountType">Loại voucher</MenuItem>
                                {/* <MenuItem value="discountValue">Giá trị voucher</MenuItem> */}
                                <MenuItem value="minOrderValue">Giá trị đơn hàng tối thiểu</MenuItem>
                                <MenuItem value="quantityVoucher">Số lượng voucher</MenuItem>
                            </Select>
                        )}
                    </div>
                    {/* CODE */}
                    {searchField === 'code' && (
                        <div className="col w-[68%] mt-[28px] ">
                            <div className="">
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="h-[44px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                    focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                                                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                                    dark:placeholder-gray-400 dark:text-white 
                                                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="VOUCHER1"
                                    required
                                />
                            </div>
                        </div>
                    )}
                    {/* Discount type */}
                    {searchField === 'discountType' && (
                        <div className="col w-[68%] mt-[18px]">
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                sx={{ height: '42px', marginTop: '10px' }}
                                size="small"
                                className="w-full !h-[42px]"
                                value={discountTypeValue}
                                onChange={(e) => setDiscountTypeValue(e.target.value)}
                            >
                                <MenuItem value="percent">Phần trăm (%)</MenuItem>
                                <MenuItem value="fixed">Số tiền cố định (VND)</MenuItem>
                            </Select>
                        </div>
                    )}
                    {/* Min Order Value */}
                    {searchField === 'minOrderValue' && (
                        <div className="col w-[68%] mt-[18px]">
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                sx={{ height: '42px', marginTop: '10px' }}
                                size="small"
                                className="w-full !h-[42px]"
                                value={minOrderValuePrice}
                                onChange={(e) => setMinOrderValuePrice(e.target.value)}
                            >
                                <MenuItem value="<100">Dưới 100.000đ</MenuItem>
                                <MenuItem value="100-400">Từ 100.000đ - 400.000đ</MenuItem>
                                <MenuItem value=">400">Trên 400.000đ</MenuItem>
                            </Select>
                        </div>
                    )}
                    {/* Quantity voucher */}
                    {searchField === 'quantityVoucher' && (
                        <div className="col w-[68%] mt-[18px]">
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                sx={{ height: '42px', marginTop: '10px' }}
                                size="small"
                                className="w-full !h-[42px]"
                                value={quantityVoucherValue}
                                onChange={(e) => setQuantityVoucherValue(e.target.value)}
                            >
                                <MenuItem value="<100">Dưới 100</MenuItem>
                                <MenuItem value="100-400">Từ 100 - 400</MenuItem>
                                <MenuItem value=">400">Trên 400</MenuItem>
                            </Select>
                        </div>
                    )}
                </div>

                <br />

                <div className="relative overflow-x-auto mt-1 pb-5">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                        {!isLoadingVouchers && vouchers?.length > 0 && (
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
                                        Code
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Loại voucher
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Giá trị voucher
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Giá trị đơn hàng tối thiểu
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Số lượng voucher
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Trạng thái voucher
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Ngày hết hạn
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Ngày tạo
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                        )}

                        <tbody>
                            {isLoadingVouchers ? (
                                <tr>
                                    <td colSpan={999}>
                                        <div className="flex items-center justify-center w-full min-h-[400px]">
                                            <CircularProgress color="inherit" />
                                        </div>
                                    </td>
                                </tr>
                            ) : vouchers?.length > 0 ? (
                                vouchers?.map((voucher) => {
                                    return (
                                        <tr key={voucher._id} className="odd:bg-white even:bg-gray-50 border-b">
                                            <td className="px-6 pr-0 py-2">
                                                <div className="w-[60px]">
                                                    <Checkbox
                                                        {...label}
                                                        size="small"
                                                        checked={selectedVouchers?.includes(voucher._id)}
                                                        onChange={() => handleSelectVoucher(voucher._id)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p
                                                    onClick={() =>
                                                        setOpenVoucherDetailsModal({
                                                            open: true,
                                                            voucher: voucher,
                                                        })
                                                    }
                                                    className="w-[120px] text-red cursor-pointer"
                                                >
                                                    {voucher.code}
                                                </p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[60px]">
                                                    {voucher.discountType === 'fixed' ? (
                                                        <span className="text-blue-500 text-[14px]">VND</span>
                                                    ) : (
                                                        <span className="text-yellow-500 text-[14px]">%</span>
                                                    )}
                                                </p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[250px]">
                                                    {voucher.discountType === 'fixed'
                                                        ? `${formatCurrency(voucher.discountValue)}`
                                                        : `${voucher.discountValue}%`}
                                                </p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[250px]">{formatCurrency(voucher.minOrderValue)}</p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[120px]">{voucher.quantityVoucher || 0}</p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        checked={voucher.isActive}
                                                        onChange={() => handleToggleIsActive(voucher._id)}
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                    />
                                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                                </label>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[100px]">{formatDate(voucher.expiresAt)}</p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[100px]">{formatDate(voucher.createdAt)}</p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className="flex items-center gap-1">
                                                    <Tooltip title="Xem chi tiết" placement="top">
                                                        <Button
                                                            onClick={() =>
                                                                setOpenVoucherDetailsModal({
                                                                    open: true,
                                                                    voucher: voucher,
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
                                                                model: 'Cập nhật voucher',
                                                                id: voucher?._id,
                                                            })
                                                        }
                                                    >
                                                        <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                            <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Xoá" placement="top">
                                                        <Button
                                                            onClick={() => handleClickOpen(voucher._id)}
                                                            className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                                        >
                                                            <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={999}>
                                        <div className="flex items-center justify-center w-full min-h-[400px]">
                                            <span className="text-gray-500">Chưa có đơn hàng</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoadingVouchers && vouchers?.length > 0 && (
                    <div className="flex items-center justify-center pt-5 pb-5 px-4">
                        <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} color="primary" />
                    </div>
                )}
            </div>

            {/* Voucher Details */}
            <Dialog
                disableScrollLock
                fullWidth={true}
                maxWidth="lg"
                open={openVoucherDetailsModal.open}
                onClose={handleCloseVoucherDetailsModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="orderDetailsModal"
            >
                <DialogContent>
                    <div className="bg-[#fff] p-4 container">
                        <div className="w-full userDetailsModalContainer relative">
                            <Button
                                className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[6px] right-[15px] !bg-[#f1f1f1]"
                                onClick={handleCloseVoucherDetailsModal}
                            >
                                <IoCloseSharp className="text-[20px]" />
                            </Button>

                            <div className="container bg-white p-6 rounded-lg shadow-md" id="order-details">
                                <h2 className="text-gray-700 text-xl border-b pb-4 mb-4 font-[600]">
                                    Thông tin voucher
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Code</span>
                                        <span className="text-red">{openVoucherDetailsModal?.voucher?.code}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Loại voucher</span>
                                        <span className="text-gray-700">
                                            {openVoucherDetailsModal?.voucher?.discountType === 'fixed' ? (
                                                <span className="text-blue-500 text-[14px]">VND</span>
                                            ) : (
                                                <span className="text-yellow-500 text-[14px]">%</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Giá trị voucher</span>
                                        <span className="text-gray-700">
                                            {openVoucherDetailsModal?.voucher?.discountType === 'fixed'
                                                ? `${formatCurrency(openVoucherDetailsModal?.voucher?.discountValue)}`
                                                : `${openVoucherDetailsModal?.voucher?.discountValue}%`}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Giá trị đơn hàng tối thiểu</span>
                                        <span className="text-gray-700">
                                            {formatCurrency(openVoucherDetailsModal?.voucher?.minOrderValue)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Trạng thái voucher</span>
                                        {openVoucherDetailsModal?.voucher?.isActive ? (
                                            <span className="text-green-500 text-[14px]">Kích hoạt</span>
                                        ) : (
                                            <span className="text-red-500 text-[14px]">Vô hiệu hóa</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Ngày hết hạn</span>
                                        <span className="text-gray-700">
                                            {formatDate(openVoucherDetailsModal?.voucher?.createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Ngày tạo</span>
                                        <span className="text-gray-700">
                                            {formatDate(openVoucherDetailsModal?.voucher?.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Xoá voucher?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn xoá voucher này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Huỷ</Button>
                    {isLoadingDeleteVoucher === true ? (
                        <CircularProgress color="inherit" />
                    ) : (
                        <Button className="btn-red" onClick={handleDeleteVoucher} autoFocus>
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
                <DialogTitle id="alert-dialog-title">{'Xoá tất cả voucher?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn xoá tất cả voucher này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMultiple}>Huỷ</Button>
                    {isLoadingMultiple === true ? (
                        <CircularProgress color="inherit" />
                    ) : (
                        <Button className="btn-red" onClick={handleDeleteMultipleVouchers} autoFocus>
                            Xác nhận
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default VoucherPage;

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};
