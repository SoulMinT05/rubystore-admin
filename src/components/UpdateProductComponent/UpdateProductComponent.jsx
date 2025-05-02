import React, { useContext, useEffect, useState } from 'react';

import './UpdateProductComponent.scss';
import UploadImageComponent from '../UploadImageComponent/UploadImageComponent';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Button, CircularProgress } from '@mui/material';
import axiosClient from '../../apis/axiosClient';
import { MyContext } from '../../App';

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

const UpdateProductComponent = () => {
    const [formFields, setFormFields] = useState({
        name: '',
        images: [], // ảnh cũ từ server trả về
        newImages: [], // ảnh mới hoặc preview ảnh mới
        deletedImages: [], // những ảnh user bấm xoá
        description: '',
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
    const [isLoading, setIsLoading] = useState(false);

    const [productCategory, setProductCategory] = useState('');
    const [productSubCategory, setProductSubCategory] = useState('');
    const [productThirdSubCategory, setProductThirdSubCategory] = useState('');
    const [productIsFeatured, setProductIsFeatured] = useState('');
    const [productIsPublished, setProductIsPublished] = useState('');
    const [productRam, setProductRam] = useState([]);
    const [productWeight, setProductWeight] = useState([]);
    const [productSize, setProductSize] = useState([]);

    const context = useContext(MyContext);
    const { id } = context.isOpenFullScreenPanel || {};
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axiosClient.get(`/api/product/${id}`);
                if (data.success) {
                    setFormFields((prev) => ({
                        ...prev,
                        name: data?.product?.name,
                        newImages: data?.product?.images,
                        description: data?.product?.description,
                        brand: data?.product?.brand,
                        price: data?.product?.price,
                        oldPrice: data?.product?.oldPrice,
                        categoryId: data?.product?.categoryId,
                        categoryName: data?.product?.categoryName,
                        subCategoryId: data?.product?.subCategoryId,
                        subCategoryName: data?.product?.subCategoryName,
                        thirdSubCategoryId: data?.product?.thirdSubCategoryId,
                        thirdSubCategoryName: data?.product?.thirdSubCategoryName,
                        countInStock: data?.product?.countInStock,
                        isFeatured: data?.product?.isFeatured,
                        isPublished: data?.product?.isPublished,
                        discount: data?.product?.discount,
                        productRam: data?.product?.productRam,
                        productSize: data?.product?.productSize,
                        productWeight: data?.product?.productWeight,
                    }));
                    setProductCategory(data.product.categoryId);
                    setProductSubCategory(data.product.subCategoryId);
                    setProductThirdSubCategory(data.product.thirdSubCategoryId);
                    setProductIsFeatured(data.product.isFeatured);
                    setProductIsPublished(data.product.isPublished);
                    setProductRam(data.product.productRam);
                    setProductWeight(data.product.productWeight);
                    setProductSize(data.product.productSize);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchProduct();
    }, [id]);

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

    const handleUpdateProduct = async (e) => {
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

            formFields.productRam.forEach((item) => {
                formData.append('productRam', item);
            });
            formFields.productSize.forEach((item) => {
                formData.append('productSize', item);
            });
            formFields.productWeight.forEach((item) => {
                formData.append('productWeight', item);
            });

            // Images
            formData.append('deletedImages', JSON.stringify(formFields.deletedImages));
            formFields.newImages.forEach((img) => {
                if (img.file) {
                    formData.append('images', img.file);
                }
            });

            const { data } = await axiosClient.put(`/api/product/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('dataUpdate: ', data);

            if (data.success) {
                context.openAlertBox('success', data.message);
                // setProducts((prev) => {
                //     return prev.map((product) =>
                //         product._id === data?.updatedProduct._id
                //             ? {
                //                   ...product,
                //                   name: data?.updatedProduct.name,
                //                   images: data?.updatedProduct.images,
                //                   description: data?.updatedProduct.description,
                //                   brand: data?.updatedProduct.brand,
                //                   price: data?.updatedProduct.price,
                //                   oldPrice: data?.updatedProduct.oldPrice,
                //                   categoryId: data?.updatedProduct.categoryId,
                //                   categoryName: data?.updatedProduct.categoryName,
                //                   subCategoryId: data?.updatedProduct.subCategoryId,
                //                   subCategoryName: data?.updatedProduct.subCategoryName,
                //                   thirdSubCategoryId: data?.updatedProduct.thirdSubCategoryId,
                //                   thirdSubCategoryName: data?.updatedProduct.thirdSubCategoryName,
                //                   countInStock: data?.updatedProduct.countInStock,
                //                   isFeatured: data?.updatedProduct.isFeatured,
                //                   isPublished: data?.updatedProduct.isPublished,
                //                   discount: data?.updatedProduct.discount,
                //                   productRam: data?.updatedProduct.productRam,
                //                   productSize: data?.updatedProduct.productSize,
                //                   productWeight: data?.updatedProduct.productWeight,
                //               }
                //             : product,
                //     );
                // });
                context.getProducts();
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
            <form className="form p-8 py-3 max-h-[1100px] ">
                <div className="scroll overflow-y-scroll">
                    <div className="grid grid-cols-1 mb-3">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Tên sản phẩm</h3>
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
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Mô tả sản phẩm</h3>
                            <textarea
                                name="description"
                                value={formFields.description}
                                disabled={isLoading === true ? true : false}
                                onChange={handleChange}
                                type="text"
                                className="w-full h-[150px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
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
                            <h3 className="text-[14px] font-[500] mb-1 text-black">RAMS</h3>
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
                                <MenuItem value={'4GB'}>4GB</MenuItem>
                                <MenuItem value={'8GB'}>8GB</MenuItem>
                                <MenuItem value={'16GB'}>16GB</MenuItem>
                                <MenuItem value={'32GB'}>32GB</MenuItem>
                            </Select>
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Cân nặng</h3>
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
                                <MenuItem value={'30KG'}>30KG</MenuItem>
                                <MenuItem value={'40KG'}>40KG</MenuItem>
                                <MenuItem value={'50KG'}>50KG</MenuItem>
                                <MenuItem value={'55KG'}>55KG</MenuItem>
                                <MenuItem value={'60KG'}>60KG</MenuItem>
                                <MenuItem value={'65KG'}>65KG</MenuItem>
                                <MenuItem value={'70KG'}>70KG</MenuItem>
                            </Select>
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Kích cỡ</h3>
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
                                <MenuItem value={'S'}>S</MenuItem>
                                <MenuItem value={'M'}>M</MenuItem>
                                <MenuItem value={'L'}>L</MenuItem>
                                <MenuItem value={'XL'}>XL</MenuItem>
                                <MenuItem value={'XXL'}>XXL</MenuItem>
                            </Select>
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

                            <UploadImageComponent multiple={true} onUpload={handleUploadImages} />
                        </div>
                    </div>

                    <br />
                    <Button onClick={handleUpdateProduct} className="btn-blue w-full !normal-case flex gap-2">
                        {isLoading === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-[25px] text-white" />
                                <span className="text-[16px]">Cập nhật sản phẩm</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default UpdateProductComponent;
