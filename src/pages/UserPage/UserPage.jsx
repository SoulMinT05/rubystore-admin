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
import { IoCloseSharp, IoSearch } from 'react-icons/io5';
import { BiExport } from 'react-icons/bi';
import * as XLSX from 'xlsx';
import { Toolbar } from 'react-simple-wysiwyg';
import { IoMdClose } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaRegEye } from 'react-icons/fa6';
import { GoTrash } from 'react-icons/go';

import './UserPage.scss';
import { MyContext } from '../../App';
import SearchBoxComponent from '../../components/SearchBoxComponent/SearchBoxComponent';
import axiosClient from '../../apis/axiosClient';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMultipleUsers, deleteUser, fetchUsers, toggleLockedUser } from '../../redux/userSlice';
import defaultAvatar from '../../assets/default_avatar.png';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const UserPage = () => {
    const context = useContext(MyContext);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const { users } = useSelector((state) => state.users);
    const dispatch = useDispatch();

    const [userId, setUserId] = useState(null);
    const [open, setOpen] = useState(false);
    const [isLoadingDeleteUser, setIsLoadingDeleteUser] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [openMultiple, setOpenMultiple] = useState(false);
    const [isLoadingMultiple, setIsLoadingMultiple] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const [searchField, setSearchField] = useState('name');
    const [searchValue, setSearchValue] = useState('');
    const [isLockedValue, setIsLockedValue] = useState(false);

    const handleChangeSearchField = (event) => {
        setSearchField(event.target.value);
    };

    const [openUserDetailsModal, setOpenUserDetailsModal] = useState({
        open: false,
        user: null,
    });

    const handleCloseUserDetailsModal = () => {
        setOpenUserDetailsModal((prev) => ({
            ...prev,
            open: false,
        }));
        setTimeout(() => {
            setOpenUserDetailsModal({
                open: false,
                user: null,
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
        setIsLoadingUsers(true);

        const handleDebounced = setTimeout(() => {
            const getUsers = async () => {
                let url = `/api/user/usersFromAdmin?page=${currentPage}&perPage=${itemsPerPage}`;
                try {
                    let finalValue = searchValue;

                    if (searchField === 'isLocked') finalValue = isLockedValue;

                    if (finalValue && searchField) {
                        url += `&field=${searchField}&value=${finalValue}`;
                    }
                    const { data } = await axiosClient.get(url);
                    console.log('users: ', data);
                    if (data.success) {
                        dispatch(fetchUsers(data?.users));
                        setTotalPages(data?.totalPages);
                    }
                } catch (error) {
                    console.error('error: ', error);
                } finally {
                    setIsLoadingUsers(false);
                }
            };
            getUsers();
        }, 500);

        return () => {
            clearTimeout(handleDebounced);
        };
    }, [currentPage, searchValue, isLockedValue]);

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            users.map((user) => ({
                Avatar: user?.avatar !== '' ? user?.avatar : 'Không có avatar',
                'Tên người dùng': user?.name,
                Email: user?.email,
                'Số điện thoại': user?.phoneNumber,
                'Địa chỉ':
                    user?.address?.streetLine && user?.address?.ward && user?.address?.district && user?.address?.city
                        ? `Đường ${user?.address?.streetLine || ''}, Phường ${user?.address?.ward || ''}, Quận ${
                              user?.address?.district || ''
                          }, Thành phố ${user?.address?.city || ''}, ${user?.address?.country || 'Việt Nam'}`
                        : '',
                'Trạng thái tài khoản': user?.isLocked ? 'Đã khóa' : 'Hoạt động',
                'Ngày đăng nhập gần nhất': user?.lastLoginDate ? formatDate(user?.lastLoginDate) : 'Chưa đăng nhập',
                'Ngày tạo tài khoản': user?.createdAt ? formatDate(user?.createdAt) : '',
            }))
        );

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Người dùng');

        // Xuất file Excel
        XLSX.writeFile(wb, 'NguoiDung.xlsx');
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers((prevSelectedUsers) => {
            let updatedSelectedUsers;

            if (prevSelectedUsers?.includes(userId)) {
                // Nếu đã chọn thì bỏ chọn
                updatedSelectedUsers = prevSelectedUsers?.filter((id) => id !== userId);
            } else {
                // Nếu chưa chọn thì chọn
                updatedSelectedUsers = [...prevSelectedUsers, userId];
            }

            const allSelectedOnPage = users?.every((user) => updatedSelectedUsers?.includes(user._id));
            setIsCheckedAll(allSelectedOnPage);

            return updatedSelectedUsers;
        });
    };

    const handleSelectAll = () => {
        const currentPageIds = users?.map((product) => product._id);
        if (!isCheckedAll) {
            // Thêm các sản phẩm ở trang hiện tại
            const newSelected = Array.from(new Set([...selectedUsers, ...currentPageIds]));
            setSelectedUsers(newSelected);
            setIsCheckedAll(true);
        } else {
            // Bỏ các sản phẩm ở trang hiện tại
            const newSelected = selectedUsers?.filter((id) => !currentPageIds.includes(id));
            setSelectedUsers(newSelected);
            setIsCheckedAll(false);
        }
    };
    useEffect(() => {
        const allSelectedOnPage = users?.every((user) => selectedUsers?.includes(user._id));
        setIsCheckedAll(allSelectedOnPage);
    }, [users, selectedUsers]);

    useEffect(() => {
        setSelectedUsers(selectedUsers);
    }, [selectedUsers]);

    const handleDeleteMultipleUsers = async () => {
        setIsLoadingMultiple(true);

        try {
            const { data } = await axiosClient.delete(`/api/user/deleteMultipleUsersFromAdmin`, {
                data: { userIds: selectedUsers },
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(deleteMultipleUsers({ userIds: selectedUsers }));

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
        setUserId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseMultiple = () => {
        setOpenMultiple(false);
    };
    const handleDeleteUser = async () => {
        setIsLoadingDeleteUser(true);
        try {
            const { data } = await axiosClient.delete(`/api/user/deleteUserFromAdmin/${userId}`);
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(deleteUser({ _id: userId }));
                handleClose();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoadingDeleteUser(false);
        }
    };

    const handleToggleIsLocked = async (userId) => {
        try {
            const { data } = await axiosClient.patch(`/api/user/toggleUserLockStatus/${userId}`);
            if (data.success) {
                dispatch(
                    toggleLockedUser({
                        userId,
                        isLocked: data.isLocked,
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
                <h2 className="text-[18px] font-[600]">Danh sách người dùng</h2>

                <div
                    className={`col ${
                        context.isisOpenSidebar === true ? 'w-[25%]' : 'w-[22%]'
                    }] ml-auto flex items-center gap-3`}
                >
                    {users?.length > 1 && (isCheckedAll || selectedUsers?.length > 1) && (
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
                                model: 'Thêm người dùng',
                            })
                        }
                    >
                        <IoMdAdd />
                        Thêm người dùng
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
                </div>

                <br />

                <div className="relative overflow-x-auto mt-1 pb-5">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                        {!isLoadingUsers && users?.length > 0 && (
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
                            {isLoadingUsers ? (
                                <tr>
                                    <td colSpan={999}>
                                        <div className="flex items-center justify-center w-full min-h-[400px]">
                                            <CircularProgress color="inherit" />
                                        </div>
                                    </td>
                                </tr>
                            ) : users?.length > 0 ? (
                                users?.map((user) => {
                                    return (
                                        <tr key={user._id} className="odd:bg-white even:bg-gray-50 border-b">
                                            <td className="px-6 pr-0 py-2">
                                                <div className="w-[60px]">
                                                    <Checkbox
                                                        {...label}
                                                        size="small"
                                                        checked={selectedUsers?.includes(user._id)}
                                                        onChange={() => handleSelectUser(user._id)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-0 py-2">
                                                <div className="flex items-center gap-4 w-[100px]">
                                                    <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                                        <Link to="/product/2">
                                                            <img
                                                                src={user?.avatar || defaultAvatar}
                                                                className="w-full group-hover:scale-105 transition-all"
                                                                alt="Avatar"
                                                            />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p
                                                    onClick={() =>
                                                        setOpenUserDetailsModal({
                                                            open: true,
                                                            user: user,
                                                        })
                                                    }
                                                    className="w-[120px] text-primary font-[500] cursor-pointer"
                                                >
                                                    {user.name}
                                                </p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[260px] max-w-[280px]">{user.email}</p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[80px]">{user.phoneNumber}</p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[250px]">
                                                    {user.address?.streetLine &&
                                                    user.address?.ward &&
                                                    user.address?.district &&
                                                    user.address?.city
                                                        ? `Đường ${user.address.streetLine}, Phường ${user.address.ward}, Quận ${user.address.district}, Thành phố ${user.address.city}`
                                                        : ''}
                                                </p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        checked={user.isLocked}
                                                        onChange={() => handleToggleIsLocked(user._id)}
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                    />
                                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                                </label>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[80px]">{formatDate(user.createdAt)}</p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className="flex items-center gap-1">
                                                    <Tooltip title="Xem chi tiết" placement="top">
                                                        <Button
                                                            onClick={() =>
                                                                setOpenUserDetailsModal({
                                                                    open: true,
                                                                    user: user,
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
                                                                model: 'Cập nhật người dùng',
                                                                id: user?._id,
                                                            })
                                                        }
                                                    >
                                                        <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                            <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Xoá" placement="top">
                                                        <Button
                                                            onClick={() => handleClickOpen(user._id)}
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
                                            <span className="text-gray-500">Chưa có người dùng</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoadingUsers && users?.length > 0 && (
                    <div className="flex items-center justify-center pt-5 pb-5 px-4">
                        <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} color="primary" />
                    </div>
                )}
            </div>

            {/* User Details */}

            {users?.length > 0 && (
                <Dialog
                    disableScrollLock
                    fullWidth={true}
                    maxWidth="lg"
                    open={openUserDetailsModal.open}
                    onClose={handleCloseUserDetailsModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    className="orderDetailsModal"
                >
                    <DialogContent>
                        <div className="bg-[#fff] p-4 container">
                            <div className="w-full userDetailsModalContainer relative">
                                <Button
                                    className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[6px] right-[15px] !bg-[#f1f1f1]"
                                    onClick={handleCloseUserDetailsModal}
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
                                                src={openUserDetailsModal?.user?.avatar || defaultAvatar}
                                                alt="Avatar"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Họ và tên</span>
                                            <span className="text-gray-700">{openUserDetailsModal?.user?.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Email</span>
                                            <span className="text-gray-700">{openUserDetailsModal?.user?.email}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Số điện thoại</span>
                                            <span className="text-gray-700">
                                                {openUserDetailsModal?.user?.phoneNumber}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Địa chỉ</span>
                                            <span className="text-gray-700">
                                                {`Đường ${
                                                    openUserDetailsModal?.user?.address?.streetLine || ''
                                                }, Phường ${openUserDetailsModal?.user?.address?.ward || ''}, Quận ${
                                                    openUserDetailsModal?.user?.address?.district || ''
                                                }, Thành phố ${openUserDetailsModal?.user?.address?.city || ''}`}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Trạng thái tài khoản</span>
                                            {openUserDetailsModal?.user?.isLocked ? (
                                                <span className="text-red-500 text-[14px]">Bị khóa</span>
                                            ) : (
                                                <span className="text-green-500 text-[14px]">Hoạt động</span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Ngày đăng nhập gần nhất</span>
                                            <span className="text-gray-700">
                                                {formatDate(openUserDetailsModal?.user?.lastLoginDate)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Ngày tạo</span>
                                            <span className="text-gray-700">
                                                {formatDate(openUserDetailsModal?.user?.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {users?.length > 0 && (
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'Xoá người dùng?'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Bạn có chắc chắn xoá người dùng này không?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Huỷ</Button>
                        {isLoadingDeleteUser === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <Button className="btn-red" onClick={handleDeleteUser} autoFocus>
                                Xác nhận
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            )}

            {users?.length > 0 && (
                <Dialog
                    open={openMultiple}
                    onClose={handleCloseMultiple}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'Xoá tất cả người dùng?'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Bạn có chắc chắn xoá tất cả người dùng này không?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMultiple}>Huỷ</Button>
                        {isLoadingMultiple === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <Button className="btn-red" onClick={handleDeleteMultipleUsers} autoFocus>
                                Xác nhận
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default UserPage;

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
