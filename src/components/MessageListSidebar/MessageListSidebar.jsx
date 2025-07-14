import UserInfoMessageDetailsSidebar from './UserInfoMessageDetailsSidebar/UserInfoMessageDetailsSidebar';
import ChatListSidebar from './ChatListSidebar/ChatListSidebar';

const MessageListSidebar = () => {
    return (
        <div className="flex-1 flex flex-col bg-white">
            <UserInfoMessageDetailsSidebar />
            <ChatListSidebar />
        </div>
    );
};

export default MessageListSidebar;
