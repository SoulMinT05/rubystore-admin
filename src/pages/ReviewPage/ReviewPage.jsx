import React, { forwardRef, useContext, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

import './ReviewPage.scss';
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
    Rating,
    TextField,
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
import { deleteMultipleUsers, deleteUser } from '../../redux/userSlice';
import { fetchReviews } from '../../redux/reviewSlice';
import { LuSend } from 'react-icons/lu';
import ReplyInputComponent from '../../components/ReplyInputComponent/ReplyInputComponent';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ReviewPage = () => {
    const context = useContext(MyContext);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const { reviews } = useSelector((state) => state.reviews);
    const dispatch = useDispatch();

    const [reviewId, setReviewId] = useState(null);
    const [open, setOpen] = useState(false);
    const [isLoadingDeleteReview, setIsLoadingDeleteReview] = useState(false);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [openMultiple, setOpenMultiple] = useState(false);
    const [isLoadingMultiple, setIsLoadingMultiple] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [selectedReviews, setSelectedReviews] = useState([]);

    const [openReviewDetailsModal, setOpenReviewDetailsModal] = useState({
        open: false,
        review: null,
    });

    const handleCloseReviewDetailsModal = () => {
        setOpenReviewDetailsModal((prev) => ({
            ...prev,
            open: false,
        }));
        setTimeout(() => {
            setOpenReviewDetailsModal({
                open: false,
                review: null,
            });
        }, 300);
    };

    useEffect(() => {
        const getReviews = async () => {
            setIsLoadingReviews(true);
            try {
                const { data } = await axiosClient.get('/api/review/getAllReviews');
                if (data.success) {
                    dispatch(fetchReviews(data?.reviews));
                }
            } catch (error) {
                console.error('error: ', error);
            } finally {
                setIsLoadingReviews(false);
            }
        };
        getReviews();
    }, []);

    const itemsPerPage = 10;
    // State lưu trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    // Tính tổng số trang
    const totalPages = Math.ceil(reviews?.length / itemsPerPage);
    // Xử lý khi đổi trang
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };
    // Cắt dữ liệu theo trang
    const currentReviews = reviews?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            reviews.map((user) => ({
                Avatar: user?.avatar !== '' ? user?.avatar : 'Không có avatar',
                'Tên đánh giá': user?.name,
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
        XLSX.utils.book_append_sheet(wb, ws, 'Đánh giá sản phẩm');

        // Xuất file Excel
        XLSX.writeFile(wb, 'DanhGiaSanPham.xlsx');
    };

    const handleSelectReview = (reviewId) => {
        setSelectedReviews((prevSelectedReviews) => {
            let updatedSelectedReviews;

            if (prevSelectedReviews?.includes(reviewId)) {
                // Nếu đã chọn thì bỏ chọn
                updatedSelectedReviews = prevSelectedReviews?.filter((id) => id !== reviewId);
            } else {
                // Nếu chưa chọn thì chọn
                updatedSelectedReviews = [...prevSelectedReviews, reviewId];
            }

            const allSelectedOnPage = currentReviews?.every((user) => updatedSelectedReviews?.includes(user._id));
            setIsCheckedAll(allSelectedOnPage);

            return updatedSelectedReviews;
        });
    };

    const handleSelectAll = () => {
        const currentPageIds = currentReviews?.map((product) => product._id);
        if (!isCheckedAll) {
            // Thêm các sản phẩm ở trang hiện tại
            const newSelected = Array.from(new Set([...selectedReviews, ...currentPageIds]));
            setSelectedReviews(newSelected);
            setIsCheckedAll(true);
        } else {
            // Bỏ các sản phẩm ở trang hiện tại
            const newSelected = selectedReviews?.filter((id) => !currentPageIds.includes(id));
            setSelectedReviews(newSelected);
            setIsCheckedAll(false);
        }
    };
    useEffect(() => {
        const allSelectedOnPage = currentReviews?.every((user) => selectedReviews?.includes(user._id));
        setIsCheckedAll(allSelectedOnPage);
    }, [currentReviews, selectedReviews]);

    useEffect(() => {
        setSelectedReviews(selectedReviews);
    }, [selectedReviews]);

    const handleDeleteMultipleUsers = async () => {
        setIsLoadingMultiple(true);

        try {
            const { data } = await axiosClient.delete(`/api/user/deleteMultipleUsersFromAdmin`, {
                data: { reviewIds: selectedReviews },
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(deleteMultipleUsers({ reviewIds: selectedReviews }));

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
        setReviewId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseMultiple = () => {
        setOpenMultiple(false);
    };
    const handleDeleteUser = async () => {
        setIsLoadingDeleteReview(true);
        try {
            const { data } = await axiosClient.delete(`/api/user/deleteUserFromAdmin/${reviewId}`);
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(deleteUser({ _id: reviewId }));
                handleClose();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoadingDeleteReview(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0">
                <h2 className="text-[18px] font-[600]">Danh sách đánh giá</h2>

                <div
                    className={`col ${
                        context.isisOpenSidebar === true ? 'w-[25%]' : 'w-[22%]'
                    }] ml-auto flex items-center gap-3`}
                >
                    {(isCheckedAll || selectedReviews?.length > 1) && (
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

                <div className="relative overflow-x-auto mt-1 pb-5">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                        {!isLoadingReviews && currentReviews?.length > 0 && (
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
                                        Avatar khách hàng
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Họ và tên khách hàng
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Hình ảnh sản phẩm
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Tên sản phẩm
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Câu đánh giá
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Đánh giá sao
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Phản hồi
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Ngày đánh giá
                                    </th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                        )}

                        <tbody>
                            {isLoadingReviews === false ? (
                                reviews?.length > 0 &&
                                reviews?.map((review) => {
                                    return (
                                        <tr key={review._id} className="odd:bg-white even:bg-gray-50 border-b">
                                            <td className="px-6 pr-0 py-2">
                                                <div className="w-[60px]">
                                                    <Checkbox
                                                        {...label}
                                                        size="small"
                                                        checked={selectedReviews?.includes(review._id)}
                                                        onChange={() => handleSelectReview(review._id)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-0 py-2">
                                                <div className="flex items-center gap-4 w-[100px]">
                                                    <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                                        <img
                                                            src={review?.userId?.avatar}
                                                            className="w-full group-hover:scale-105 transition-all"
                                                            alt="Avatar"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p
                                                    onClick={() =>
                                                        setOpenReviewDetailsModal({
                                                            open: true,
                                                            review: review,
                                                        })
                                                    }
                                                    className="w-[120px] text-primary font-[500] cursor-pointer"
                                                >
                                                    {review?.userId?.name}
                                                </p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className="flex items-center gap-4 w-[100px]">
                                                    <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                                        <img
                                                            src={review?.productId?.images[0]}
                                                            className="w-full group-hover:scale-105 transition-all"
                                                            alt="Avatar"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[160px] max-w-[180px] line-clamp-2 ">
                                                    {review?.productId?.name}
                                                </p>
                                            </td>

                                            <td className="px-6 py-2">
                                                <p className="w-[260px] max-w-[280px] line-clamp-2">
                                                    {review?.comment}
                                                </p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <Rating
                                                    name="size-small"
                                                    value={Number(review?.rating) || 0}
                                                    readOnly
                                                    size="small"
                                                />
                                            </td>
                                            <td className="px-6 py-2">
                                                {review?.replies[0]?.replyText ? (
                                                    <p
                                                        className="w-[110px] text-green-500 cursor-pointer hover:underline transition-all"
                                                        onClick={() =>
                                                            context.setIsOpenFullScreenPanel({
                                                                open: true,
                                                                model: 'Phản hồi',
                                                                id: review?._id,
                                                            })
                                                        }
                                                    >
                                                        Xem phản hồi
                                                    </p>
                                                ) : (
                                                    <span
                                                        onClick={() =>
                                                            context.setIsOpenFullScreenPanel({
                                                                open: true,
                                                                model: 'Phản hồi',
                                                                id: review?._id,
                                                            })
                                                        }
                                                        className="w-[110px] text-blue-500 cursor-pointer hover:underline transition-all"
                                                    >
                                                        Phản hồi ngay
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-2">
                                                <p className="w-[80px]">{formatDate(review.createdAt)}</p>
                                            </td>

                                            <td className="px-6 py-2">
                                                <div className="flex items-center gap-1">
                                                    <Tooltip title="Xem chi tiết" placement="top">
                                                        <Button
                                                            onClick={() =>
                                                                setOpenReviewDetailsModal({
                                                                    open: true,
                                                                    review: review,
                                                                })
                                                            }
                                                            className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                                        >
                                                            <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Xoá" placement="top">
                                                        <Button
                                                            onClick={() => handleClickOpen(review._id)}
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
                                            <CircularProgress color="inherit" />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoadingReviews && currentReviews?.length > 0 && (
                    <div className="flex items-center justify-center pt-5 pb-5 px-4">
                        <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} color="primary" />
                    </div>
                )}
            </div>

            {/* Review Details */}
            <Dialog
                fullWidth={true}
                maxWidth="lg"
                open={openReviewDetailsModal.open}
                onClose={handleCloseReviewDetailsModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="orderDetailsModal"
            >
                <DialogContent>
                    <div className="bg-[#fff] p-4 container">
                        <div className="w-full userDetailsModalContainer relative">
                            <Button
                                className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[6px] right-[15px] !bg-[#f1f1f1]"
                                onClick={handleCloseReviewDetailsModal}
                            >
                                <IoCloseSharp className="text-[20px]" />
                            </Button>

                            <div className="container bg-white p-6 rounded-lg shadow-md" id="order-details">
                                <h2 className="text-gray-700 text-xl border-b pb-4 mb-4 font-[600]">
                                    Thông tin đánh giá từ khách hàng
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Avatar</span>
                                        <img
                                            className="w-[70px] h-[70px] object-cover rounded-md"
                                            src={openReviewDetailsModal?.review?.userId?.avatar}
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Họ và tên</span>
                                        <span className="text-blue-500">
                                            {openReviewDetailsModal?.review?.userId?.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">ID sản phẩm</span>
                                        <span className="text-red">
                                            {openReviewDetailsModal?.review?.productId?._id}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Hình ảnh sản phẩm</span>
                                        <img
                                            className="w-[70px] h-[70px] object-cover rounded-md"
                                            src={openReviewDetailsModal?.review?.productId?.images[0]}
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Tên sản phẩm</span>
                                        <span className="text-blue-500">
                                            {openReviewDetailsModal?.review?.productId?.name}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Câu đánh giá</span>
                                        <span className="text-yellow-500">
                                            {openReviewDetailsModal?.review?.comment}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Đánh giá sao</span>
                                        <span className="text-gray-700">
                                            <Rating
                                                name="size-small"
                                                value={Number(openReviewDetailsModal?.review?.rating) || 0}
                                                readOnly
                                                size="small"
                                            />
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Câu phản hồi</span>
                                        {openReviewDetailsModal?.review?.replies[0]?.replyText ? (
                                            <span className="text-gray-700">
                                                {openReviewDetailsModal?.review?.replies[0]?.replyText}
                                            </span>
                                        ) : (
                                            <span className="text-gray-700">Chưa có</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Họ và tên phản hồi</span>
                                        {openReviewDetailsModal?.review?.replies[0]?.userId?.name ? (
                                            <span className="text-green-500">
                                                {openReviewDetailsModal?.review?.replies[0]?.userId?.name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-700">Chưa có</span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Ngày tạo</span>
                                        <span className="text-gray-700">
                                            {formatDate(openReviewDetailsModal?.review?.createdAt)}
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
                <DialogTitle id="alert-dialog-title">{'Xoá đánh giá?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn xoá đánh giá này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Huỷ</Button>
                    {isLoadingDeleteReview === true ? (
                        <CircularProgress color="inherit" />
                    ) : (
                        <Button className="btn-red" onClick={handleDeleteUser} autoFocus>
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
                <DialogTitle id="alert-dialog-title">{'Xoá tất cả đánh giá?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn xoá tất cả đánh giá này không?
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
        </>
    );
};

export default ReviewPage;

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
