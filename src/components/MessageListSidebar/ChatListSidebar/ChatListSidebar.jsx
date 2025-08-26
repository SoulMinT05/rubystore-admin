import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider, TextField } from '@mui/material';
import { IoIosSearch } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa6';
import { FaMinus } from 'react-icons/fa6';
import axiosClient from '../../../apis/axiosClient';
import { fetchMessagesSidebar, updateOnlineStatusSidebar } from '../../../redux/messageSlice';
import { Link, useParams } from 'react-router-dom';
import { MyContext } from '../../../App';
import { socket } from '../../../config/socket';

const ChatListSidebar = () => {
    const context = useContext(MyContext);
    const { id } = useParams();
    const dispatch = useDispatch();
    const { messagesSidebar } = useSelector((state) => state.message);

    useEffect(() => {
        const getMessagesForUsers = async () => {
            const { data } = await axiosClient.get('/api/message/getUsersInSidebar');
            if (data?.success) {
                dispatch(fetchMessagesSidebar(data.users));
            }
        };
        getMessagesForUsers();
    }, [id]);

    useEffect(() => {
        socket.on('userOnlineStatus', (data) => {
            console.log('userOnlineStatus: ', data);
            dispatch(updateOnlineStatusSidebar(data));
        });
        return () => {
            socket.off('userOnlineStatus');
        };
    }, []);

    return (
        <>
            <div className="chatList ">
                <div className="flex items-center gap-3 w-full">
                    <div className="relative flex-1 px-2 text-[13px] lg:text-[14px] h-[40px]">
                        <Button className="!absolute top-1/2 left-3 -translate-y-1/2 !w-[35px] !min-w-[35px] h-[35px] !rounded-full bg-gray-100 hover:bg-gray-200">
                            <IoIosSearch className="text-[18px] text-gray-600" />
                        </Button>
                        <input
                            type="text"
                            placeholder="Tìm kiếm đoạn chat..."
                            className="w-full h-full bg-gray-100 p-2 pl-10 pr-10 rounded-full focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="chatList flex-1 overflow-scroll mt-4">
                {messagesSidebar?.length > 0 &&
                    messagesSidebar?.map((message, index) => {
                        return (
                            <Link
                                onClick={() => {
                                    if (window.innerWidth < 1024) context?.setIsChatOpen(true);
                                }}
                                key={message._id}
                                to={`/message/${message._id}`}
                            >
                                <div className="item flex items-center p-4 gap-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                    <div className="relative">
                                        <img
                                            className="w-[50px] h-[50px] object-cover rounded-full "
                                            src={message?.avatar}
                                            alt={message?.name}
                                        />
                                        {message?.isOnline && (
                                            <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                                        )}
                                    </div>
                                    <div className="texts flex flex-col">
                                        <span className="text-[16px] font-[500] ">{message?.name}</span>
                                        <p
                                            className={`text-[14px] font-[500] my-[2px] ${
                                                message?.role === 'user' ? 'text-yellow-500' : 'text-blue-500'
                                            }`}
                                        >
                                            Người dùng
                                        </p>
                                    </div>
                                </div>
                                {index !== messagesSidebar?.length - 1 && <Divider />}
                            </Link>
                        );
                    })}
            </div>
        </>
    );
};

export default ChatListSidebar;
