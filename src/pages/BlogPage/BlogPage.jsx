import React, { useContext, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

import './BlogPage.scss';
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

import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBlog, deleteMultipleBlogs, fetchBlogs } from '../../redux/blogSlice';

const BlogPage = () => {
    const context = useContext(MyContext);
    const { blogs } = useSelector((state) => state.blogs);
    const dispatch = useDispatch();

    const [blogId, setBlogId] = useState(null);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openMultiple, setOpenMultiple] = useState(false);
    const [isLoadingMultiple, setIsLoadingMultiple] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [selectedBlogs, setSelectedBlogs] = useState([]);
    const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);

    const itemsPerPage = import.meta.env.VITE_LIMIT_DEFAULT;
    const [currentPage, setCurrentPage] = useState(1); // State lưu trang hiện tại
    const [totalPages, setTotalPages] = useState(1);
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    useEffect(() => {
        setIsLoadingBlogs(true);
        const handleDebounced = setTimeout(() => {
            const getBlogs = async () => {
                let url = `/api/blog/all-blogs-admin?page=${currentPage}&perPage=${itemsPerPage}`;

                try {
                    // let finalValue = searchValue;

                    // if (searchField === 'rating') finalValue = ratingValue;

                    // // if (!currentPage) {
                    // //     setCurrentPage(1);
                    // // }

                    // if (finalValue && searchField) {
                    //     url += `&field=${searchField}&value=${finalValue}`;
                    // }

                    const { data } = await axiosClient.get(url);
                    console.log('blogs: ', data);
                    if (data.success) {
                        dispatch(fetchBlogs(data?.blogs));
                        setTotalPages(data?.totalPages);
                    }
                } catch (error) {
                    console.error('Lỗi API:', error);
                    console.log('error: ', error.response.data.message);
                    return [];
                } finally {
                    setIsLoadingBlogs(false);
                }
            };
            getBlogs();
        }, 500);

        return () => {
            clearTimeout(handleDebounced);
        };
    }, [context?.isOpenFullScreenPanel, currentPage]);

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            blogs?.map((blog) => ({
                'Hình ảnh': blog.images?.length > 0 ? blog.images[0] : 'Không có hình ảnh',
                'Tên bài viết': blog.name,
                'Mô tả bài viết': blog.description,
            }))
        );

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Blog');

        // Xuất file Excel
        XLSX.writeFile(wb, 'Blog.xlsx');
    };

    const handleSelectBlog = (blogId) => {
        setSelectedBlogs((prevSelectedBlogs) => {
            let updatedSelectedBlogs;

            if (prevSelectedBlogs.includes(blogId)) {
                // Nếu đã chọn thì bỏ chọn
                updatedSelectedBlogs = prevSelectedBlogs.filter((id) => id !== blogId);
            } else {
                // Nếu chưa chọn thì chọn
                updatedSelectedBlogs = [...prevSelectedBlogs, blogId];
            }

            const allSelected = updatedSelectedBlogs?.length === blogs?.length;
            setIsCheckedAll(allSelected);
            const allSelectedOnPage = blogs?.every((blog) => updatedSelectedBlogs.includes(blog._id));
            setIsCheckedAll(allSelectedOnPage);

            return updatedSelectedBlogs;
        });
    };

    const handleSelectAll = () => {
        const currentPageIds = blogs?.map((blog) => blog._id);
        if (!isCheckedAll) {
            // Thêm các sản phẩm ở trang hiện tại
            const newSelected = Array.from(new Set([...selectedBlogs, ...currentPageIds]));
            setSelectedBlogs(newSelected);
            setIsCheckedAll(true);
        } else {
            // Bỏ các sản phẩm ở trang hiện tại
            const newSelected = selectedBlogs.filter((id) => !currentPageIds.includes(id));
            setSelectedBlogs(newSelected);
            setIsCheckedAll(false);
        }
    };
    useEffect(() => {
        const allSelectedOnPage = blogs?.every((blog) => selectedBlogs.includes(blog._id));
        setIsCheckedAll(allSelectedOnPage);
    }, [blogs, selectedBlogs]);

    const handleClickOpen = (id) => {
        setOpen(true);
        setBlogId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseMultiple = () => {
        setOpenMultiple(false);
    };

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const handleDeleteBlog = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosClient.delete(`/api/blog/${blogId}`);
            console.log('delteblog: ', data);
            if (data.success) {
                context.openAlertBox('success', data.message);
                // setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
                dispatch(
                    deleteBlog({
                        blogId,
                    })
                );
                handleClose();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMultipleBlogs = async () => {
        setIsLoadingMultiple(true);

        try {
            const { data } = await axiosClient.delete(`/api/blog/deleteMultipleBlog`, {
                data: { ids: selectedBlogs },
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(
                    deleteMultipleBlogs({
                        blogIds: selectedBlogs,
                    })
                );
                setSelectedBlogs([]);
                handleCloseMultiple();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoadingMultiple(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0">
                <h2 className="text-[18px] font-[600]">Danh sách bài viết</h2>

                <div
                    className={`col ${
                        context.isisOpenSidebar === true ? 'w-[25%]' : 'w-[22%]'
                    }] ml-auto flex items-center gap-3`}
                >
                    {blogs?.length > 1 && (isCheckedAll || selectedBlogs.length > 1) && (
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
                                model: 'Thêm bài viết',
                            })
                        }
                    >
                        <IoMdAdd />
                        Thêm bài viết
                    </Button>
                </div>
            </div>

            <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
                <br />

                <div className="relative overflow-x-auto mt-1 pb-5">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                        <thead className="text-xs text-gray-700 uppercase bg-white">
                            <tr>
                                <th scope="col" className="px-6 pr-0 py-2 ">
                                    <div className="w-[60px]">
                                        <Checkbox
                                            {...label}
                                            checked={Boolean(isCheckedAll)}
                                            onChange={handleSelectAll}
                                            size="small"
                                        />
                                    </div>
                                </th>
                                <th scope="col" className="px-0 py-3 whitespace-nowrap">
                                    Hình ảnh
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Tên bài viết
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Mô tả bài viết
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingBlogs ? (
                                <tr>
                                    <td colSpan={999}>
                                        <div className="flex items-center justify-center w-full min-h-[400px]">
                                            <CircularProgress color="inherit" />
                                        </div>
                                    </td>
                                </tr>
                            ) : blogs?.length > 0 ? (
                                blogs?.map((blog) => {
                                    const sanitizedDescription = DOMPurify.sanitize(blog.description, {
                                        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'span'],
                                    });
                                    return (
                                        <tr key={blog._id} className="odd:bg-white  even:bg-gray-50 border-b">
                                            <td className="px-6 pr-0 py-2">
                                                <div className="w-[60px]">
                                                    <Checkbox
                                                        {...label}
                                                        checked={selectedBlogs.includes(blog._id)}
                                                        onChange={() => handleSelectBlog(blog._id)}
                                                        size="small"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-0 py-2">
                                                <div className="flex items-center gap-4 w-[80px]">
                                                    <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                                        <Link to={`/blog/${blog?._id}`}>
                                                            <img
                                                                src={blog?.images?.length > 0 && blog?.images[0]}
                                                                className="w-full group-hover:scale-105 transition-all"
                                                                alt=""
                                                            />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[180px]">{blog?.name}</p>
                                            </td>
                                            <td className="px-6 py-2 line-clamp-2">
                                                <div
                                                    className="w-[300px] line-clamp-2"
                                                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                                                />
                                            </td>

                                            <td className="px-6 py-2">
                                                <div className="flex items-center gap-1">
                                                    <Tooltip title="Chỉnh sửa" placement="top">
                                                        <Button
                                                            className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                                            onClick={() =>
                                                                context.setIsOpenFullScreenPanel({
                                                                    open: true,
                                                                    model: 'Cập nhật bài viết',
                                                                    id: blog._id,
                                                                })
                                                            }
                                                        >
                                                            <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Xoá" placement="top">
                                                        <Button
                                                            onClick={() => handleClickOpen(blog._id)}
                                                            className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                                        >
                                                            <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={999}>
                                        <div className="flex items-center justify-center w-full min-h-[400px]">
                                            <span className="text-gray-500">Chưa có bài viết</span>
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

            <Dialog
                disableScrollLock
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Xoá bài viết?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn xoá bài viết này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Huỷ</Button>
                    {isLoading === true ? (
                        <CircularProgress color="inherit" />
                    ) : (
                        <Button className="btn-red" onClick={handleDeleteBlog} autoFocus>
                            Xác nhận
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
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
                        <Button className="btn-red" onClick={handleDeleteMultipleBlogs} autoFocus>
                            Xác nhận
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BlogPage;
