import { Button, CircularProgress, Rating, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { LuSend } from 'react-icons/lu';
import { MyContext } from '../../App';
import axiosClient from '../../apis/axiosClient';
import { IoCloseSharp } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { addReply } from '../../redux/reviewSlice';
import defaultAvatar from '../../assets/default_avatar.png';

const ReplyInputComponent = () => {
    const context = useContext(MyContext);
    const dispatch = useDispatch();

    const { id } = context.isOpenFullScreenPanel || {};
    const [review, setReview] = useState({});
    const [replyText, setReplyText] = useState('');
    const [isAddReply, setIsAddReply] = useState(false);

    useEffect(() => {
        const getDetailsReview = async () => {
            const { data } = await axiosClient.get(`/api/review/getDetailsReview/${id}`);
            if (data.success) {
                setReview(data?.review);
            }
        };
        getDetailsReview();
    }, []);

    const handleCloseReplyModal = () => {
        context.setOpenReplyModal((prev) => ({
            ...prev,
            open: false,
        }));
        setTimeout(() => {
            context.setOpenReplyModal({
                open: false,
                review: null,
            });
        }, 300);
    };

    const handleAddReply = async () => {
        if (!replyText) return;
        setIsAddReply(true);

        try {
            const { data } = await axiosClient.post(`/api/review/addReplyToReview/${id}`, {
                replyText,
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                setReview((prev) => ({
                    ...prev,
                    replies: [...prev.replies, data.newReply],
                }));
                dispatch(
                    addReply({
                        reviewId: id,
                        newReply: data?.newReply,
                    })
                );
                setReplyText('');
            }
        } catch (error) {
            console.log('error: ', error);
            context.openAlertBox('error', error.response.data.message);
        } finally {
            setIsAddReply(false);
        }
    };

    return (
        <div className="bg-[#fff] p-4 container">
            <div className="w-full userDetailsModalContainer relative">
                <Button
                    className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[6px] right-[15px] !bg-[#f1f1f1]"
                    onClick={handleCloseReplyModal}
                >
                    <IoCloseSharp className="text-[20px]" />
                </Button>

                <div className="container bg-white p-6 rounded-lg shadow-md" id="order-details">
                    <h2 className="text-gray-700 text-xl border-b pb-4 mb-4 font-[600]">Phản hồi đánh giá</h2>
                    <div className="space-y-4">
                        <h2 className="text-gray-700 text-[18px] font-[500] ">Khách hàng</h2>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Avatar</span>
                            <img
                                className="w-[70px] h-[70px] object-cover rounded-md"
                                src={review?.userId?.avatar || defaultAvatar}
                                alt="Avatar"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Họ và tên</span>
                            <span className="text-blue-500">{review?.userId?.name}</span>
                        </div>
                        <h2 className="text-gray-700 text-[18px] font-[500] pt-4 border-t">Sản phẩm</h2>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">ID sản phẩm</span>
                            <span className="text-red">{review?.productId?._id}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Hình ảnh sản phẩm</span>
                            <img
                                className="w-[70px] h-[70px] object-cover rounded-md"
                                src={review?.productId?.images[0]}
                                alt="Avatar"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Tên sản phẩm</span>
                            <span className="text-blue-500">{review?.productId?.name}</span>
                        </div>
                        <h2 className="text-gray-700 text-[18px] font-[500] pt-4 border-t">Đánh giá</h2>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Câu đánh giá</span>
                            <span className="text-yellow-500">{review?.comment}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Đánh giá sao</span>
                            <span className="text-gray-700">
                                <Rating name="size-small" value={Number(review?.rating) || 0} readOnly size="small" />
                            </span>
                        </div>
                        <h2 className="text-gray-700 text-[18px] font-[500] pt-4 border-t">Phản hồi</h2>
                        {review?.replies?.length > 0 &&
                            review?.replies?.map((reply) => {
                                return (
                                    <div key={reply?._id} className="flex items-center bg-gray-50 p-4 rounded-lg">
                                        <div className="w-[10%] group cursor-pointer">
                                            <img
                                                alt="Image of an Apple iMac"
                                                className="w-[70px] h-[70px] object-cover rounded-md mr-4 group-hover:scale-105 transition-all"
                                                src={reply?.userId?.avatar || defaultAvatar}
                                            />
                                        </div>
                                        <div className="mx-4 w-[20%]">
                                            <p className="text-gray-700">{reply?.userId?.name}</p>
                                        </div>
                                        <div className="w-[60%] flex items-center justify-start gap-5">
                                            <p className="text-gray-700">{reply?.replyText}</p>
                                        </div>
                                        <div className="w-[10%] flex items-center justify-end gap-5">
                                            <p className="text-gray-700">{formatDate(reply?.createdAt)}</p>
                                        </div>
                                    </div>
                                );
                            })}

                        <h2 className="text-gray-700 text-[18px] font-[500] pt-4 border-t">Nhập phản hồi</h2>
                        <div className="flex gap-2 items-start">
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Viết phản hồi"
                                className="w-full mb-5"
                                multiline
                                rows={3}
                                name="comment"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isAddReply && replyText.trim()) {
                                        e.preventDefault();
                                        handleAddReply();
                                    }
                                }}
                            />
                            <Button
                                onClick={handleAddReply}
                                className="!w-[42px] !min-w-[42px] h-[42px] !rounded-full !bg-blue-500 hover:!bg-blue-600 transition-all duration-200 shadow-md"
                            >
                                {isAddReply ? (
                                    <CircularProgress size={20} thickness={5} sx={{ color: 'white' }} />
                                ) : (
                                    <LuSend className="text-[20px] text-white/90 group-hover:text-white" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReplyInputComponent;

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
