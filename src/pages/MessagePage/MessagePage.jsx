import MessageListSidebar from '../../components/MessageListSidebar/MessageListSidebar';
import ChatComponent from '../../components/ChatComponent/ChatComponent';
import MessageDetails from '../../components/MessageDetails/MessageDetails';
import { Breadcrumbs } from '@mui/material';
import { Link } from 'react-router-dom';

import './MessagePage.scss';
import ChatEmptyComponent from '../../components/ChatEmptyComponent/ChatEmptyComponent';

const MessagePage = () => {
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
                className="container message-container flex  h-[100vh] rounded-xl border"
                style={{ borderColor: 'rgba(255, 255, 255, 0.125)' }}
            >
                <MessageListSidebar />
                <ChatEmptyComponent />
            </div>
        </div>
    );
};

export default MessagePage;
