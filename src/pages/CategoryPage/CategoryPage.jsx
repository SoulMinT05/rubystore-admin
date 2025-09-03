import React, { useContext, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

import './CategoryPage.scss';
import * as XLSX from 'xlsx';
import { Button, MenuItem, Select, Checkbox, Tooltip, Pagination, CircularProgress } from '@mui/material';
import { BiExport } from 'react-icons/bi';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { GoTrash } from 'react-icons/go';
import SearchBoxComponent from '../../components/SearchBoxComponent/SearchBoxComponent';
import axiosClient from '../../apis/axiosClient';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const CategoryPage = () => {
    const { categories, setCategories } = useContext(MyContext);
    const context = useContext(MyContext);
    const [categoryId, setCategoryId] = useState(null);

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [openMultiple, setOpenMultiple] = useState(false);
    const [isLoadingMultiple, setIsLoadingMultiple] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [searchField, setSearchField] = useState('name');
    const [searchValue, setSearchValue] = useState('');

    const itemsPerPage = import.meta.env.VITE_LIMIT_DEFAULT;
    const [currentPage, setCurrentPage] = useState(1); // State lưu trang hiện tại
    const [totalPages, setTotalPages] = useState(1);
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    const handleChangeSearchField = (event) => {
        setSearchField(event.target.value);
    };

    // Reset currentPage về 1 mỗi khi searchValue thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue]);

    useEffect(() => {
        setIsLoadingCategories(true);

        const handleDebounced = setTimeout(() => {
            getCategories();
        }, 500);

        return () => {
            clearTimeout(handleDebounced);
        };
    }, [context?.isOpenFullScreenPanel, currentPage, searchValue]);

    const getCategories = async () => {
        // let url = `/api/category/all-categories-admin?page=${currentPage}&perPage=${itemsPerPage}`;
        let url = `/api/category/just-all-categories-admin?page=${currentPage}&perPage=${itemsPerPage}`;

        try {
            let finalValue = searchValue;

            // if (searchField === 'rating') finalValue = ratingValue;

            if (finalValue && searchField) {
                url += `&field=${searchField}&value=${finalValue}`;
            }

            const { data } = await axiosClient.get(url);
            console.log('categories: ', data);
            if (data.success) {
                setCategories(data?.categories);

                setTotalPages(data?.totalPages);
            }
        } catch (error) {
            console.error('Lỗi API:', error);
            return [];
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            categories.map((category) => ({
                'Hình ảnh': category.images.length > 0 ? category.images[0] : 'Không có hình ảnh',
                'Tên danh mục': category.name,
            }))
        );

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Danh mục');

        // Xuất file Excel
        XLSX.writeFile(wb, 'DanhMuc.xlsx');
    };

    const handleSelectCategory = (categoryId) => {
        setSelectedCategories((prevSelectedCategories) => {
            let updatedSelectedCategories;

            if (prevSelectedCategories.includes(categoryId)) {
                // Nếu đã chọn thì bỏ chọn
                updatedSelectedCategories = prevSelectedCategories.filter((id) => id !== categoryId);
            } else {
                // Nếu chưa chọn thì chọn
                updatedSelectedCategories = [...prevSelectedCategories, categoryId];
            }

            const allSelected = updatedSelectedCategories.length === categories.length;
            setIsCheckedAll(allSelected);
            const allSelectedOnPage = categories.every((category) => updatedSelectedCategories.includes(category._id));
            setIsCheckedAll(allSelectedOnPage);

            return updatedSelectedCategories;
        });
    };

    const handleSelectAll = () => {
        const currentPageIds = categories.map((category) => category._id);
        if (!isCheckedAll) {
            // Thêm các sản phẩm ở trang hiện tại
            const newSelected = Array.from(new Set([...selectedCategories, ...currentPageIds]));
            setSelectedCategories(newSelected);
            setIsCheckedAll(true);
        } else {
            // Bỏ các sản phẩm ở trang hiện tại
            const newSelected = selectedCategories.filter((id) => !currentPageIds.includes(id));
            setSelectedCategories(newSelected);
            setIsCheckedAll(false);
        }
    };
    useEffect(() => {
        const allSelectedOnPage = categories.every((category) => selectedCategories.includes(category._id));
        setIsCheckedAll(allSelectedOnPage);
    }, [categories, selectedCategories]);

    const handleClickOpen = (id) => {
        setOpen(true);
        setCategoryId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseMultiple = () => {
        setOpenMultiple(false);
    };

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const handleDeleteCategory = async () => {
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

    const handleDeleteMultipleCategories = async () => {
        setIsLoadingMultiple(true);

        try {
            const { data } = await axiosClient.delete(`/api/category/deleteMultipleCategories`, {
                data: { ids: selectedCategories },
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                getCategories();
                setSelectedCategories([]);
                handleCloseMultiple();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoadingMultiple(false);
        }
    };

    useEffect(() => {
        console.log(
            'isCheckedAll, selectedCategories?.length, categories?.length: ',
            isCheckedAll,
            selectedCategories?.length,
            categories?.length
        );
    }, [isCheckedAll, selectedCategories?.length, categories?.length]);

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0">
                <h2 className="text-[18px] font-[600]">Danh sách danh mục</h2>

                <div
                    className={`col ${
                        context.isisOpenSidebar === true ? 'w-[25%]' : 'w-[22%]'
                    }] ml-auto flex items-center gap-3`}
                >
                    {categories?.length > 1 && (isCheckedAll || selectedCategories.length > 1) && (
                        <Button
                            onClick={() => setOpenMultiple(true)}
                            className="btn !bg-red-500 !text-white !normal-case gap-1"
                        >
                            <BiExport />
                            Xoá tất cả
                        </Button>
                    )}
                    <Button className="btn !bg-green-500 !text-white !normal-case gap-1" onClick={handleExportExcel}>
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
                    <div className="col w-[30%]">
                        <h4 className="font-[600] text-[13px] mb-2">Tìm kiếm theo</h4>

                        {context?.categories?.length !== 0 && (
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                sx={{ height: '42px' }}
                                labelId="demo-simple-select-label"
                                id="userSearchDrop"
                                size="small"
                                className="w-full !h-[42px] "
                                value={searchField}
                                onChange={handleChangeSearchField}
                                label="Tìm kiếm"
                            >
                                <MenuItem disabled value="">
                                    Chọn tiêu chí
                                </MenuItem>
                                <MenuItem value="name">Tên danh mục</MenuItem>
                            </Select>
                        )}
                    </div>

                    {/* Name */}
                    {['name'].includes(searchField) && (
                        <div className="col w-[68%] mt-[28px] ">
                            <div className="">
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="h-[44px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                        focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                                                        block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                                        dark:placeholder-gray-400 dark:text-white 
                                                        dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Tìm thông tin...."
                                    required
                                />
                            </div>
                        </div>
                    )}
                </div>

                <br />

                <div className="relative overflow-x-auto mt-1 pb-5">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                        <thead className="text-xs text-gray-700 uppercase bg-white">
                            <tr>
                                <th scope="col" className="px-6 pr-0 py-2 ">
                                    <div className="w-[60px]">
                                        <Checkbox
                                            {...label}
                                            checked={isCheckedAll}
                                            onChange={handleSelectAll}
                                            size="small"
                                        />
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
                            {isLoadingCategories ? (
                                <tr>
                                    <td colSpan={999}>
                                        <div className="flex items-center justify-center w-full min-h-[400px]">
                                            <CircularProgress color="inherit" />
                                        </div>
                                    </td>
                                </tr>
                            ) : categories?.length > 0 ? (
                                categories?.map((category) => (
                                    <tr key={category._id} className="odd:bg-white  even:bg-gray-50 border-b">
                                        <td className="px-6 pr-0 py-2">
                                            <div className="w-[60px]">
                                                <Checkbox
                                                    {...label}
                                                    checked={selectedCategories.includes(category._id)}
                                                    onChange={() => handleSelectCategory(category._id)}
                                                    size="small"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-0 py-2">
                                            <div className="flex items-center gap-4 w-[80px]">
                                                <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                                    <Link to={`/category/${category?._id}`}>
                                                        {category?.images.length > 0 && category?.images[0] && (
                                                            <img
                                                                src={category?.images.length > 0 && category?.images[0]}
                                                                className="w-full group-hover:scale-105 transition-all"
                                                                alt=""
                                                            />
                                                        )}
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={999}>
                                        <div className="flex items-center justify-center w-full min-h-[400px]">
                                            <span className="text-gray-500">Chưa có danh mục</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-center pt-5 pb-5 px-4">
                    <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} color="primary" />
                </div>
            </div>

            {categories?.length > 0 && (
                <Dialog
                    disableScrollLock
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
            )}
            {categories?.length > 0 && (
                <Dialog
                    open={openMultiple}
                    onClose={handleCloseMultiple}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'Xoá tất cả sản phẩm?'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Bạn có chắc chắn xoá tất cả sản phẩm này không?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMultiple}>Huỷ</Button>
                        {isLoadingMultiple === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <Button className="btn-red" onClick={handleDeleteMultipleCategories} autoFocus>
                                Xác nhận
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default CategoryPage;
