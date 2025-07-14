import { FaArrowUp } from 'react-icons/fa';
import { FaArrowDown } from 'react-icons/fa';

import { GoDownload } from 'react-icons/go';
import { Button, Divider } from '@mui/material';

const MessageDetails = () => {
    return (
        <div className="flex-1 bg-white overflow-scroll">
            <div className="user py-[16px] px-[20px] flex flex-col items-center gap-5 ">
                <img
                    className="w-[100px] h-[100px] object-cover rounded-full "
                    src="https://res.cloudinary.com/dd4zrjxvc/image/upload/v1751901361/rubystore/bomu30uagxgz7acxjz05.jpg"
                    alt=""
                />
                <h2>Sun Sight</h2>
                <p className="text-green-500 -mt-[8px] mb-0">Đang hoạt động</p>
            </div>
            <Divider />
            <div className="info p-5 flex flex-col gap-[12px] ">
                <div className="option">
                    <div className="title flex items-center justify-between ">
                        <span>Cài đặt</span>
                        <Button className="!w-[40px] !min-w-[40px] h-[40px] p-[10px] bg-[rgba(17, 25, 40, 0.3)] !rounded-full bg-gray-100 hover:bg-gray-200">
                            <FaArrowUp className="text-[20px] text-gray-800 " />
                        </Button>
                    </div>
                </div>
                <div className="option">
                    <div className="title flex items-center justify-between ">
                        <span>Chính sách quyền riêng tư</span>
                        <Button className="!w-[40px] !min-w-[40px] h-[40px] p-[10px] bg-[rgba(17, 25, 40, 0.3)] !rounded-full bg-gray-100 hover:bg-gray-200">
                            <FaArrowUp className="text-[20px] text-gray-800" />
                        </Button>
                    </div>
                </div>
                <div className="option">
                    <div className="title flex items-center justify-between ">
                        <span>Tải hình ảnh</span>
                        <Button className="!w-[40px] !min-w-[40px] h-[40px] p-[10px] bg-[rgba(17, 25, 40, 0.3)] !rounded-full bg-gray-100 hover:bg-gray-200">
                            <FaArrowDown className="text-[20px] text-gray-800" />
                        </Button>
                    </div>
                    <div className="photos flex flex-col gap-5 mt-5 ">
                        <div className="photoItem flex items-center justify-between ">
                            <div className="photoDetails flex items-center gap-5 ">
                                <img
                                    className="w-[40px] h-[40px] object-cover rounded-md "
                                    src="https://res.cloudinary.com/dd4zrjxvc/image/upload/v1751901361/rubystore/bomu30uagxgz7acxjz05.jpg"
                                    alt=""
                                />
                                <span className="text-[14px] text-gray-600 font-[400] ">photo_2025_07_11</span>
                            </div>
                            <Button className="!w-[40px] !min-w-[40px] h-[40px] p-[10px] bg-[rgba(17, 25, 40, 0.3)] !rounded-full bg-gray-100 hover:bg-gray-200">
                                <GoDownload className="text-[20px] text-gray-800" />
                            </Button>
                        </div>
                        <div className="photoItem flex items-center justify-between ">
                            <div className="photoDetails flex items-center gap-5 ">
                                <img
                                    className="w-[40px] h-[40px] object-cover rounded-md "
                                    src="https://res.cloudinary.com/dd4zrjxvc/image/upload/v1751901361/rubystore/bomu30uagxgz7acxjz05.jpg"
                                    alt=""
                                />
                                <span className="text-[14px] text-gray-600 font-[400] ">photo_2025_07_11</span>
                            </div>
                            <Button className="!w-[40px] !min-w-[40px] h-[40px] p-[10px] bg-[rgba(17, 25, 40, 0.3)] !rounded-full bg-gray-100 hover:bg-gray-200">
                                <GoDownload className="text-[20px] text-gray-800" />
                            </Button>
                        </div>
                        <div className="photoItem flex items-center justify-between ">
                            <div className="photoDetails flex items-center gap-5 ">
                                <img
                                    className="w-[40px] h-[40px] object-cover rounded-md "
                                    src="https://res.cloudinary.com/dd4zrjxvc/image/upload/v1751901361/rubystore/bomu30uagxgz7acxjz05.jpg"
                                    alt=""
                                />
                                <span className="text-[14px] text-gray-600 font-[400] ">photo_2025_07_11</span>
                            </div>
                            <Button className="!w-[40px] !min-w-[40px] h-[40px] p-[10px] bg-[rgba(17, 25, 40, 0.3)] !rounded-full bg-gray-100 hover:bg-gray-200">
                                <GoDownload className="text-[20px] text-gray-800" />
                            </Button>
                        </div>

                        <div className="photoItem flex items-center justify-between ">
                            <div className="photoDetails flex items-center gap-5 ">
                                <img
                                    className="w-[40px] h-[40px] object-cover rounded-md "
                                    src="https://res.cloudinary.com/dd4zrjxvc/image/upload/v1751901361/rubystore/bomu30uagxgz7acxjz05.jpg"
                                    alt=""
                                />
                                <span className="text-[14px] text-gray-600 font-[400] ">photo_2025_07_11</span>
                            </div>
                            <Button className="!w-[40px] !min-w-[40px] h-[40px] p-[10px] bg-[rgba(17, 25, 40, 0.3)] !rounded-full bg-gray-100 hover:bg-gray-200">
                                <GoDownload className="text-[20px] text-gray-800" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageDetails;
