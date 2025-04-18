import React, { useContext } from 'react';
import { IoMdAdd } from 'react-icons/io';

import './StaffPage.scss';
import { Button, MenuItem, Select, Checkbox, Tooltip, Pagination, Stack, Typography } from '@mui/material';
import { BiExport } from 'react-icons/bi';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaRegEye } from 'react-icons/fa6';
import { GoTrash } from 'react-icons/go';
import SearchBoxComponent from '../../components/SearchBoxComponent/SearchBoxComponent';
import BadgeUserStatusComponent from '../../components/BadgeUserStatusComponent/BadgeUserStatusComponent';

const StaffPage = () => {
    const context = useContext(MyContext);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0">
                <h2 className="text-[18px] font-[600]">Danh sách nhân viên</h2>

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
                                model: 'Thêm nhân viên',
                            })
                        }
                    >
                        <IoMdAdd />
                        Thêm nhân viên
                    </Button>
                </div>
            </div>

            <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
                <div className="flex items-center w-full justify-between px-5">
                    <div className="col w-[100%]">
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
                                    Avatar
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Họ và tên
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Username
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Số điện thoại
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Địa chỉ
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Chức vụ
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Trạng thái
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Ngày tạo
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
                                    <div className="flex items-center gap-4 w-[100px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                            <Link to="/product/2">
                                                <img
                                                    src="https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg"
                                                    className="w-full group-hover:scale-105 transition-all"
                                                    alt=""
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="w-[80px]">Tam Nguyen</p>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="w-[80px]">tamnguyen</p>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="w-[150px]">tamnguyen@gmail.com</p>
                                </td>
                                <td className="px-6 py-2">092812122</td>
                                <td className="px-6 py-2">
                                    <p className="w-[150px]">137 Trần Bình Thạnh, q.Cái Răng, Tp Hồ Chí Minh</p>
                                </td>
                                <td className="px-6 py-2">
                                    <BadgeUserStatusComponent status="active" />
                                </td>
                                <td className="px-6 py-2">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value="" className="sr-only peer" />
                                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                    </label>
                                </td>

                                <td className="px-6 py-2">
                                    <p className="w-[80px]">{formatDate(20022024)}</p>
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

export default StaffPage;

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
