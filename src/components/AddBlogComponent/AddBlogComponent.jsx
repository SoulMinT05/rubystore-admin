import React, { useContext, useState } from 'react';

import './AddBlogComponent.scss';
import UploadImagesComponent from '../UploadImagesComponent/UploadImagesComponent';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Button, CircularProgress } from '@mui/material';
import axiosClient from '../../apis/axiosClient';
import { MyContext } from '../../App';
import Editor from 'react-simple-wysiwyg';
import { useDispatch } from 'react-redux';
import { addBlog } from '../../redux/blogSlice';

const AddBlogComponent = () => {
    const dispatch = useDispatch();

    const [html, setHtml] = useState('');
    const [formFields, setFormFields] = useState({
        name: '',
        description: '',
        images: [],
    });
    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(MyContext);

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
            images: [...prev.images, ...imagesArray],
        }));
    };

    const handleRemoveImage = (index) => {
        const newImages = [...formFields.images];
        newImages.splice(index, 1);
        setFormFields((prev) => ({
            ...prev,
            images: newImages,
        }));
    };

    const handleChangeDescription = (e) => {
        setHtml(e.target.value);
        formFields.description = e.target.value;
    };

    const handleAddBlog = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', formFields.name);
            formData.append('description', formFields.description);
            formFields.images.forEach((img) => {
                formData.append('images', img.file); // "images" phải trùng với field name backend nhận
            });

            const { data } = await axiosClient.post('/api/blog/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('dataAdd : ', data);
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(addBlog(data?.newBlog));

                context.setIsOpenFullScreenPanel({
                    open: false,
                });
            } else {
                context.openAlertBox('error', data.message);
            }
        } catch (error) {
            console.log(error);
            context.openAlertBox('error', error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="p-5 bg-gray-50">
            <form className="form p-8 py-3 max-h-[1500px] ">
                <div className="scroll overflow-y-scroll">
                    <div className="grid grid-cols-1 mb-3">
                        <div className="col w-[25%]">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Tên bài viết</h3>
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
                    <div className="grid grid-cols-1 mb-3">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Mô tả bài viết</h3>

                            <Editor
                                value={html}
                                containerProps={{ style: { resize: 'vertical' } }}
                                onChange={handleChangeDescription}
                            ></Editor>
                        </div>
                    </div>

                    <div className="col w-full p-5 px-0">
                        <h3 className="font-[700] text-[18px] mb-3">Hình ảnh</h3>
                        <div className="grid grid-cols-7 gap-4">
                            {formFields.images.map((img, index) => (
                                <div className="uploadBoxWrapper relative" key={index}>
                                    <span
                                        className="absolute w-[25px] h-[25px] rounded-full overflow-hidden bg-red-700 -top-[10px] -right-[10px] z-50 flex items-center justify-center cursor-pointer"
                                        onClick={() => handleRemoveImage(index)}
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
                                            src={img?.preview}
                                        />
                                    </div>
                                </div>
                            ))}

                            <UploadImagesComponent multiple={true} onUpload={handleUploadImages} />
                        </div>
                    </div>

                    <br />
                    <Button onClick={handleAddBlog} className="btn-blue w-full !normal-case flex gap-2">
                        {isLoading === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-[25px] text-white" />
                                <span className="text-[16px]">Thêm bài viết</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default AddBlogComponent;
