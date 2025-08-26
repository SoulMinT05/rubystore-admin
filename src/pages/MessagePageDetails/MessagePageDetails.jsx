import MessageListSidebar from '../../components/MessageListSidebar/MessageListSidebar';
import ChatComponent from '../../components/ChatComponent/ChatComponent';
import MessageDetails from '../../components/MessageDetails/MessageDetails';
import { Breadcrumbs } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../../apis/axiosClient';
import { fetchMessagesDetails } from '../../redux/messageSlice';

import './MessagePageDetails.scss';
import { socket } from '../../config/socket';
import { sendMessage } from '../../redux/messageSlice';
import { MyContext } from '../../App';

const MessagePageDetails = () => {
    const { id } = useParams();

    const dispatch = useDispatch();
    const { messagesDetails } = useSelector((state) => state.message);

    useEffect(() => {
        const getMessageDetailsForStaffs = async () => {
            const { data } = await axiosClient.get(`/api/message/getMessagesForStaffs/${id}`);
            console.log('dataMessageForStaffs: ', data);
            if (data?.success) {
                dispatch(fetchMessagesDetails(data?.messages));
            }
        };
        getMessageDetailsForStaffs();
    }, [id]);

    useEffect(() => {
        socket.on('newMessage', (data) => {
            console.log('Admin nhan newMessage: ', data);
            dispatch(sendMessage(data));
        });
        return () => {
            socket.off('newMessage');
        };
    }, []);

    return (
        <div className="!my-[28px]">
            <div className="pb-4 pt-0  container flex items-center justify-between">
                <div className="">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" to="/" className="link transition !text-[16px]">
                            Trang chủ
                        </Link>
                        <Link underline="hover" color="inherit" to="/message" className="link transition !text-[16px]">
                            Tin nhắn
                        </Link>
                    </Breadcrumbs>
                </div>
            </div>
            <div
                className="container flex  h-[94vh] rounded-xl border"
                style={{ borderColor: 'rgba(255, 255, 255, 0.125)' }}
            >
                <MessageListSidebar />
                <ChatComponent messagesDetails={messagesDetails} receiverId={id} />
            </div>
        </div>
    );
};

export default MessagePageDetails;
