import React from 'react';
import { FaRegImages } from 'react-icons/fa6';

import './UploadImageComponent.scss';

const UploadImageComponent = ({ multiple, onUpload }) => {
    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        onUpload(files);
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

export default UploadImageComponent;
