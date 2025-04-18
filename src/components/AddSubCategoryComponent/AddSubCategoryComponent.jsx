import React, { useState } from 'react';

import './AddSubCategoryComponent.scss';
import UploadImageComponent from '../UploadImageComponent/UploadImageComponent';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Button, MenuItem, Select } from '@mui/material';

const AddSubCategoryComponent = () => {
    const [productCategory, setProductCategory] = useState('');
    const handleChangeProductCategory = (event) => {
        setProductCategory(event.target.value);
    };
    return (
        <section className="p-5 bg-gray-50">
            <form className="form p-8 py-3 max-h-[800px] ">
                <div className="scroll overflow-y-scroll">
                    <div className="grid grid-cols-4 mb-3 gap-5">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Danh mục con</h3>
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
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Tên sản phẩm</h3>
                            <input
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                    </div>

                    <br />
                    <Button type="submit" className="btn-blue w-full !normal-case flex gap-2">
                        <FaCloudUploadAlt className="text-[25px] text-white" />
                        <span className="text-[16px]">Thêm danh mục con</span>
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default AddSubCategoryComponent;
