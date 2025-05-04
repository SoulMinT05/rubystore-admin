import React, { useContext, useState } from 'react';

import './AddHomeSlideComponent.scss';
import UploadSingleImageComponent from '../UploadSingleImageComponent/UploadSingleImageComponent';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Button, CircularProgress } from '@mui/material';
import axiosClient from '../../apis/axiosClient';
import { MyContext } from '../../App';

const AddHomeSlideComponent = () => {
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);

    const handleUploadImage = (file) => {
        setImage(file); // ✅ lưu ảnh vào state
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!image) return alert('Vui lòng chọn ảnh');

        const formData = new FormData();
        formData.append('image', image); // chỉ 1 ảnh

        try {
            setIsLoading(true);
            const { data } = await axiosClient.post('/api/homeSlide/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });

            if (data?.success) {
                setImage(data?.image);
                context.openAlertBox('success', data?.message);
                context.setIsOpenFullScreenPanel({
                    open: false,
                });
            }
        } catch (err) {
            console.error('Lỗi upload slide:', err);
            alert('Tạo thất bại!');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <section className="p-5 bg-gray-50">
            <form className="form p-8 py-3 max-h-[800px]" onSubmit={handleUpload}>
                <div className="scroll overflow-y-scroll pt-4">
                    <div className="grid grid-cols-7 gap-4">
                        {image && (
                            <div className="uploadBoxWrapper relative">
                                <span className="absolute w-[25px] h-[25px] rounded-full overflow-hidden bg-red-700 -top-[10px] -right-[10px] z-50 flex items-center justify-center cursor-pointer">
                                    <IoMdClose className="text-white text-[20px]" />
                                </span>
                                <div
                                    className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] 
                                    bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative"
                                >
                                    <LazyLoadImage
                                        alt={'Image add product'}
                                        className="w-full h-full object-cover"
                                        effect="blur"
                                        wrapperProps={{
                                            // If you need to, you can tweak the effect transition using the wrapper style.
                                            style: { transitionDelay: '0.3s' },
                                        }}
                                        src={URL.createObjectURL(image)}
                                    />
                                </div>
                            </div>
                        )}
                        <UploadSingleImageComponent multiple={false} onUpload={handleUploadImage} />
                    </div>

                    <br />
                    <Button type="submit" className="btn-blue w-full !normal-case flex gap-2">
                        {isLoading === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-[25px] text-white" />
                                <span className="text-[16px]">Thêm banner</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default AddHomeSlideComponent;
