import React, { useContext, useState } from 'react';

import './AddSubCategoryComponent.scss';
import UploadImagesComponent from '../UploadImagesComponent/UploadImagesComponent';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Button, MenuItem, Select, CircularProgress } from '@mui/material';
import { MyContext } from '../../App';
import axiosClient from '../../apis/axiosClient';

const AddSubCategoryComponent = () => {
    const [secondCategory, setSecondCategory] = useState('');
    const [thirdCategory, setThirdCategory] = useState('');

    const [formFields, setFormFields] = useState({
        name: '',
        parentCategoryName: null,
        parentId: null,
    });
    const [thirdFormFields, setThirdFormFields] = useState({
        name: '',
        parentCategoryName: null,
        parentId: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [thirdIsLoading, setThirdIsLoading] = useState(false);

    const { categories } = useContext(MyContext);
    const context = useContext(MyContext);

    const handleChangeSecondCategory = (event) => {
        setSecondCategory(event.target.value);
        setFormFields((prev) => ({
            ...prev,
            parentId: event.target.value,
        }));
    };
    const handleChangeThirdCategory = (event) => {
        setThirdCategory(event.target.value);
        setThirdFormFields((prev) => ({
            ...prev,
            parentId: event.target.value,
        }));
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
    const handleChangeThird = (e) => {
        const { name, value } = e.target;
        setThirdFormFields(() => {
            return {
                ...thirdFormFields,
                [name]: value,
            };
        });
    };

    const selectCategory = (categoryName) => {
        setFormFields((prev) => ({
            ...prev,
            parentCategoryName: categoryName,
        }));
    };
    const selectThirdCategory = (categoryName) => {
        setThirdFormFields((prev) => ({
            ...prev,
            parentCategoryName: categoryName,
        }));
    };

    const handleAddSecondCategory = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (formFields.name === '') {
                context.openAlertBox('error', 'Vui lòng điền đầy đủ tên danh mục cấp 2!');
                setIsLoading(false);
                return;
            }
            if (secondCategory === '') {
                context.openAlertBox('error', 'Vui lòng điền đầy đủ danh mục cấp 2!');
                setIsLoading(false);
                return;
            }

            const { data } = await axiosClient.post('/api/category/create', formFields);
            if (data.success) {
                context.openAlertBox('success', data.message);
                context.getCategories();
                context.setIsOpenFullScreenPanel({
                    open: false,
                });
            } else {
                context.openAlertBox('error', data.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddThirdCategory = async (e) => {
        e.preventDefault();
        setThirdIsLoading(true);
        try {
            if (thirdFormFields.name === '') {
                context.openAlertBox('error', 'Vui lòng điền đầy đủ tên danh mục cấp 2 và 3!');
                setThirdIsLoading(false);
                return;
            }
            if (thirdCategory === '') {
                context.openAlertBox('error', 'Vui lòng điền đầy đủ danh mục cấp 2 và 3!');
                setThirdIsLoading(false);
                return;
            }

            const { data } = await axiosClient.post('/api/category/create', thirdFormFields);
            if (data.success) {
                context.openAlertBox('success', data.message);
                context.getCategories();
                context.setIsOpenFullScreenPanel({
                    open: false,
                });
            } else {
                context.openAlertBox('error', data.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setThirdIsLoading(false);
        }
    };
    return (
        <section className="p-5 bg-gray-50 grid grid-cols-2">
            <form className="form p-8 py-3 max-h-[800px] ">
                <h4 className="font-[600]">Thêm danh mục cấp 2</h4>
                <div className="scroll overflow-y-scroll">
                    <div className="grid grid-cols-2 mb-3 gap-5">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Danh mục cha</h3>
                            <Select
                                labelId="demo-simple-select-label"
                                id="secondCategoryDrop"
                                size="small"
                                className="w-full"
                                value={secondCategory}
                                label="Danh mục"
                                onChange={handleChangeSecondCategory}
                            >
                                {categories?.length !== 0 &&
                                    categories?.map((item, index) => {
                                        return (
                                            <MenuItem
                                                key={index}
                                                value={item?._id}
                                                onClick={() => selectCategory(item?.name)}
                                            >
                                                {item?.name}
                                            </MenuItem>
                                        );
                                    })}
                            </Select>
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Tên danh mục con</h3>
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

                    <br />
                    <Button
                        onClick={handleAddSecondCategory}
                        type="submit"
                        className="btn-blue w-full !normal-case flex gap-2"
                    >
                        {isLoading === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-[25px] text-white" />
                                <span className="text-[16px]">Thêm danh mục con</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
            <form className="form p-8 py-3 max-h-[800px] ">
                <h4 className="font-[600]">Thêm danh mục cấp 3</h4>
                <div className="scroll overflow-y-scroll">
                    <div className="grid grid-cols-2 mb-3 gap-5">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Danh mục cha</h3>
                            <Select
                                labelId="demo-simple-select-label"
                                id="thirdCategoryDrop"
                                size="small"
                                className="w-full"
                                value={thirdCategory}
                                label="Danh mục"
                                onChange={handleChangeThirdCategory}
                            >
                                {categories?.length !== 0 &&
                                    categories?.map((item) => {
                                        return (
                                            item?.children?.length !== 0 &&
                                            item?.children?.map((itemThird, indexThird) => {
                                                return (
                                                    <MenuItem
                                                        key={indexThird}
                                                        value={itemThird?._id}
                                                        onClick={() => selectThirdCategory(itemThird?.name)}
                                                    >
                                                        {itemThird?.name}
                                                    </MenuItem>
                                                );
                                            })
                                        );
                                    })}
                            </Select>
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Tên danh mục con</h3>
                            <input
                                name="name"
                                value={thirdFormFields.name}
                                disabled={isLoading === true ? true : false}
                                onChange={handleChangeThird}
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                    </div>

                    <br />
                    <Button
                        onClick={handleAddThirdCategory}
                        type="submit"
                        className="btn-blue w-full !normal-case flex gap-2"
                    >
                        {thirdIsLoading === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-[25px] text-white" />
                                <span className="text-[16px]">Thêm danh mục con</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default AddSubCategoryComponent;
