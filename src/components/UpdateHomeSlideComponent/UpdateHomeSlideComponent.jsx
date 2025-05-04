import React, { useContext, useEffect, useState } from 'react';

import './UpdateHomeSlideComponent.scss';
import UploadSingleImageComponent from '../UploadSingleImageComponent/UploadSingleImageComponent';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Button, CircularProgress } from '@mui/material';
import axiosClient from '../../apis/axiosClient';
import { MyContext } from '../../App';

const UpdateHomeSlideComponent = () => {
    const [formFields, setFormFields] = useState({
        image: null,
    });
    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(MyContext);
    const { id } = context.isOpenFullScreenPanel || {};
    useEffect(() => {
        const fetchHomeSlide = async () => {
            try {
                const { data } = await axiosClient.get(`/api/homeSlide/${id}`);
                if (data.success) {
                    setFormFields((prev) => ({
                        ...prev,
                        image: data?.homeSlide?.image || null,
                    }));
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchHomeSlide();
    }, [id]);

    const handleRemoveImage = () => {
        setFormFields((prev) => ({
            ...prev,
            image: null,
        }));
    };

    const handleUploadImage = (file) => {
        const preview = URL.createObjectURL(file);
        setFormFields({
            image: {
                file,
                preview,
            },
        });
    };

    const handleUpdateHomeSlide = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', formFields?.image?.file); // chỉ 1 ảnh

            const { data } = await axiosClient.put(`/api/homeSlide/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('dataUpda: ', data);
            if (data.success) {
                context.openAlertBox('success', data.message);
                context.setIsOpenFullScreenPanel({ open: false });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật slide thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="p-5 bg-gray-50">
            <form className="form p-8 py-3 max-h-[800px] ">
                <div className="scroll overflow-y-scroll">
                    <div className="col w-full p-5 px-0">
                        <h3 className="font-[700] text-[18px] mb-3">Hình ảnh</h3>
                        <div className="grid grid-cols-7 gap-4">
                            {formFields.image && (
                                <div className="uploadBoxWrapper relative">
                                    <span
                                        className="absolute w-[25px] h-[25px] rounded-full overflow-hidden bg-red-700 -top-[10px] -right-[10px] z-50 flex items-center justify-center cursor-pointer"
                                        onClick={handleRemoveImage}
                                    >
                                        <IoMdClose className="text-white text-[20px]" />
                                    </span>
                                    <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-full bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
                                        <LazyLoadImage
                                            alt="Image preview"
                                            className="w-full h-full object-cover"
                                            effect="blur"
                                            src={formFields.image.preview || formFields.image}
                                        />
                                    </div>
                                </div>
                            )}

                            <UploadSingleImageComponent multiple={false} onUpload={handleUploadImage} />
                        </div>
                        <p className="italic mt-4 text-gray-500 text-sm">
                            (Chỉ chọn một ảnh mỗi lần, ảnh mới sẽ ghi đè ảnh cũ)
                        </p>
                    </div>

                    <br />
                    <Button onClick={handleUpdateHomeSlide} className="btn-blue w-full !normal-case flex gap-2">
                        {isLoading === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-[25px] text-white" />
                                <span className="text-[16px]">Cập nhật home slide</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default UpdateHomeSlideComponent;
