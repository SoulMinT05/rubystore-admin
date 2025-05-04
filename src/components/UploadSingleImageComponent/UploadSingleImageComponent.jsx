import React from 'react';
import { FaRegImages } from 'react-icons/fa6';

import './UploadSingleImageComponent.scss';

const UploadSingleImageComponent = ({ multiple, onUpload }) => {
    const handleChange = (e) => {
        const file = e.target.files[0];
        onUpload(file);
    };
    return (
        <div
            className="uploadBox p-3 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] 
        bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative"
        >
            <FaRegImages className="text-[40px] opacity-35 pointer-events-none" />
            <h4 className="text-[14px] pointer-events-none">Tải lên hình ảnh</h4>
            <input
                multiple={multiple !== undefined ? multiple : false}
                type="file"
                className="absolute top-0 left-0 w-full h-full z-50 opacity-0 "
                onChange={handleChange}
            />
        </div>
    );
};

export default UploadSingleImageComponent;
