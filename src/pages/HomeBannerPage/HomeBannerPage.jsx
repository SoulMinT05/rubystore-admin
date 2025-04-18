import React, { useContext } from 'react';
import { IoMdAdd } from 'react-icons/io';

import './HomeBannerPage.scss';
import { Button, Checkbox, Tooltip, Pagination } from '@mui/material';
import { BiExport } from 'react-icons/bi';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaRegEye } from 'react-icons/fa6';
import { GoTrash } from 'react-icons/go';

const HomeBannerPage = () => {
    const context = useContext(MyContext);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    return (
        <>
            <div className="flex items-center justify-between px-2 py-0">
                <h2 className="text-[18px] font-[600]">Danh sách banner</h2>

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
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="odd:bg-white  even:bg-gray-50 border-b">
                                <td className="px-6 pr-0 py-2">
                                    <div className="w-[60px]">
                                        <Checkbox {...label} size="small" />
                                    </div>
                                </td>
                                <td className="px-0 py-2">
                                    <div className="flex items-center gap-4 w-[330px]">
                                        <div className="img w-full rounded-md overflow-hidden group">
                                            <Link to="/product/2">
                                                <img
                                                    src="https://serviceapi.spicezgold.com/download/1741660862304_NewProject(8).jpg"
                                                    className="w-full group-hover:scale-105 transition-all"
                                                    alt=""
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    <div className="flex items-center gap-1">
                                        <Tooltip title="Chỉnh sửa" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Xem chi tiết" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Xoá" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-center pt-5 pb-5 px-4">
                    <Pagination count={10} color="primary" />
                </div>
            </div>
        </>
    );
};

export default HomeBannerPage;
