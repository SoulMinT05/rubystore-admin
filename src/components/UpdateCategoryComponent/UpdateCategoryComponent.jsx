import React, { useContext, useEffect, useState } from 'react';

import './UpdateCategoryComponent.scss';
import UploadImagesComponent from '../UploadImagesComponent/UploadImagesComponent';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Button, CircularProgress } from '@mui/material';
import axiosClient from '../../apis/axiosClient';
import { MyContext } from '../../App';

const UpdateCategoryComponent = () => {
    const [formFields, setFormFields] = useState({
        name: '',
        images: [], // ảnh cũ từ server trả về
        newImages: [], // ảnh mới hoặc preview ảnh mới
        deletedImages: [], // những ảnh user bấm xoá
    });
    const [isLoading, setIsLoading] = useState(false);

    const { setCategories } = useContext(MyContext);
    const context = useContext(MyContext);
    const { id } = context.isOpenFullScreenPanel || {};

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const { data } = await axiosClient.get(`/api/category/${id}`);
                if (data.success) {
                    setFormFields((prev) => ({
                        ...prev,
                        name: data?.category?.name,
                        newImages: data?.category?.images,
                    }));
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchCategory();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFields(() => {
            return {
                ...formFields,
                [name]: value,
            };
        });
    };

    const handleUploadImages = (files) => {
        const imagesArray = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setFormFields((prev) => ({
            ...prev,
            newImages: [...prev.newImages, ...imagesArray],
        }));
    };

    const handleRemoveImage = (index, imgUrl) => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa ảnh này?');
        if (!isConfirmed) return;

        let deletedImage = null;

        setFormFields((prev) => {
            const newImages = [...prev.newImages];
            const targetImage = newImages[index];

            deletedImage = targetImage.file ? imgUrl : targetImage;

            newImages.splice(index, 1);

            return {
                ...prev,
                newImages,
                deletedImages: [...prev.deletedImages, deletedImage],
            };
        });

        // Gọi context sau khi state được cập nhật (ngay sau setFormFields)
        context.openAlertBox('success', 'Xoá ảnh thành công');
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();

            formData.append('name', formFields.name);

            formData.append('deletedImages', JSON.stringify(formFields.deletedImages));

            formFields.newImages.forEach((img) => {
                if (img.file) {
                    formData.append('images', img.file);
                }
            });

            const { data } = await axiosClient.put(`/api/category/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (data.success) {
                context.openAlertBox('success', data.message);
                setCategories((prev) => {
                    return prev.map((category) =>
                        category._id === data?.updatedCategory._id
                            ? { ...category, name: data?.updatedCategory.name, images: data?.updatedCategory.images }
                            : category,
                    );
                });
                context.setIsOpenFullScreenPanel({
                    open: false,
                });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="p-5 bg-gray-50">
            <form className="form p-8 py-3 max-h-[800px] ">
                <div className="scroll overflow-y-scroll">
                    <div className="grid grid-cols-1 mb-3">
                        <div className="col w-[25%]">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Tên danh mục</h3>
                            <input
                                name="name"
                                value={formFields.name}
                                disabled={isLoading === true ? true : false}
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="col w-full p-5 px-0">
                        <h3 className="font-[700] text-[18px] mb-3">Hình ảnh</h3>
                        <div className="grid grid-cols-7 gap-4">
                            {formFields?.newImages?.map((img, index) => (
                                <div className="uploadBoxWrapper relative" key={index}>
                                    <span
                                        className="absolute w-[25px] h-[25px] rounded-full overflow-hidden bg-red-700 -top-[10px] -right-[10px] z-50 flex items-center justify-center cursor-pointer"
                                        onClick={() => handleRemoveImage(index, img || img.preview)}
                                    >
                                        <IoMdClose className="text-white text-[20px]" />
                                    </span>
                                    <div
                                        className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] 
            bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative"
                                    >
                                        <LazyLoadImage
                                            alt={'Image preview'}
                                            className="w-full h-full object-cover"
                                            effect="blur"
                                            wrapperProps={{ style: { transitionDelay: '0.3s' } }}
                                            src={img?.preview || img}
                                        />
                                    </div>
                                </div>
                            ))}

                            <UploadImagesComponent multiple={true} onUpload={handleUploadImages} />
                        </div>
                    </div>

                    <br />
                    <Button onClick={handleUpdateCategory} className="btn-blue w-full !normal-case flex gap-2">
                        {isLoading === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-[25px] text-white" />
                                <span className="text-[16px]">Cập nhật danh mục</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default UpdateCategoryComponent;
