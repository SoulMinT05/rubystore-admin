import './ChatEmptyComponent.scss';
import noMessage from '../../assets/no-message.png';

const ChatEmptyComponent = () => {
    return (
        <div className="relative flex flex-col flex-[3] h-full bg-white">
            {/* Left Divider */}
            <div className="absolute top-0 left-0 w-[1px] h-full bg-[rgba(0,0,0,0.12)] z-10"></div>

            {/* Right Divider */}
            <div className="absolute top-0 right-0 w-[1px] h-full bg-[rgba(0,0,0,0.12)] z-10"></div>

            <div className="flex items-center flex-col m-auto">
                <div className="">
                    <img className="w-[100px] h-[100px] " src={noMessage} alt="" />
                </div>
                <span className="text-[14px] font-[500] my-[14px] ">
                    Hãy giải đáp câu hỏi và hỗ trợ cho người dùng.
                </span>
            </div>
        </div>
    );
};

export default ChatEmptyComponent;
