import React, { forwardRef, useContext, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
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
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaRegEye } from 'react-icons/fa6';
import { GoTrash } from 'react-icons/go';
import { Toolbar } from 'react-simple-wysiwyg';
import { IoMdClose } from 'react-icons/io';

import './StaffPage.scss';
import { MyContext } from '../../App';
import SearchBoxComponent from '../../components/SearchBoxComponent/SearchBoxComponent';
import BadgeRoleStatusComponent from '../../components/BadgeRoleStatusComponent/BadgeRoleStatusComponent';

import axiosClient from '../../apis/axiosClient';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { deleteMultipleStaffs, deleteStaff, fetchStaffs, toggleLockedStaff } from '../../redux/staffSlice';
import defaultAvatar from '../../assets/default_avatar.png';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StaffPage = () => {
    const context = useContext(MyContext);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const { staffs } = useSelector((state) => state.staffs);
    const dispatch = useDispatch();

    const [staffId, setStaffId] = useState(null);
    const [open, setOpen] = useState(false);
    const [isLoadingDeleteStaff, setIsLoadingDeleteStaff] = useState(false);
    const [isLoadingStaffs, setIsLoadingStaffs] = useState(false);
    const [openMultiple, setOpenMultiple] = useState(false);
    const [isLoadingMultiple, setIsLoadingMultiple] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [selectedStaffs, setSelectedStaffs] = useState([]);

    const [searchField, setSearchField] = useState('name');
    const [searchValue, setSearchValue] = useState('');
    const [isLockedValue, setIsLockedValue] = useState(false);
    const [roleValue, setIsRoleValue] = useState('');

    const handleChangeSearchField = (event) => {
        setSearchField(event.target.value);
    };

    const [openStaffDetailsModal, setOpenStaffDetailsModal] = useState({
        open: false,
        staff: null,
    });

    const handleCloseStaffDetailsModal = () => {
        setOpenStaffDetailsModal((prev) => ({
            ...prev,
            open: false,
        }));
        setTimeout(() => {
            setOpenStaffDetailsModal({
                open: false,
                staff: null,
            });
        }, 300);
    };

    const itemsPerPage = import.meta.env.VITE_LIMIT_DEFAULT;
    const [currentPage, setCurrentPage] = useState(1); // State lưu trang hiện tại
    const [totalPages, setTotalPages] = useState(1);
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    useEffect(() => {
        setIsLoadingStaffs(true);

        const handleDebounced = setTimeout(() => {
            const getStaffs = async () => {
                let url = `/api/staff/getStaffsFromAdmin?page=${currentPage}&perPage=${itemsPerPage}`;
                try {
                    let finalValue = searchValue;

                    if (searchField === 'isLocked') finalValue = isLockedValue;
                    if (searchField === 'role') finalValue = roleValue;

                    if (finalValue && searchField) {
                        url += `&field=${searchField}&value=${finalValue}`;
                    }
                    const { data } = await axiosClient.get(url);
                    console.log('staffs: ', data);
                    if (data.success) {
                        dispatch(fetchStaffs(data?.staffs));
                        setTotalPages(data?.totalPages);
                    }
                } catch (error) {
                    console.error('error: ', error);
                } finally {
                    setIsLoadingStaffs(false);
                }
            };
            getStaffs();
        }, 500);

        return () => {
            clearTimeout(handleDebounced);
        };
    }, [currentPage, searchValue, isLockedValue, roleValue]);

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            staffs.map((staff) => ({
                Avatar: staff?.avatar !== '' ? staff?.avatar : 'Không có avatar',
                'Tên nhân viên': staff?.name,
                Email: staff?.email,
                'Số điện thoại': staff?.phoneNumber,
                'Địa chỉ':
                    staff?.address?.streetLine &&
                    staff?.address?.ward &&
                    staff?.address?.district &&
                    staff?.address?.city
                        ? `Đường ${staff?.address?.streetLine || ''}, Phường ${staff?.address?.ward || ''}, Quận ${
                              staff?.address?.district || ''
                          }, Thành phố ${staff?.address?.city || ''}, ${staff?.address?.country || 'Việt Nam'}`
                        : '',
                'Trạng thái tài khoản': staff?.isLocked ? 'Đã khóa' : 'Hoạt động',
                'Ngày đăng nhập gần nhất': staff?.lastLoginDate ? formatDate(staff?.lastLoginDate) : 'Chưa đăng nhập',
                'Ngày tạo tài khoản': staff?.createdAt ? formatDate(staff?.createdAt) : '',
            }))
        );

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Nhân viên / Quản lý');

        // Xuất file Excel
        XLSX.writeFile(wb, 'NhanVien_QuanLy.xlsx');
    };

    const handleSelectStaff = (staffId) => {
        setSelectedStaffs((prevSelectedStaffs) => {
            let updatedSelectedStaffs;

            if (prevSelectedStaffs?.includes(staffId)) {
                // Nếu đã chọn thì bỏ chọn
                updatedSelectedStaffs = prevSelectedStaffs?.filter((id) => id !== staffId);
            } else {
                // Nếu chưa chọn thì chọn
                updatedSelectedStaffs = [...prevSelectedStaffs, staffId];
            }

            const allSelectedOnPage = staffs?.every((staff) => updatedSelectedStaffs?.includes(staff._id));
            setIsCheckedAll(allSelectedOnPage);

            return updatedSelectedStaffs;
        });
    };

    const handleSelectAll = () => {
        const currentPageIds = staffs?.map((staff) => staff._id);
        if (!isCheckedAll) {
            // Thêm các sản phẩm ở trang hiện tại
            const newSelected = Array.from(new Set([...selectedStaffs, ...currentPageIds]));
            setSelectedStaffs(newSelected);
            setIsCheckedAll(true);
        } else {
            // Bỏ các sản phẩm ở trang hiện tại
            const newSelected = selectedStaffs?.filter((id) => !currentPageIds.includes(id));
            setSelectedStaffs(newSelected);
            setIsCheckedAll(false);
        }
    };
    useEffect(() => {
        const allSelectedOnPage = staffs?.every((staff) => selectedStaffs?.includes(staff._id));
        setIsCheckedAll(allSelectedOnPage);
    }, [staffs, selectedStaffs]);

    useEffect(() => {
        setSelectedStaffs(selectedStaffs);
    }, [selectedStaffs]);

    const handleDeleteMultipleStaffs = async () => {
        setIsLoadingMultiple(true);

        try {
            const { data } = await axiosClient.delete(`/api/staff/deleteMultipleStaffsFromAdmin`, {
                data: { staffIds: selectedStaffs },
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(deleteMultipleStaffs({ staffIds: selectedStaffs }));

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
        setStaffId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseMultiple = () => {
        setOpenMultiple(false);
    };
    const handleDeleteStaff = async () => {
        setIsLoadingDeleteStaff(true);
        try {
            const { data } = await axiosClient.delete(`/api/staff/deleteStaffFromAdmin/${staffId}`);
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(deleteStaff({ _id: staffId }));
                handleClose();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', error.response.data.message);
        } finally {
            setIsLoadingDeleteStaff(false);
        }
    };

    const handleToggleIsLocked = async (staffId) => {
        try {
            const { data } = await axiosClient.patch(`/api/staff/toggleStaffLockStatusFromAdmin/${staffId}`);
            if (data.success) {
                dispatch(
                    toggleLockedStaff({
                        staffId,
                        isLocked: data.isLocked,
                    })
                );
                context.openAlertBox('success', data.message);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật isLocked:', error);
            context.openAlertBox('error', error.response.data.message);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0">
                <h2 className="text-[18px] font-[600]">Danh sách nhân viên</h2>

                <div
                    className={`col ${
                        context.isisOpenSidebar === true ? 'w-[25%]' : 'w-[22%]'
                    }] ml-auto flex items-center gap-3`}
                >
                    {staffs?.length > 1 && (isCheckedAll || selectedStaffs?.length > 1) && (
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
                                model: 'Thêm nhân viên',
                            })
                        }
                    >
                        <IoMdAdd />
                        Thêm nhân viên
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
                                <MenuItem value="name">Tên</MenuItem>
                                <MenuItem value="email">Email</MenuItem>
                                <MenuItem value="phoneNumber">Số điện thoại</MenuItem>
                                <MenuItem value="isLocked">Trạng thái tài khoản</MenuItem>
                                <MenuItem value="role">Chức vụ</MenuItem>
                            </Select>
                        )}
                    </div>
                    {/* Name, email, phoneNumber */}
                    {['name', 'email', 'phoneNumber'].includes(searchField) && (
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
                                    placeholder="Tìm thông tin...."
                                    required
                                />
                            </div>
                        </div>
                    )}
                    {/* Status isLocked */}
                    {searchField === 'isLocked' && (
                        <div className="col w-[68%] mt-[18px]">
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                sx={{ height: '42px', marginTop: '10px' }}
                                size="small"
                                className="w-full !h-[42px]"
                                value={isLockedValue}
                                onChange={(e) => setIsLockedValue(e.target.value)}
                            >
                                <MenuItem sx={{ fontWeight: 400, color: '#22c55e' }} value={false}>
                                    Hoạt động
                                </MenuItem>
                                <MenuItem sx={{ fontWeight: 400, color: '#ef4444' }} value={true}>
                                    Bị khóa
                                </MenuItem>
                            </Select>
                        </div>
                    )}
                    {/* Role */}
                    {searchField === 'role' && (
                        <div className="col w-[68%] mt-[18px]">
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                sx={{ height: '42px', marginTop: '10px' }}
                                size="small"
                                className="w-full !h-[42px]"
                                value={roleValue}
                                onChange={(e) => setIsRoleValue(e.target.value)}
                            >
                                <MenuItem sx={{ fontWeight: 400, color: '#22c55e' }} value="admin">
                                    Quản lý
                                </MenuItem>
                                <MenuItem sx={{ fontWeight: 400, color: '#3b82f6' }} value="staff">
                                    Nhân viên
                                </MenuItem>
                            </Select>
                        </div>
                    )}
                </div>

                <br />

                <div className="relative overflow-x-auto mt-1 pb-5">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                        {!isLoadingStaffs && staffs?.length > 0 && (
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
                                    <th scope="col" className="px-0 py-3 whitespace-nowrap">
                                        Avatar
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
                                        Vai trò
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Trạng thái tài khoản
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
                            {isLoadingStaffs ? (
                                <tr>
                                    <td colSpan={999}>
                                        <div className="flex items-center justify-center w-full min-h-[400px]">
                                            <CircularProgress color="inherit" />
                                        </div>
                                    </td>
                                </tr>
                            ) : staffs?.length > 0 ? (
                                staffs?.map((staff) => {
                                    return (
                                        <tr key={staff._id} className="odd:bg-white even:bg-gray-50 border-b">
                                            <td className="px-6 pr-0 py-2">
                                                <div className="w-[60px]">
                                                    <Checkbox
                                                        {...label}
                                                        size="small"
                                                        checked={selectedStaffs?.includes(staff._id)}
                                                        onChange={() => handleSelectStaff(staff._id)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-0 py-2">
                                                <div className="flex items-center gap-4 w-[100px]">
                                                    <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                                        <Link to="/product/2">
                                                            {staff?.avatar ? (
                                                                <img
                                                                    src={staff.avatar || defaultAvatar}
                                                                    className="w-full group-hover:scale-105 transition-all"
                                                                    alt="Avatar"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                                                                    No image
                                                                </div>
                                                            )}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p
                                                    onClick={() =>
                                                        setOpenStaffDetailsModal({
                                                            open: true,
                                                            staff: staff,
                                                        })
                                                    }
                                                    className="w-[120px] text-primary font-[500] cursor-pointer"
                                                >
                                                    {staff.name}
                                                </p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[260px] max-w-[280px]">{staff.email}</p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[80px]">{staff.phoneNumber}</p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[250px]">
                                                    {staff.address?.streetLine &&
                                                    staff.address?.ward &&
                                                    staff.address?.district &&
                                                    staff.address?.city
                                                        ? `Đường ${staff.address.streetLine}, Phường ${staff.address.ward}, Quận ${staff.address.district}, Thành phố ${staff.address.city}`
                                                        : ''}
                                                </p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <BadgeRoleStatusComponent status={staff?.role} />
                                            </td>
                                            <td className="px-6 py-2">
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        checked={staff.isLocked}
                                                        onChange={() => handleToggleIsLocked(staff._id)}
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                    />
                                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                                </label>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[80px]">{formatDate(staff.createdAt)}</p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className="flex items-center gap-1">
                                                    <Tooltip title="Xem chi tiết" placement="top">
                                                        <Button
                                                            onClick={() =>
                                                                setOpenStaffDetailsModal({
                                                                    open: true,
                                                                    staff: staff,
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
                                                                model: 'Cập nhật nhân viên',
                                                                id: staff?._id,
                                                            })
                                                        }
                                                    >
                                                        <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                            <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Xoá" placement="top">
                                                        <Button
                                                            onClick={() => handleClickOpen(staff._id)}
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
                                            <span className="text-gray-500">Chưa có nhân viên / quản lý nào</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoadingStaffs && staffs?.length > 0 && (
                    <div className="flex items-center justify-center pt-5 pb-5 px-4">
                        <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} color="primary" />
                    </div>
                )}
            </div>

            {/* staff Details */}
            {staffs?.length > 0 && (
                <Dialog
                    disableScrollLock
                    fullWidth={true}
                    maxWidth="lg"
                    open={openStaffDetailsModal.open}
                    onClose={handleCloseStaffDetailsModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    className="orderDetailsModal"
                >
                    <DialogContent>
                        <div className="bg-[#fff] p-4 container">
                            <div className="w-full staffDetailsModalContainer relative">
                                <Button
                                    className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[6px] right-[15px] !bg-[#f1f1f1]"
                                    onClick={handleCloseStaffDetailsModal}
                                >
                                    <IoCloseSharp className="text-[20px]" />
                                </Button>

                                <div className="container bg-white p-6 rounded-lg shadow-md" id="order-details">
                                    <h2 className="text-gray-700 text-xl border-b pb-4 mb-4 font-[600]">
                                        Thông tin khách hàng
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Avatar</span>
                                            <img
                                                className="w-[70px] h-[70px] object-cover rounded-md"
                                                src={openStaffDetailsModal?.staff?.avatar || defaultAvatar}
                                                alt="Avatar"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Họ và tên</span>
                                            <span className="text-gray-700">{openStaffDetailsModal?.staff?.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Email</span>
                                            <span className="text-gray-700">{openStaffDetailsModal?.staff?.email}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Số điện thoại</span>
                                            <span className="text-gray-700">
                                                {openStaffDetailsModal?.staff?.phoneNumber}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Địa chỉ</span>
                                            <span className="text-gray-700">
                                                {`Đường ${
                                                    openStaffDetailsModal?.staff?.address?.streetLine || ''
                                                }, Phường ${openStaffDetailsModal?.staff?.address?.ward || ''}, Quận ${
                                                    openStaffDetailsModal?.staff?.address?.district || ''
                                                }, Thành phố ${openStaffDetailsModal?.staff?.address?.city || ''}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Trạng thái tài khoản</span>
                                            <BadgeRoleStatusComponent status={openStaffDetailsModal?.staff?.role} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Trạng thái tài khoản</span>
                                            {openStaffDetailsModal?.staff?.isLocked ? (
                                                <span className="text-red-500 text-[14px]">Bị khóa</span>
                                            ) : (
                                                <span className="text-green-500 text-[14px]">Hoạt động</span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Ngày đăng nhập gần nhất</span>
                                            <span className="text-gray-700">
                                                {formatDate(openStaffDetailsModal?.staff?.lastLoginDate)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Ngày tạo</span>
                                            <span className="text-gray-700">
                                                {formatDate(openStaffDetailsModal?.staff?.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {staffs?.length > 0 && (
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'Xoá nhân viên?'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Bạn có chắc chắn xoá nhân viên này không?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Huỷ</Button>
                        {isLoadingDeleteStaff === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <Button className="btn-red" onClick={handleDeleteStaff} autoFocus>
                                Xác nhận
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            )}

            {staffs?.length > 0 && (
                <Dialog
                    open={openMultiple}
                    onClose={handleCloseMultiple}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'Xoá tất cả nhân viên?'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Bạn có chắc chắn xoá tất cả nhân viên này không?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMultiple}>Huỷ</Button>
                        {isLoadingMultiple === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <Button className="btn-red" onClick={handleDeleteMultipleStaffs} autoFocus>
                                Xác nhận
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default StaffPage;

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
