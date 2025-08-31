import React, { useContext, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

import './BannerPage.scss';
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

const BannerPage = () => {
    const { banners, setBanners } = useContext(MyContext);
    const context = useContext(MyContext);
    const [bannerFilterVal, setBannerFilterVal] = useState('');
    const [bannerId, setBannerId] = useState(null);

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openMultiple, setOpenMultiple] = useState(false);
    const [isLoadingMultiple, setIsLoadingMultiple] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [selectedBanners, setSelectedBanners] = useState([]);

    const itemsPerPage = 10;
    // State lưu trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    // Tính tổng số trang
    const totalPages = Math.ceil(banners.length / itemsPerPage);
    // Xử lý khi đổi trang
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };
    // Cắt dữ liệu theo trang
    const currentBanners = banners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            banners.map((banner) => ({
                'Hình ảnh': banner.images.length > 0 ? banner.images[0] : 'Không có hình ảnh',
                'Tên banner': banner.name,
            }))
        );

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Banner');

        // Xuất file Excel
        XLSX.writeFile(wb, 'banner.xlsx');
    };

    const handleSelectBanner = (bannerId) => {
        setSelectedBanners((prevSelectedBanners) => {
            let updatedSelectedBanners;

            if (prevSelectedBanners.includes(bannerId)) {
                // Nếu đã chọn thì bỏ chọn
                updatedSelectedBanners = prevSelectedBanners.filter((id) => id !== bannerId);
            } else {
                // Nếu chưa chọn thì chọn
                updatedSelectedBanners = [...prevSelectedBanners, bannerId];
            }

            const allSelected = updatedSelectedBanners.length === banners.length;
            setIsCheckedAll(allSelected);
            const allSelectedOnPage = currentBanners.every((banner) => updatedSelectedBanners.includes(banner._id));
            setIsCheckedAll(allSelectedOnPage);

            return updatedSelectedBanners;
        });
    };

    const handleSelectAll = () => {
        const currentPageIds = currentBanners.map((banner) => banner._id);
        if (!isCheckedAll) {
            // Thêm các sản phẩm ở trang hiện tại
            const newSelected = Array.from(new Set([...selectedBanners, ...currentPageIds]));
            setSelectedBanners(newSelected);
            setIsCheckedAll(true);
        } else {
            // Bỏ các sản phẩm ở trang hiện tại
            const newSelected = selectedBanners.filter((id) => !currentPageIds.includes(id));
            setSelectedBanners(newSelected);
            setIsCheckedAll(false);
        }
    };
    useEffect(() => {
        const allSelectedOnPage = currentBanners.every((banner) => selectedBanners.includes(banner._id));
        setIsCheckedAll(allSelectedOnPage);
    }, [currentBanners, selectedBanners]);

    const handleClickOpen = (id) => {
        setOpen(true);
        setBannerId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleCloseMultiple = () => {
        setOpenMultiple(false);
    };

    useEffect(() => {
        const getBanners = async () => {
            try {
                const { data } = await axiosClient.get('/api/banner/all-banners');
                console.log('dataBanner: ', data);
                if (data.success) {
                    setBanners(data?.banners);
                } else {
                    console.error('Lỗi lấy banner:', data.message);
                }
            } catch (error) {
                console.error('Lỗi API:', error);
                return [];
            }
        };
        getBanners();
    }, [context?.isOpenFullScreenPanel]);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const handleChangeBannerFilterVal = (event) => {
        setBannerFilterVal(event.target.value);
    };

    const handleDeleteBanner = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosClient.delete(`/api/banner/${bannerId}`);
            if (data.success) {
                context.openAlertBox('success', data.message);
                setBanners((prev) => prev.filter((banner) => banner._id !== bannerId));
                handleClose();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoading(false);
        }
    };
    const handleDeleteMultipleBanner = async () => {
        setIsLoadingMultiple(true);

        try {
            const { data } = await axiosClient.delete(`/api/banner/deleteMultipleBanner`, {
                data: { ids: selectedBanners },
            });
            console.log('data: ', data);
            if (data.success) {
                context.openAlertBox('success', data.message);
                context.getBanners();
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
                <h2 className="text-[18px] font-[600]">Danh sách banner</h2>

                <div
                    className={`col ${
                        context.isisOpenSidebar === true ? 'w-[25%]' : 'w-[22%]'
                    }] ml-auto flex items-center gap-3`}
                >
                    {(isCheckedAll || selectedBanners.length > 1) && (
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
                                model: 'Thêm banner',
                            })
                        }
                    >
                        <IoMdAdd />
                        Thêm banner
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
                            value={bannerFilterVal}
                            label="banner"
                            onChange={handleChangeBannerFilterVal}
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
                                    Tên banner
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBanners?.map((banner) => (
                                <tr key={banner._id} className="odd:bg-white  even:bg-gray-50 border-b">
                                    <td className="px-6 pr-0 py-2">
                                        <div className="w-[60px]">
                                            <Checkbox
                                                {...label}
                                                checked={selectedBanners.includes(banner._id)}
                                                onChange={() => handleSelectBanner(banner._id)}
                                                size="small"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-0 py-2">
                                        <div className="flex items-center gap-4 w-[80px]">
                                            <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                                <Link to={`/banner/${banner?._id}`}>
                                                    <img
                                                        src={banner?.images.length > 0 && banner?.images[0]}
                                                        className="w-full group-hover:scale-105 transition-all"
                                                        alt=""
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2">
                                        <p className="w-[180px] line-clamp-2">{banner?.name}</p>
                                    </td>

                                    <td className="px-6 py-2">
                                        <div className="flex items-center gap-1">
                                            <Tooltip title="Chỉnh sửa" placement="top">
                                                <Button
                                                    className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]"
                                                    onClick={() =>
                                                        context.setIsOpenFullScreenPanel({
                                                            open: true,
                                                            model: 'Cập nhật banner',
                                                            id: banner._id,
                                                        })
                                                    }
                                                >
                                                    <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Xoá" placement="top">
                                                <Button
                                                    onClick={() => handleClickOpen(banner._id)}
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
                <DialogTitle id="alert-dialog-title">{'Xoá banner?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn xoá banner này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Huỷ</Button>
                    {isLoading === true ? (
                        <CircularProgress color="inherit" />
                    ) : (
                        <Button className="btn-red" onClick={handleDeleteBanner} autoFocus>
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
                <DialogTitle id="alert-dialog-title">{'Xoá tất cả banner?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn xoá tất cả banner này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMultiple}>Huỷ</Button>
                    {isLoadingMultiple === true ? (
                        <CircularProgress color="inherit" />
                    ) : (
                        <Button className="btn-red" onClick={handleDeleteMultipleBanner} autoFocus>
                            Xác nhận
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BannerPage;
