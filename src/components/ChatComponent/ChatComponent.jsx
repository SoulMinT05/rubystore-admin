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
import { formatDisplayTime } from '../../utils/formatTimeChat';
import { useDispatch } from 'react-redux';
import { sendMessage } from '../../redux/messageSlice';

const ChatComponent = ({ messagesDetails, receiverId }) => {
    const { id } = useParams();
    const context = useContext(MyContext);
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);
    const messageContainerRef = useRef(null);

    const [text, setText] = useState('');
    const [openEmoji, setOpenEmoji] = useState(false);
    const [isSendMessage, setIsSendMessage] = useState(false);

    const [userInfo, setUserInfo] = useState('');

    useEffect(() => {
        const getUserDetails = async () => {
            const { data } = await axiosClient.get(`/api/message/getUserDetails/${id}`);
            if (data?.success) {
                setUserInfo(data?.user);
            }
        };
        getUserDetails();
    }, [id]);

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

    const handleSendMessage = async () => {
        setIsSendMessage(true);
        try {
            const formData = new FormData();
            formData.append('text', text);

            // Append hình ảnh
            // formFields.images.forEach((img) => {
            //     formData.append('images', img.file);
            // });
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
        <div className="relative flex flex-col flex-[3] h-full bg-white">
            {/* Left Divider */}
            <div className="absolute top-0 left-0 w-[1px] h-full bg-[rgba(0,0,0,0.12)] z-10"></div>

            {/* Right Divider */}
            <div className="absolute top-0 right-0 w-[1px] h-full bg-[rgba(0,0,0,0.12)] z-10"></div>

            {/* TOP */}
            <div className="top p-5 flex items-center justify-between">
                <div className="user flex items-center gap-3">
                    <img className="w-[40px] h-[40px] object-cover rounded-full" src={userInfo?.avatar} alt="" />
                    <div className="texts gap-1">
                        <span className="text-[17px] font-[600]"> {userInfo?.name}</span>
                        <p className="text-gray-500 text-[13px] font-[300] mt-0">Online 7 phút trước</p>
                    </div>
                </div>
                <div className="icons flex items-center gap-0">
                    <Button className="!w-[40px] !min-w-[40px] h-[40px] !rounded-full bg-gray-100 hover:bg-gray-200">
                        <MdLocalPhone className="text-[20px] text-gray-800" />
                    </Button>
                    <Button className="!w-[40px] !min-w-[40px] h-[40px] !rounded-full bg-gray-100 hover:bg-gray-200">
                        <IoVideocamOutline className="text-[20px] text-gray-800" />
                    </Button>
                    <Button className="!w-[40px] !min-w-[40px] h-[40px] !rounded-full bg-gray-100 hover:bg-gray-200">
                        <BiInfoCircle className="text-[20px] text-gray-800" />
                    </Button>
                </div>
            </div>

            <Divider />
            {/* CENTER */}
            <div ref={messageContainerRef} className="center p-4 flex-1 overflow-scroll flex flex-col gap-5 ">
                {messagesDetails?.length > 0 &&
                    messagesDetails?.map((msg, index) => {
                        const isOwn = msg?.senderId?._id === context?.userInfo?._id;
                        const isLast = index === messagesDetails.length - 1;
                        return (
                            <div
                                key={msg?._id}
                                ref={isLast ? messagesEndRef : null}
                                className={`message ${isOwn ? 'own' : ''}`}
                            >
                                {!isOwn && (
                                    <img
                                        className="w-[30px] h-[30px] object-cover rounded-full"
                                        src={msg?.senderId?.avatar}
                                        alt={msg?.senderId?.name}
                                    />
                                )}
                                <div className="texts">
                                    {msg?.images?.length > 0 &&
                                        msg.images.map((img, i) => <img key={i} src={img} alt="image" />)}
                                    {msg?.text && <p className="my-0 text-[15px] ">{msg.text}</p>}
                                    <span className="!mt-0">{formatDisplayTime(msg?.createdAt)}</span>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <Divider />

            {/* BOTTOM */}
            <div className="bottom mt-auto p-5 flex items-center justify-between ">
                <div className="icons">
                    <Button className="!w-[40px] !min-w-[40px] h-[40px] !rounded-full bg-gray-100 hover:bg-gray-200">
                        <MdOutlineInsertPhoto className="text-[20px] text-gray-800" />
                    </Button>
                    <Button className="!w-[40px] !min-w-[40px] h-[40px] !rounded-full bg-gray-100 hover:bg-gray-200">
                        <MdOutlineCameraAlt className="text-[20px] text-gray-800" />
                    </Button>
                    <Button className="!w-[40px] !min-w-[40px] h-[40px] !rounded-full bg-gray-100 hover:bg-gray-200">
                        <HiMicrophone className="text-[20px] text-gray-800" />
                    </Button>
                </div>
                <div className="relative flex-1 h-[40px]">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isSendMessage && text.trim()) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full h-full bg-gray-100 p-[20px] pr-10 rounded-[8px] focus:outline-none"
                    />
                    <Button className="!absolute top-1/2 right-2 -translate-y-1/2 !w-[35px] !min-w-[35px] h-[35px] !rounded-full bg-gray-100 hover:bg-gray-200">
                        <LuSend className="text-[20px] text-gray-800" />
                    </Button>
                </div>
                <div className="emoji relative">
                    <Button
                        onClick={() => setOpenEmoji(!openEmoji)}
                        className="!w-[40px] !min-w-[40px] h-[40px] !rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                        <MdOutlineEmojiEmotions className="text-[20px] text-gray-800" />
                    </Button>
                    <div className="picker absolute bottom-[50px]">
                        <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button
                    onClick={handleSendMessage}
                    className=" bg-blue-500 hover:bg-blue-600 text-white normal-case px-[18px] py-2 rounded-md transition duration-200"
                >
                    {isSendMessage ? <CircularProgress color="inherit" /> : 'Gửi'}
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;
