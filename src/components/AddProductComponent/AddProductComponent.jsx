import React, { useContext, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import './AddProductComponent.scss';
import UploadImagesComponent from '../UploadImagesComponent/UploadImagesComponent';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Editor from 'react-simple-wysiwyg';

import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Button, CircularProgress } from '@mui/material';
import { MyContext } from '../../App';
import axiosClient from '../../apis/axiosClient';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const AddProductComponent = () => {
    const [formFields, setFormFields] = useState({
        name: '',
        description: '',
        images: [],
        brand: '',
        price: '',
        oldPrice: '',
        categoryId: '',
        categoryName: '',
        subCategoryId: '',
        subCategoryName: '',
        thirdSubCategoryId: '',
        thirdSubCategoryName: '',
        countInStock: '',
        isFeatured: false,
        isPublished: false,
        discount: '',
        productRam: [],
        productSize: [],
        productWeight: [],
    });
    const [html, setHtml] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setProducts } = useContext(MyContext);

    const [productCategory, setProductCategory] = useState('');
    const [productSubCategory, setProductSubCategory] = useState('');
    const [productThirdSubCategory, setProductThirdSubCategory] = useState('');
    const [productIsFeatured, setProductIsFeatured] = useState('');
    const [productIsPublished, setProductIsPublished] = useState('');
    const [productRam, setProductRam] = useState([]);
    const [productRamData, setProductRamData] = useState([]);
    const [productWeight, setProductWeight] = useState([]);
    const [productWeightData, setProductWeightData] = useState([]);
    const [productSize, setProductSize] = useState([]);
    const [productSizeData, setProductSizeData] = useState([]);

    const context = useContext(MyContext);

    useEffect(() => {
        const getProductsRam = async () => {
            try {
                const { data } = await axiosClient.get('/api/product/all-products-ram');
                setProductRamData(data?.productsRam);
            } catch (error) {
                console.log(error);
            }
        };
        getProductsRam();
    }, []);

    useEffect(() => {
        const getProductsWeight = async () => {
            try {
                const { data } = await axiosClient.get('/api/product/all-products-weight');
                setProductWeightData(data?.productsWeight);
            } catch (error) {
                console.log(error);
            }
        };
        getProductsWeight();
    }, []);

    useEffect(() => {
        const getProductsSize = async () => {
            try {
                const { data } = await axiosClient.get('/api/product/all-products-size');
                setProductSizeData(data?.productsSize);
            } catch (error) {
                console.log(error);
            }
        };
        getProductsSize();
    }, []);

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
    const handleChangeProductIsFeatured = (event) => {
        setProductIsFeatured(event.target.value);
        formFields.isFeatured = event.target.value;
    };
    const handleChangeProductIsPublished = (event) => {
        setProductIsPublished(event.target.value);
        formFields.isPublished = event.target.value;
    };

    const handleChangeProductRam = (event) => {
        const { value } = event.target;
        setProductRam(typeof value === 'string' ? value.split('') : value);
        formFields.productRam = value;
    };
    const handleChangeProductWeight = (event) => {
        const { value } = event.target;
        setProductWeight(typeof value === 'string' ? value.split('') : value);
        formFields.productWeight = value;
    };
    const handleChangeProductSize = (event) => {
        const { value } = event.target;
        setProductSize(typeof value === 'string' ? value.split('') : value);
        formFields.productSize = value;
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', formFields.name);
            formData.append('description', formFields.description);
            formData.append('brand', formFields.brand);
            formData.append('price', formFields.price);
            formData.append('oldPrice', formFields.oldPrice);
            formData.append('categoryId', formFields.categoryId);
            formData.append('categoryName', formFields.categoryName);
            formData.append('subCategoryId', formFields.subCategoryId);
            formData.append('subCategoryName', formFields.subCategoryName);
            formData.append('thirdSubCategoryId', formFields.thirdSubCategoryId);
            formData.append('thirdSubCategoryName', formFields.thirdSubCategoryName);
            formData.append('countInStock', formFields.countInStock);
            formData.append('isFeatured', formFields.isFeatured);
            formData.append('isPublished', formFields.isPublished);
            formData.append('discount', formFields.discount);

            // Append hình ảnh
            formFields.images.forEach((img) => {
                formData.append('images', img.file);
            });

            // Append mảng (RAM, size, weight)
            formFields.productRam.forEach((item) => {
                formData.append('productRam', item);
            });
            formFields.productSize.forEach((item) => {
                formData.append('productSize', item);
            });
            formFields.productWeight.forEach((item) => {
                formData.append('productWeight', item);
            });

            const { data } = await axiosClient.post('/api/product/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                setProducts((prev) => [...prev, data?.newProduct]);
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
            <form className="form p-8 py-3 max-h-[1100px]" onSubmit={handleSubmit}>
                <div className="scroll overflow-y-scroll">
                    <div className="grid grid-cols-1 mb-3">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Tên sản phẩm</h3>
                            <input
                                name="name"
                                value={formFields.name}
                                disabled={isLoading === true ? true : false}
                                onChange={handleChange}
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 mb-3">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Mô tả sản phẩm</h3>
                            <Editor
                                value={html}
                                containerProps={{ style: { resize: 'vertical' } }}
                                onChange={handleChangeDescription}
                            ></Editor>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 mb-3 gap-4 ">
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
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Giá mới</h3>
                            <input
                                type="number"
                                name="price"
                                value={formFields.price}
                                disabled={isLoading === true ? true : false}
                                onChange={handleChange}
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Giá cũ</h3>
                            <input
                                type="number"
                                name="oldPrice"
                                value={formFields.oldPrice}
                                disabled={isLoading === true ? true : false}
                                onChange={handleChange}
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Trạng thái đặc trưng</h3>
                            <Select
                                labelId="demo-simple-select-label"
                                id="productIsFeaturedDrop"
                                size="small"
                                className="w-full"
                                value={productIsFeatured}
                                label="Đặc trưng"
                                onChange={handleChangeProductIsFeatured}
                            >
                                <MenuItem value={true}>Đặc trưng</MenuItem>
                                <MenuItem value={false}>Không đặc trưng</MenuItem>
                            </Select>
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Trạng thái công khai</h3>
                            <Select
                                labelId="demo-simple-select-label"
                                id="productIsPublishedDrop"
                                size="small"
                                className="w-full"
                                value={productIsPublished}
                                label="Trạng thái công khai"
                                onChange={handleChangeProductIsPublished}
                            >
                                <MenuItem value={true}>Công khai</MenuItem>
                                <MenuItem value={false}>Không công khai</MenuItem>
                            </Select>
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Số lượng tồn kho</h3>
                            <input
                                type="number"
                                name="countInStock"
                                value={formFields.countInStock}
                                disabled={isLoading === true ? true : false}
                                onChange={handleChange}
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Thương hiệu</h3>
                            <input
                                name="brand"
                                value={formFields.brand}
                                disabled={isLoading === true ? true : false}
                                type="text"
                                onChange={handleChange}
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Giảm giá</h3>
                            <input
                                type="number"
                                name="discount"
                                value={formFields.discount}
                                disabled={isLoading === true ? true : false}
                                onChange={handleChange}
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">RAM</h3>
                            {productRamData?.length !== 0 && (
                                <Select
                                    multiple
                                    labelId="demo-simple-select-label"
                                    id="productRamDrop"
                                    size="small"
                                    className="w-full"
                                    value={productRam}
                                    label="Trạng thái"
                                    MenuProps={MenuProps}
                                    onChange={handleChangeProductRam}
                                >
                                    {productRamData?.map((item) => (
                                        <MenuItem key={item._id} value={item?.name}>
                                            {item?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Cân nặng</h3>
                            {productWeightData?.length !== 0 && (
                                <Select
                                    multiple
                                    labelId="demo-simple-select-label"
                                    id="productWeightDrop"
                                    size="small"
                                    className="w-full"
                                    value={productWeight}
                                    label="Cân nặng"
                                    onChange={handleChangeProductWeight}
                                >
                                    {productWeightData?.map((item) => (
                                        <MenuItem key={item._id} value={item?.name}>
                                            {item?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Kích cỡ</h3>
                            {productSizeData?.length !== 0 && (
                                <Select
                                    multiple
                                    labelId="demo-simple-select-label"
                                    id="productSizeDrop"
                                    size="small"
                                    className="w-full"
                                    value={productSize}
                                    label="Kích cỡ"
                                    onChange={handleChangeProductSize}
                                >
                                    {productSizeData?.map((item) => (
                                        <MenuItem key={item._id} value={item?.name}>
                                            {item?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        </div>
                    </div>

                    <div className="col w-full p-5 px-0">
                        <h3 className="font-[700] text-[18px] mb-3">Hình ảnh</h3>

                        <div className="grid grid-cols-7 gap-4">
                            {formFields?.images?.map((img, index) => (
                                <div className="uploadBoxWrapper relative" key={index}>
                                    <span
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute w-[25px] h-[25px] rounded-full overflow-hidden bg-red-700 -top-[10px] -right-[10px] z-50 flex items-center justify-center cursor-pointer"
                                    >
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
                                            src={img?.preview}
                                        />
                                    </div>
                                </div>
                            ))}
                            <UploadImagesComponent multiple={true} onUpload={handleUploadImages} />
                        </div>
                    </div>

                    <br />
                    <Button type="submit" className="btn-blue w-full !normal-case flex gap-2 mb-4">
                        {isLoading === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-[25px] text-white" />
                                <span className="text-[16px]">Thêm sản phẩm</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default AddProductComponent;
