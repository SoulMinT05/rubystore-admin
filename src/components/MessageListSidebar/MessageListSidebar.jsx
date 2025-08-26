import UserInfoMessageDetailsSidebar from './UserInfoMessageDetailsSidebar/UserInfoMessageDetailsSidebar';
import ChatListSidebar from './ChatListSidebar/ChatListSidebar';
import { MyContext } from '../../App';
import { useContext } from 'react';

const MessageListSidebar = () => {
    const context = useContext(MyContext);
    return (
        <div className={`${context?.isChatOpen ? 'hidden' : 'flex'} lg:flex flex-1 flex-col  bg-white`}>
            <UserInfoMessageDetailsSidebar />
            <ChatListSidebar />
        </div>
    );
};

export default MessageListSidebar;
