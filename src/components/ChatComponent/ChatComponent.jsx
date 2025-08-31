import React, { useContext, useEffect, useRef, useState } from 'react';
import './ChatComponent.scss';
import { MyContext } from '../../App';

import { MdLocalPhone } from 'react-icons/md';
import { IoVideocamOutline } from 'react-icons/io5';
import { BiInfoCircle } from 'react-icons/bi';
import { Button, CircularProgress, Divider } from '@mui/material';

import { MdOutlineInsertPhoto } from 'react-icons/md';
import { MdOutlineCameraAlt } from 'react-icons/md';
import { HiMicrophone } from 'react-icons/hi2';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import { LuSend } from 'react-icons/lu';

import EmojiPicker from 'emoji-picker-react';
import axiosClient from '../../apis/axiosClient';
import { useParams } from 'react-router-dom';
import { formatOnlineTime, formatDisplayTime } from '../../utils/formatTimeChat';
import { useDispatch } from 'react-redux';
import { sendMessage } from '../../redux/messageSlice';
import { socket } from '../../config/socket';
import defaultAvatar from '../../assets/default_avatar.png';

const ChatComponent = ({ messagesDetails, receiverId }) => {
    const { id } = useParams();
    const context = useContext(MyContext);
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);
    const messageContainerRef = useRef(null);
    const fileInputRef = useRef(null);

    const [text, setText] = useState('');
    const [openEmoji, setOpenEmoji] = useState(false);
    const [isSendMessage, setIsSendMessage] = useState(false);

    const [userInfo, setUserInfo] = useState('');

    useEffect(() => {
        const getUserDetails = async () => {
            const { data } = await axiosClient.get(`/api/message/getUserDetails/${id}`);
            console.log('userDetails: ', data);
            if (data?.success) {
                setUserInfo(data?.user);
            }
        };
        getUserDetails();
    }, [id]);

    useEffect(() => {
        socket.on('userOnlineStatus', (data) => {
            console.log('userOnlineStatus: ', data);
            setUserInfo((prev) => ({
                ...prev,
                ...data,
            }));
        });
        return () => {
            socket.off('userOnlineStatus');
        };
    }, []);

    const scrollToBottom = () => {
        if (!messagesEndRef.current || !messageContainerRef.current) return;

        const endEl = messagesEndRef.current;
        const container = messageContainerRef.current;

        const offset = 120; // 👈 bạn muốn cách đáy 40px
        container.scrollTop = endEl.offsetTop - container.offsetTop - offset;
    };
    useEffect(() => {
        scrollToBottom();
    }, [messagesDetails]);

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpenEmoji(false);
    };

    const handlePhotoClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileImagesChange = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsSendMessage(true);
        try {
            const fileArray = Array.from(files);

            for (const file of fileArray) {
                const formData = new FormData();
                formData.append('images', file); // Gửi từng ảnh riêng

                const { data } = await axiosClient.post(`/api/message/sendMessage/${receiverId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('dataSendImages: ', data);
                if (data.success) {
                    const fixedMessage = {
                        ...data.newMessage,
                        senderId: context.userInfo,
                    };
                    dispatch(sendMessage(fixedMessage));
                }
            }
        } catch (error) {
            console.log('error: ', error);
            context.openAlertBox(error.response?.data?.error || 'Lỗi gửi ảnh');
        } finally {
            setIsSendMessage(false);
        }
    };

    const handleSendMessage = async () => {
        if (!text) return;
        setIsSendMessage(true);
        try {
            const formData = new FormData();
            formData.append('text', text);

            const { data } = await axiosClient.post(`/api/message/sendMessage/${receiverId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (data.success) {
                const fixedMessage = {
                    ...data.newMessage,
                    senderId: context.userInfo, // ép lại là chính mình
                };
                dispatch(sendMessage(fixedMessage));
                setText('');
            }
            console.log('dataSendMsg: ', data);
        } catch (error) {
            console.log('error: ', error);
            context.openAlertBox(error.response.data.error);
        } finally {
            setIsSendMessage(false);
        }
    };
    return (
        <div
            className={`relative ${context?.isChatOpen ? 'flex' : 'hidden'} lg:flex flex-col flex-[3] h-full bg-white`}
        >
            {/* Left Divider */}
            <div className="absolute top-0 left-0 w-[1px] h-full bg-[rgba(0,0,0,0.12)] z-10"></div>

            {/* Right Divider */}
            <div className="absolute top-0 right-0 w-[1px] h-full bg-[rgba(0,0,0,0.12)] z-10"></div>

            {/* TOP */}
            <div className="top p-5 flex items-center justify-between">
                <div className="user flex items-center gap-3">
                    {context?.windowWidth < 1024 && (
                        <div onClick={() => context?.setIsChatOpen(false)} className="">
                            <IoChevronBack className="text-[22px]" />
                        </div>
                    )}
                    <div className="relative">
                        <img
                            className="w-[40px] h-[40px] object-cover rounded-full"
                            src={userInfo?.avatar || defaultAvatar}
                            alt=""
                        />
                        {userInfo?.isOnline === true && (
                            <span className="absolute bottom-1 right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                    </div>
                    <div className="texts gap-1">
                        <span className="text-[13px] sm:text-[14px] lg:text-[16px] font-[600]"> {userInfo?.name}</span>
                        <p className="text-[12px] lg:text-[13px] font-[300] mt-0">
                            {userInfo?.isOnline === true ? (
                                <span className="text-green-500 font-medium">Đang hoạt động</span>
                            ) : (
                                <span className="text-gray-500">
                                    Hoạt động {formatOnlineTime(userInfo?.lastOnline)}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="icons flex items-center gap-0">
                    <Button className="!w-[40px] !min-w-[40px] h-[40px] !rounded-full bg-gray-100 hover:bg-gray-200">
                        <MdLocalPhone className="text-[18px] text-gray-800" />
                    </Button>
                    <Button className="!w-[40px] !min-w-[40px] h-[40px] !rounded-full bg-gray-100 hover:bg-gray-200">
                        <IoVideocamOutline className="text-[18px] text-gray-800" />
                    </Button>
                </div>
            </div>

            <Divider />
            {/* CENTER */}
            <div ref={messageContainerRef} className="center p-4 flex-1 overflow-scroll flex flex-col gap-5">
                {messagesDetails?.length > 0 &&
                    messagesDetails?.map((msg, index) => {
                        const prevMsg = index > 0 ? messagesDetails[index - 1] : null;

                        const isOwn = msg?.senderId?._id === context?.userInfo?._id;
                        const isLast = index === messagesDetails.length - 1;

                        let showTime = true;
                        if (prevMsg) {
                            const prevTime = new Date(prevMsg.createdAt).getTime();
                            const currTime = new Date(msg.createdAt).getTime();
                            const diffMinutes = Math.abs(currTime - prevTime) / 1000 / 60;
                            // console.log(
                            //     'prevTime, currTime, Math.abs(currTime - prevTime) / 1000 / 60: ',
                            //     prevTime,
                            //     currTime,
                            //     Math.abs(currTime - prevTime) / 1000 / 60
                            // );

                            // Nếu cùng người gửi và cách nhau < 5 phút thì ẩn time
                            if (diffMinutes < 5) {
                                showTime = false;
                            }
                        }

                        return (
                            <React.Fragment key={msg._id}>
                                {showTime && (
                                    <div className="flex justify-center my-2">
                                        <span className=" text-gray-600 text-xs px-2 py-1 rounded-full">
                                            {formatDisplayTime(msg?.createdAt)}
                                        </span>
                                    </div>
                                )}

                                {/* Tin nhắn */}
                                <div ref={isLast ? messagesEndRef : null} className={`message ${isOwn ? 'own' : ''}`}>
                                    {!isOwn && (
                                        <img
                                            className="w-[30px] h-[30px] object-cover rounded-full"
                                            src={msg?.senderId?.avatar}
                                            alt={msg?.senderId?.name}
                                        />
                                    )}
                                    <div className="texts">
                                        {msg?.images?.length > 0 &&
                                            msg.images.map((img, i) => (
                                                <img className="w-[300px]" key={i} src={img} alt="image" />
                                            ))}
                                        {msg?.text && <p className="my-0 text-[13px] lg:text-[14px]">{msg.text}</p>}
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
            </div>
            <Divider />

            {/* BOTTOM */}
            <div className="bottom mt-auto px-[6px] py-5 lg:p-5 flex items-center justify-between ">
                <div className="icons">
                    <Button
                        onClick={handlePhotoClick}
                        className="!w-[40px] !min-w-[40px] h-[40px] !rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                        <MdOutlineInsertPhoto className="text-[18px] text-gray-800" />
                    </Button>
                    <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileImagesChange}
                        className="hidden"
                    />
                </div>
                <div className="relative flex-1 h-[60px] max-h-[160px]">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && !isSendMessage && text.trim()) {
                                e.preventDefault(); // tránh xuống dòng
                                handleSendMessage();
                            }
                        }}
                        placeholder="Tìm kiếm..."
                        rows={1}
                        className="w-full resize-none overflow-y-auto max-h-[200px] text-[13px] lg:text-[14px] bg-gray-100 p-[20px] pr-10 rounded-[8px] focus:outline-none overflow-hidden"
                    />
                    <Button className="!absolute top-1/2 right-2 -translate-y-1/2 !w-[35px] !min-w-[35px] h-[35px] !rounded-full bg-gray-100 hover:bg-gray-200">
                        <LuSend className="text-[18px] text-gray-800" />
                    </Button>
                </div>
                <div className="emoji relative">
                    <Button
                        onClick={() => setOpenEmoji(!openEmoji)}
                        className="!w-[40px] !min-w-[40px] h-[40px] !rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                        <MdOutlineEmojiEmotions className="text-[18px] text-gray-800" />
                    </Button>
                    <div className="picker absolute bottom-[50px] right-[8px] ">
                        <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button
                    onClick={handleSendMessage}
                    className=" bg-blue-500 hover:bg-blue-600 text-white normal-case px-[18px] py-2 rounded-md transition duration-200"
                >
                    {isSendMessage ? (
                        <CircularProgress className="circ-white" size={18} thickness={5} sx={{ color: 'white' }} />
                    ) : (
                        <span className="text-[13px] lg:text-[14px]">Gửi</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;
