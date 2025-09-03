import React, { useContext, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

import './HomeSlidePage.scss';
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
import { useDispatch, useSelector } from 'react-redux';
import { deleteHomeSlide, deleteMultipleHomeSlides, fetchHomeSlides } from '../../redux/homeSlidesSlice';

const HomeSlidePage = () => {
    const dispatch = useDispatch();
    const { homeSlides } = useSelector((state) => state.homeSlides);

    const context = useContext(MyContext);
    const [homeSlideId, setHomeSlideId] = useState(null);

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openMultiple, setOpenMultiple] = useState(false);
    const [isLoadingMultiple, setIsLoadingMultiple] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [selectedHomeSlides, setSelectedHomeSlides] = useState([]);
    const [isLoadingHomeSlides, setIsLoadingHomeSlides] = useState(false);

    const itemsPerPage = import.meta.env.VITE_LIMIT_DEFAULT;
    const [currentPage, setCurrentPage] = useState(1); // State lưu trang hiện tại
    const [totalPages, setTotalPages] = useState(1);
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    // Reset currentPage về 1 mỗi khi searchValue hoặc searchField thay đổi
    // useEffect(() => {
    //     setCurrentPage(1);
    // }, []);

    useEffect(() => {
        setIsLoadingHomeSlides(true);

        const handleDebounced = setTimeout(() => {
            const getHomeSlides = async () => {
                let url = `/api/homeSlide/all-home-slides-admin?page=${currentPage}&perPage=${itemsPerPage}`;

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
                    console.log('slides: ', data);
                    if (data.success) {
                        dispatch(fetchHomeSlides(data?.homeSlides));
                        setTotalPages(data?.totalPages);
                    }
                } catch (error) {
                    console.error('Lỗi API:', error.response.data.message);
                    return [];
                } finally {
                    setIsLoadingHomeSlides(false);
                }
            };
            getHomeSlides();
        }, 500);

        return () => {
            clearTimeout(handleDebounced);
        };
    }, [context?.isOpenFullScreenPanel, currentPage]);

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            homeSlides.map((homeSlide) => ({
                'Hình ảnh': homeSlide.images?.length > 0 ? homeSlide.images[0] : 'Không có hình ảnh',
                'Tên home slide': homeSlide.name,
            }))
        );

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Home slide');

        // Xuất file Excel
        XLSX.writeFile(wb, 'HomeSlide.xlsx');
    };

    const handleSelectHomeSlide = (homeSlideId) => {
        setSelectedHomeSlides((prevSelectedHomeSlides) => {
            let updatedSelectedHomeSlides;

            if (prevSelectedHomeSlides.includes(homeSlideId)) {
                // Nếu đã chọn thì bỏ chọn
                updatedSelectedHomeSlides = prevSelectedHomeSlides.filter((id) => id !== homeSlideId);
            } else {
                // Nếu chưa chọn thì chọn
                updatedSelectedHomeSlides = [...prevSelectedHomeSlides, homeSlideId];
            }

            const allSelected = updatedSelectedHomeSlides?.length === homeSlides?.length;
            setIsCheckedAll(allSelected);
            const allSelectedOnPage = homeSlides.every((homeSlide) =>
                updatedSelectedHomeSlides.includes(homeSlide._id)
            );
            setIsCheckedAll(allSelectedOnPage);

            return updatedSelectedHomeSlides;
        });
    };

    const handleSelectAll = () => {
        const currentPageIds = homeSlides.map((homeSlide) => homeSlide._id);
        if (!isCheckedAll) {
            // Thêm các sản phẩm ở trang hiện tại
            const newSelected = Array.from(new Set([...selectedHomeSlides, ...currentPageIds]));
            setSelectedHomeSlides(newSelected);
            setIsCheckedAll(true);
        } else {
            // Bỏ các sản phẩm ở trang hiện tại
            const newSelected = selectedHomeSlides.filter((id) => !currentPageIds.includes(id));
            setSelectedHomeSlides(newSelected);
            setIsCheckedAll(false);
        }
    };
    useEffect(() => {
        const allSelectedOnPage = homeSlides.every((homeSlide) => selectedHomeSlides.includes(homeSlide._id));
        setIsCheckedAll(allSelectedOnPage);
    }, [homeSlides, selectedHomeSlides]);

    const handleClickOpen = (id) => {
        setOpen(true);
        setHomeSlideId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleCloseMultiple = () => {
        setOpenMultiple(false);
    };

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const handleDeleteHomeSlide = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosClient.delete(`/api/homeSlide/${homeSlideId}`);
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(deleteHomeSlide({ homeSlideId }));
                handleClose();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMultipleHomeSlide = async () => {
        setIsLoadingMultiple(true);

        try {
            const { data } = await axiosClient.delete('/api/homeSlide/deleteMultipleHomeSlides', {
                data: { ids: selectedHomeSlides },
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(
                    deleteMultipleHomeSlides({
                        homeSlidesIds: selectedHomeSlides,
                    })
                );
                setSelectedHomeSlides([]);
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
                <h2 className="text-[18px] font-[600]">Danh sách home slide</h2>

                <div
                    className={`col ${
                        context.isisOpenSidebar === true ? 'w-[25%]' : 'w-[22%]'
                    }] ml-auto flex items-center gap-3`}
                >
                    {homeSlides?.length > 1 && (isCheckedAll || selectedHomeSlides.length > 1) && (
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
                                model: 'Thêm home slide',
                            })
                        }
                    >
                        <IoMdAdd />
                        Thêm Home Slide
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
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingHomeSlides ? (
                                <tr>
                                    <td colSpan={999}>
                                        <div className="flex items-center justify-center w-full min-h-[400px]">
                                            <CircularProgress color="inherit" />
                                        </div>
                                    </td>
                                </tr>
                            ) : homeSlides?.length > 0 ? (
                                homeSlides?.map((homeSlide) => (
                                    <tr key={homeSlide._id} className="odd:bg-white  even:bg-gray-50 border-b">
                                        <td className="px-6 pr-0 py-2">
                                            <div className="w-[60px]">
                                                <Checkbox
                                                    {...label}
                                                    checked={selectedHomeSlides.includes(homeSlide._id)}
                                                    onChange={() => handleSelectHomeSlide(homeSlide._id)}
                                                    size="small"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-0 py-2">
                                            <div className="flex items-center gap-4 w-[330px]">
                                                <div className="img w-full rounded-md overflow-hidden group">
                                                    <Link to={`/home-slide/${homeSlide?._id}`}>
                                                        <img
                                                            src={homeSlide?.image}
                                                            className="w-full max-h-[100px] object-cover group-hover:scale-105 transition-all"
                                                            alt=""
                                                        />
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-2">
                                            <div className="flex items-center gap-1">
                                                <Tooltip title="Chỉnh sửa" placement="top">
                                                    <Button
                                                        className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                                        onClick={() =>
                                                            context.setIsOpenFullScreenPanel({
                                                                open: true,
                                                                model: 'Cập nhật home slide',
                                                                id: homeSlide._id,
                                                            })
                                                        }
                                                    >
                                                        <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="Xoá" placement="top">
                                                    <Button
                                                        onClick={() => handleClickOpen(homeSlide._id)}
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
                                            <span className="text-gray-500">Chưa có slide</span>
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

            {homeSlides?.length > 0 && (
                <Dialog
                    disableScrollLock
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'Xoá home slide?'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Bạn có chắc chắn xoá home slide này không?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Huỷ</Button>
                        {isLoading === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <Button className="btn-red" onClick={handleDeleteHomeSlide} autoFocus>
                                Xác nhận
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            )}
            {homeSlides?.length > 0 && (
                <Dialog
                    open={openMultiple}
                    onClose={handleCloseMultiple}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'Xoá tất cả slide?'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Bạn có chắc chắn xoá tất cả slide này không?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMultiple}>Huỷ</Button>
                        {isLoadingMultiple === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <Button className="btn-red" onClick={handleDeleteMultipleHomeSlide} autoFocus>
                                Xác nhận
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default HomeSlidePage;
