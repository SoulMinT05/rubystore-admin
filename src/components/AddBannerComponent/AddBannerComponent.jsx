import React, { useContext, useState } from 'react';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import './AddBannerComponent.scss';
import UploadImagesComponent from '../UploadImagesComponent/UploadImagesComponent';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Button, CircularProgress } from '@mui/material';
import { MyContext } from '../../App';
import axiosClient from '../../apis/axiosClient';

const AddBannerComponent = () => {
    const [formFields, setFormFields] = useState({
        name: '',
        images: [],
        productId: '',
        categoryId: '',
        subCategoryId: '',
        thirdSubCategoryId: '',
        price: 0,
        align: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [productCategory, setProductCategory] = useState('');
    const [productSubCategory, setProductSubCategory] = useState('');
    const [productThirdSubCategory, setProductThirdSubCategory] = useState('');
    const [align, setAlign] = useState('');

    const { setBanners } = useContext(MyContext);
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

    const handleChangeProductCategory = (event) => {
        setProductCategory(event.target.value);
        formFields.categoryId = event.target.value;
    };
    const selectCategoryByName = (name) => {
        formFields.categoryName = name;
    };

    const handleChangeProductSubCategory = (event) => {
        setProductSubCategory(event.target.value);
        formFields.subCategoryId = event.target.value;
    };
    const selectSubCategoryByName = (name) => {
        formFields.subCategoryName = name;
    };

    const handleChangeProductThirdSubCategory = (event) => {
        setProductThirdSubCategory(event.target.value);
        formFields.thirdSubCategoryId = event.target.value;
    };
    const selectThirdSubCategoryByName = (name) => {
        formFields.thirdSubCategoryName = name;
    };

    const handleChangeAlign = (event) => {
        setAlign(event.target.value);
        formFields.align = event.target.value;
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

    const handleAddBanner = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', formFields.name);
            formData.append('categoryId', formFields.categoryId);
            formData.append('subCategoryId', formFields.subCategoryId);
            formData.append('thirdSubCategoryId', formFields.thirdSubCategoryId);
            formData.append('align', formFields.align);
            formData.append('price', formFields.price);

            formFields.images.forEach((img) => {
                formData.append('images', img.file); // "images" phải trùng với field name backend nhận
            });

            const { data } = await axiosClient.post('/api/banner/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                setBanners((prev) => [...prev, data?.newBanner]);
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
            <form className="form p-8 py-3 max-h-[800px] ">
                <div className="scroll overflow-y-scroll">
                    <div className="grid grid-cols-5 mb-3 gap-4">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Tên banner</h3>
                            <input
                                name="name"
                                value={formFields.name}
                                disabled={isLoading === true ? true : false}
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Danh mục sản phẩm</h3>
                            {context?.categories?.length !== 0 && (
                                <Select
                                    MenuProps={{ disableScrollLock: true }}
                                    labelId="demo-simple-select-label"
                                    id="productCategoryDrop"
                                    size="small"
                                    className="w-full"
                                    value={productCategory}
                                    label="Danh mục"
                                    onChange={handleChangeProductCategory}
                                >
                                    {context?.categories?.map((cat) => {
                                        return (
                                            <MenuItem value={cat?._id} onClick={() => selectCategoryByName(cat?.name)}>
                                                {cat?.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            )}
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Danh mục con cấp 2</h3>
                            {context?.categories?.length !== 0 && (
                                <Select
                                    MenuProps={{ disableScrollLock: true }}
                                    labelId="demo-simple-select-label"
                                    id="productSubCategoryDrop"
                                    size="small"
                                    className="w-full"
                                    value={productSubCategory}
                                    label="Danh mục con cấp 2"
                                    onChange={handleChangeProductSubCategory}
                                >
                                    {context?.categories?.map((cat) => {
                                        return (
                                            cat?.children?.length !== 0 &&
                                            cat?.children.map((subCat) => {
                                                return (
                                                    <MenuItem
                                                        value={subCat?._id}
                                                        onClick={() => selectSubCategoryByName(subCat?.name)}
                                                    >
                                                        {subCat?.name}
                                                    </MenuItem>
                                                );
                                            })
                                        );
                                    })}
                                </Select>
                            )}
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Danh mục con cấp 3</h3>
                            {context?.categories?.length !== 0 && (
                                <Select
                                    MenuProps={{ disableScrollLock: true }}
                                    labelId="demo-simple-select-label"
                                    id="productThirdCategoryDrop"
                                    size="small"
                                    className="w-full"
                                    value={productThirdSubCategory}
                                    label="Danh mục con cấp 3"
                                    onChange={handleChangeProductThirdSubCategory}
                                >
                                    {context?.categories?.map((cat) => {
                                        return (
                                            cat?.children?.length !== 0 &&
                                            cat?.children.map((subCat) => {
                                                return (
                                                    subCat?.children?.length !== 0 &&
                                                    subCat?.children?.map((thirdCat) => {
                                                        return (
                                                            <MenuItem
                                                                value={thirdCat?._id}
                                                                onClick={() =>
                                                                    selectThirdSubCategoryByName(thirdCat?.name)
                                                                }
                                                            >
                                                                {thirdCat?.name}
                                                            </MenuItem>
                                                        );
                                                    })
                                                );
                                            })
                                        );
                                    })}
                                </Select>
                            )}
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Vị trí đặt chữ</h3>
                            {context?.categories?.length !== 0 && (
                                <Select
                                    MenuProps={{ disableScrollLock: true }}
                                    labelId="demo-simple-select-label"
                                    id="productThirdCategoryDrop"
                                    size="small"
                                    className="w-full"
                                    value={align}
                                    label="Danh mục con cấp 3"
                                    onChange={handleChangeAlign}
                                >
                                    <MenuItem value={'left'}>Trái</MenuItem>
                                    <MenuItem value={'right'}>Phải</MenuItem>
                                </Select>
                            )}
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Giá</h3>
                            <input
                                type="number"
                                name="price"
                                value={formFields.price}
                                disabled={isLoading === true ? true : false}
                                onChange={handleChange}
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
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
                    <Button onClick={handleAddBanner} className="btn-blue w-full !normal-case flex gap-2">
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

export default AddBannerComponent;
