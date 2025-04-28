import React, { useContext, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

import './CategoryPage.scss';
import { Button, MenuItem, Select, Checkbox, Tooltip, Pagination, CircularProgress } from '@mui/material';
import { BiExport } from 'react-icons/bi';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaRegEye } from 'react-icons/fa6';
import { GoTrash } from 'react-icons/go';
import SearchBoxComponent from '../../components/SearchBoxComponent/SearchBoxComponent';
import axiosClient from '../../apis/axiosClient';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const CategoryPage = () => {
    const [categoryFilterVal, setCategoryFilterVal] = useState('');
    const [categoryId, setCategoryId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClickOpen = (id) => {
        setOpen(true);
        setCategoryId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const getCategories = async () => {
            try {
                const { data } = await axiosClient.get('/api/category/all-categories');
                if (data.success) {
                    setCategories(data?.categories);
                } else {
                    console.error('Lỗi lấy danh mục:', data.message);
                }
            } catch (error) {
                console.error('Lỗi API:', error);
                return [];
            }
        };
        getCategories();
    }, []);

    console.log('categories: ', categories);

    const context = useContext(MyContext);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const handleChangeCategoryFilterVal = (event) => {
        setCategoryFilterVal(event.target.value);
    };

    const handleDeleteCategory = async () => {
        console.log('categoryId: ', categoryId);
        setIsLoading(true);
        try {
            const { data } = await axiosClient.delete(`/api/category/${categoryId}`);
            if (data.success) {
                context.openAlertBox('success', data.message);
                setCategories((prev) => prev.filter((category) => category._id !== categoryId));
                handleClose();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0">
                <h2 className="text-[18px] font-[600]">Danh sách danh mục</h2>

                <div
                    className={`col ${
                        context.isisOpenSidebar === true ? 'w-[25%]' : 'w-[22%]'
                    }] ml-auto flex items-center gap-3`}
                >
                    <Button className="btn !bg-green-500 !text-white !normal-case gap-1">
                        <BiExport />
                        Xuất file
                    </Button>
                    <Button
                        className="btn-blue !text-white !normal-case"
                        onClick={() =>
                            context.setIsOpenFullScreenPanel({
                                open: true,
                                model: 'Thêm danh mục',
                            })
                        }
                    >
                        <IoMdAdd />
                        Thêm danh mục
                    </Button>
                </div>
            </div>

            <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
                <div className="flex items-center w-full justify-between px-5">
                    <div className="col w-[20%]">
                        <h4 className="font-[600] text-[13px] mb-2">Phân loại theo</h4>

                        <Select
                            className="w-full"
                            size="small"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={categoryFilterVal}
                            label="Danh mục"
                            onChange={handleChangeCategoryFilterVal}
                        >
                            <MenuItem value={10}>Nam</MenuItem>
                            <MenuItem value={20}>Nữ</MenuItem>
                            <MenuItem value={30}>Trẻ em</MenuItem>
                        </Select>
                    </div>

                    <div className="col w-[20%] ml-auto">
                        <SearchBoxComponent />
                    </div>
                </div>

                <br />

                <div className="relative overflow-x-auto mt-1 pb-5">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                        <thead className="text-xs text-gray-700 uppercase bg-white">
                            <tr>
                                <th scope="col" className="px-6 pr-0 py-2 ">
                                    <div className="w-[60px]">
                                        <Checkbox {...label} size="small" />
                                    </div>
                                </th>
                                <th scope="col" className="px-0 py-3 whitespace-nowrap">
                                    Hình ảnh
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Tên danh mục
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories?.map((category) => (
                                <tr key={category?._id} className="odd:bg-white  even:bg-gray-50 border-b">
                                    <td className="px-6 pr-0 py-2">
                                        <div className="w-[60px]">
                                            <Checkbox {...label} size="small" />
                                        </div>
                                    </td>
                                    <td className="px-0 py-2">
                                        <div className="flex items-center gap-4 w-[80px]">
                                            <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                                <Link to={`/category/${category?._id}`}>
                                                    <img
                                                        src={category?.images.length > 0 && category?.images[0]}
                                                        className="w-full group-hover:scale-105 transition-all"
                                                        alt=""
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2">
                                        <p className="w-[180px]">{category?.name}</p>
                                    </td>

                                    <td className="px-6 py-2">
                                        <div className="flex items-center gap-1">
                                            <Tooltip title="Chỉnh sửa" placement="top">
                                                <Button
                                                    className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                                    onClick={() =>
                                                        context.setIsOpenFullScreenPanel({
                                                            open: true,
                                                            model: 'Cập nhật danh mục',
                                                            id: category._id,
                                                        })
                                                    }
                                                >
                                                    <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Xoá" placement="top">
                                                <Button
                                                    onClick={() => handleClickOpen(category._id)}
                                                    className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                                >
                                                    <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-center pt-5 pb-5 px-4">
                    <Pagination count={10} color="primary" />
                </div>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Xoá danh mục?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn xoá danh mục này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Huỷ</Button>
                    {isLoading === true ? (
                        <CircularProgress color="inherit" />
                    ) : (
                        <Button className="btn-red" onClick={handleDeleteCategory} autoFocus>
                            Xác nhận
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CategoryPage;
