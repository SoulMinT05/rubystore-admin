import React, { useContext, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

import './SubCategoryPage.scss';
import { Button, MenuItem, Select, Checkbox, Tooltip, Pagination, Chip } from '@mui/material';
import { BiExport } from 'react-icons/bi';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaRegEye } from 'react-icons/fa6';
import { GoTrash } from 'react-icons/go';
import SearchBoxComponent from '../../components/SearchBoxComponent/SearchBoxComponent';

const SubCategoryPage = () => {
    const [categoryFilterVal, setCaterogyFilterVal] = useState('');

    const context = useContext(MyContext);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const handleChangeCaterogyFilterVal = (event) => {
        setCaterogyFilterVal(event.target.value);
    };

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0">
                <h2 className="text-[18px] font-[600]">Danh sách danh mục con</h2>

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
                                model: 'Thêm danh mục con',
                            })
                        }
                    >
                        <IoMdAdd />
                        Thêm danh mục con
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
                            label="Danh mục con"
                            onChange={handleChangeCaterogyFilterVal}
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
                                    Tên danh mục cha
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Tên danh mục con
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
                                    <div className="flex items-center gap-4 w-[80px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                            <Link to="/product/2">
                                                <img
                                                    src="https://serviceapi.spicezgold.com/download/1742452220122_saffola-gold-pro-healthy-lifestyle-ricebran-based-blended-oil-1-l-product-images-o490000057-p490000057-0-202403191806.webp"
                                                    className="w-full group-hover:scale-105 transition-all"
                                                    alt=""
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    <Chip label="Thời trang" />
                                </td>
                                <td className="px-6 py-2">
                                    <div className="flex items-center gap-3">
                                        <Chip label="Thời trang" color="primary" />
                                        <Chip label="Trang sức" color="primary" />
                                        <Chip label="Điện tử" color="primary" />
                                    </div>
                                </td>

                                <td className="px-6 py-2">
                                    <div className="flex items-center gap-1">
                                        <Tooltip title="Chỉnh sửa" placement="top">
                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
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

export default SubCategoryPage;
