import React, { useState } from 'react';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import './AddProductComponent.scss';
import UploadImageComponent from '../UploadImageComponent/UploadImageComponent';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Button } from '@mui/material';

const AddProductComponent = () => {
    const [productCategory, setProductCategory] = useState('');
    const [productSubCategory, setProductSubCategory] = useState('');
    const [productStatus, setProductStatus] = useState('');
    const [productBrand, setProductBrand] = useState('');
    const [productRams, setProductRams] = useState('');
    const [productWeight, setProductWeight] = useState('');
    const [productSize, setProductSize] = useState('');

    const handleChangeProductCategory = (event) => {
        setProductCategory(event.target.value);
    };
    const handleChangeProductSubCategory = (event) => {
        setProductSubCategory(event.target.value);
    };
    const handleChangeProductStatus = (event) => {
        setProductStatus(event.target.value);
    };
    const handleChangeProductBrand = (event) => {
        setProductBrand(event.target.value);
    };
    const handleChangeProductRams = (event) => {
        setProductRams(event.target.value);
    };
    const handleChangeProductWeight = (event) => {
        setProductWeight(event.target.value);
    };
    const handleChangeProductSize = (event) => {
        setProductSize(event.target.value);
    };

    return (
        <section className="p-5 bg-gray-50">
            <form className="form p-8 py-3 max-h-[800px] ">
                <div className="scroll overflow-y-scroll">
                    <div className="grid grid-cols-1 mb-3">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Tên sản phẩm</h3>
                            <input
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 mb-3">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Mô tả sản phẩm</h3>
                            <textarea
                                type="text"
                                className="w-full h-[150px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 mb-3 gap-4 ">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Danh mục sản phẩm</h3>
                            <Select
                                labelId="demo-simple-select-label"
                                id="productCategoryDrop"
                                size="small"
                                className="w-full"
                                value={productCategory}
                                label="Danh mục"
                                onChange={handleChangeProductCategory}
                            >
                                <MenuItem value={''}>Chọn danh mục</MenuItem>
                                <MenuItem value={20}>Thời trang</MenuItem>
                                <MenuItem value={30}>Trang sức</MenuItem>
                                <MenuItem value={30}>Điện tử</MenuItem>
                            </Select>
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Danh mục con</h3>
                            <Select
                                labelId="demo-simple-select-label"
                                id="productSubCategoryDrop"
                                size="small"
                                className="w-full"
                                value={productSubCategory}
                                label="Danh mục"
                                onChange={handleChangeProductSubCategory}
                            >
                                <MenuItem value={''}>Chọn danh mục</MenuItem>
                                <MenuItem value={20}>Thời trang</MenuItem>
                                <MenuItem value={30}>Trang sức</MenuItem>
                                <MenuItem value={30}>Điện tử</MenuItem>
                            </Select>
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Giá mới</h3>
                            <input
                                type="number"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Giá cũ</h3>
                            <input
                                type="number"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 mb-3 gap-4 ">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Trạng thái</h3>
                            <Select
                                labelId="demo-simple-select-label"
                                id="productStatusDrop"
                                size="small"
                                className="w-full"
                                value={productStatus}
                                label="Trạng thái"
                                onChange={handleChangeProductStatus}
                            >
                                <MenuItem value={20}>Công khai</MenuItem>
                                <MenuItem value={30}>Không công khai</MenuItem>
                            </Select>
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Số lượng tồn kho</h3>
                            <input
                                type="number"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Thương hiệu</h3>
                            <Select
                                labelId="demo-simple-select-label"
                                id="productBrandDrop"
                                size="small"
                                className="w-full"
                                value={productBrand}
                                label="Thương hiệu"
                                onChange={handleChangeProductBrand}
                            >
                                <MenuItem value={20}>Louis Vuition</MenuItem>
                                <MenuItem value={30}>Dior</MenuItem>
                                <MenuItem value={30}>DrCare</MenuItem>
                            </Select>
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Giảm giá</h3>
                            <input
                                type="number"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 mb-3 gap-4 ">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">RAMS</h3>
                            <Select
                                labelId="demo-simple-select-label"
                                id="productRamsDrop"
                                size="small"
                                className="w-full"
                                value={productRams}
                                label="Trạng thái"
                                onChange={handleChangeProductRams}
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
                                labelId="demo-simple-select-label"
                                id="productWeightDrop"
                                size="small"
                                className="w-full"
                                value={productWeight}
                                label="Cân nặng"
                                onChange={handleChangeProductWeight}
                            >
                                <MenuItem value={'2KG'}>2KG</MenuItem>
                                <MenuItem value={'5KG'}>5KG</MenuItem>
                                <MenuItem value={'8KG'}>8KG</MenuItem>
                                <MenuItem value={'10KG'}>10KG</MenuItem>
                            </Select>
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Kích cỡ</h3>
                            <Select
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
                                <MenuItem value={'L'}>8KG</MenuItem>
                                <MenuItem value={'XL'}>XL</MenuItem>
                            </Select>
                        </div>
                    </div>

                    <div className="col w-full p-5 px-0">
                        <h3 className="font-[700] text-[18px] mb-3">Hình ảnh</h3>

                        <div className="grid grid-cols-7 gap-4">
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
                                        src={
                                            'https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg'
                                        }
                                    />
                                </div>
                            </div>
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
                                        src={
                                            'https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg'
                                        }
                                    />
                                </div>
                            </div>
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
                                        src={
                                            'https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg'
                                        }
                                    />
                                </div>
                            </div>
                            <UploadImageComponent multiple={true} />
                        </div>
                    </div>

                    <br />
                    <Button type="submit" className="btn-blue w-full !normal-case flex gap-2">
                        <FaCloudUploadAlt className="text-[25px] text-white" />
                        <span className="text-[16px]">Thêm sản phẩm</span>
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default AddProductComponent;
