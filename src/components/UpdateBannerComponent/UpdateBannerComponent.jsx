import React, { useContext, useEffect, useState } from 'react';

import './UpdateBannerComponent.scss';
import UploadImagesComponent from '../UploadImagesComponent/UploadImagesComponent';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Button, CircularProgress } from '@mui/material';
import axiosClient from '../../apis/axiosClient';
import { MyContext } from '../../App';

const UpdateBannerComponent = () => {
    const [formFields, setFormFields] = useState({
        name: '',
        images: [], // ảnh cũ từ server trả về
        newImages: [], // ảnh mới hoặc preview ảnh mới
        deletedImages: [], // những ảnh user bấm xoá
        categoryId: '',
        subCategoryId: '',
        thirdSubCategoryId: '',
        align: '',
        price: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [productCategory, setProductCategory] = useState('');
    const [productSubCategory, setProductSubCategory] = useState('');
    const [productThirdSubCategory, setProductThirdSubCategory] = useState('');
    const [align, setAlign] = useState('');

    const context = useContext(MyContext);
    const { id } = context.isOpenFullScreenPanel || {};

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const { data } = await axiosClient.get(`/api/banner/${id}`);

                if (data.success) {
                    setFormFields((prev) => ({
                        ...prev,
                        name: data?.banner?.name,
                        newImages: data?.banner?.images,
                        price: data?.banner?.price,
                    }));
                    setProductCategory(data?.banner?.categoryId);
                    setProductSubCategory(data?.banner?.subCategoryId);
                    setProductThirdSubCategory(data?.banner?.thirdSubCategoryId);
                    setAlign(data?.banner?.align);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchBanner();
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

    const handleChangeProductCategory = (event) => {
        const id = event.target.value;
        setProductCategory(id);
        setFormFields((prev) => ({
            ...prev,
            categoryId: id,
        }));
    };
    const selectCategoryByName = (name) => {
        setFormFields((prev) => ({
            ...prev,
            categoryName: name,
        }));
    };

    const handleChangeProductSubCategory = (event) => {
        const id = event.target.value;
        setProductSubCategory(id);
        setFormFields((prev) => ({
            ...prev,
            subCategoryId: id,
        }));
    };
    const selectSubCategoryByName = (name) => {
        setFormFields((prev) => ({
            ...prev,
            subCategoryName: name,
        }));
    };

    const handleChangeProductThirdSubCategory = (event) => {
        const id = event.target.value;
        setProductThirdSubCategory(id);
        setFormFields((prev) => ({
            ...prev,
            thirdSubCategoryId: id,
        }));
    };
    const selectThirdSubCategoryByName = (name) => {
        setFormFields((prev) => ({
            ...prev,
            thirdSubCategoryName: name,
        }));
    };
    const handleChangeAlign = (event) => {
        console.log('event.target.value: ', event.target.value);
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

    const handleUpdateBanner = async (e) => {
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

            formData.append('deletedImages', JSON.stringify(formFields.deletedImages));

            formFields.newImages.forEach((img) => {
                if (img.file) {
                    formData.append('images', img.file);
                }
            });

            console.log('formData: ', formData);
            const { data } = await axiosClient.put(`/api/banner/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('update: ', data);

            if (data.success) {
                context.openAlertBox('success', data.message);
                context.getBanners();
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
                                            <MenuItem
                                                key={cat?._id}
                                                value={cat?._id}
                                                onClick={() => selectCategoryByName(cat?.name)}
                                            >
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
                                                        key={subCat?._id}
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
                                                                key={thirdCat?._id}
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
                                    labelId="demo-simple-select-label"
                                    id="align"
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
                    <Button onClick={handleUpdateBanner} className="btn-blue w-full !normal-case flex gap-2">
                        {isLoading === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-[25px] text-white" />
                                <span className="text-[16px]">Cập nhật banner</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default UpdateBannerComponent;
