import React, { useContext, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

import './ProductPage.scss';
import { Button, MenuItem, Select, Checkbox, Rating, Tooltip, Pagination } from '@mui/material';
import { BiExport } from 'react-icons/bi';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import ProgressProductStatusComponent from '../../components/ProgressProductStatusComponent/ProgressProductStatusComponent';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaRegEye } from 'react-icons/fa6';
import { GoTrash } from 'react-icons/go';
import SearchBoxComponent from '../../components/SearchBoxComponent/SearchBoxComponent';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

const ProductPage = () => {
    const [categoryFilterVal, setCaterogyFilterVal] = useState('');

    const context = useContext(MyContext);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const handleChangeCaterogyFilterVal = (event) => {
        setCaterogyFilterVal(event.target.value);
    };

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0">
                <h2 className="text-[18px] font-[600]">Danh sách sản phẩm</h2>

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
                                model: 'Thêm sản phẩm',
                            })
                        }
                    >
                        <IoMdAdd />
                        Thêm sản phẩm
                    </Button>
                </div>
            </div>

            <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">
                {/* <div className="flex items-center justify-between px-5 py-5">
                    <h2 className="text-[18px] font-[600]">Sản phẩm mới nhất (Tailwind CSS)</h2>
                </div> */}

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

                    {/* <div
                        className={`col ${
                            context.isisOpenSidebar === true ? 'w-[25%]' : 'w-[22%]'
                        }] ml-auto flex items-center gap-3`}
                    >
                        <Button className="btn !bg-green-500 !text-white !normal-case gap-1">
                            <BiExport />
                            Xuất file
                        </Button>
                        <Button className="btn-blue !text-white !normal-case">
                            <IoMdAdd />
                            Thêm sản phẩm
                        </Button>
                    </div> */}
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
                                    Sản phẩm
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Danh mục
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Danh mục con
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Giá
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Tình trạng
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Xếp hạng
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
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                            <Link to="/product/2">
                                                <img
                                                    src="https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg"
                                                    className="w-full group-hover:scale-105 transition-all"
                                                    alt=""
                                                />
                                            </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="text-[12px] font-[600] leading-4 hover:text-primary transition-all">
                                                <Link to="/product/2">
                                                    Váy dạ tiệc xinh màu đen quý phái hiện đại Dior | Louis Vuitton
                                                </Link>
                                            </h3>
                                            <span className="text-[12px]">Váy</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="w-[80px]">Thời trang</p>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="w-[80px]">Phụ nữ</p>
                                </td>
                                <td className="px-6 py-2">
                                    <div className="flex gap-1 flex-col">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px] font-[500]">
                                            {formatCurrency(200000)}
                                        </span>
                                        <span className="price text-primary text-[14px] font-[600]">
                                            {formatCurrency(180000)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="text-[14px] w-[130px]">
                                        <span className="font-[600]">Còn hàng </span>
                                        (500)
                                    </p>
                                    <ProgressProductStatusComponent value={8} status="draft" />
                                </td>
                                <td className="px-6 py-2">
                                    <Rating name="size-small" defaultValue={4.7} readOnly size="small" />
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

                            <tr className="odd:bg-white  even:bg-gray-50 border-b">
                                <td className="px-6 pr-0 py-2">
                                    <div className="w-[60px]">
                                        <Checkbox {...label} size="small" />
                                    </div>
                                </td>
                                <td className="px-0 py-2">
                                    <div className="flex items-center gap-4 w-[330px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                            <Link to="/product/2">
                                                <img
                                                    src="https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg"
                                                    className="w-full group-hover:scale-105 transition-all"
                                                    alt=""
                                                />
                                            </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="text-[12px] font-[600] leading-4 hover:text-primary transition-all">
                                                <Link to="/product/2">
                                                    Váy dạ tiệc xinh màu đen quý phái hiện đại Dior | Louis Vuitton
                                                </Link>
                                            </h3>
                                            <span className="text-[12px]">Váy</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="w-[80px]">Thời trang</p>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="w-[80px]">Phụ nữ</p>
                                </td>
                                <td className="px-6 py-2">
                                    <div className="flex gap-1 flex-col">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px] font-[500]">
                                            {formatCurrency(200000)}
                                        </span>
                                        <span className="price text-primary text-[14px] font-[600]">
                                            {formatCurrency(180000)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="text-[14px] w-[130px]">
                                        <span className="font-[600]">Còn hàng </span>
                                        (500)
                                    </p>
                                    <ProgressProductStatusComponent value={8} status="draft" />
                                </td>
                                <td className="px-6 py-2">
                                    <Rating name="size-small" defaultValue={4.7} readOnly size="small" />
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
                            <tr className="odd:bg-white  even:bg-gray-50 border-b">
                                <td className="px-6 pr-0 py-2">
                                    <div className="w-[60px]">
                                        <Checkbox {...label} size="small" />
                                    </div>
                                </td>
                                <td className="px-0 py-2">
                                    <div className="flex items-center gap-4 w-[330px]">
                                        <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                            <Link to="/product/2">
                                                <img
                                                    src="https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg"
                                                    className="w-full group-hover:scale-105 transition-all"
                                                    alt=""
                                                />
                                            </Link>
                                        </div>
                                        <div className="info w-[75%]">
                                            <h3 className="text-[12px] font-[600] leading-4 hover:text-primary transition-all">
                                                <Link to="/product/2">
                                                    Váy dạ tiệc xinh màu đen quý phái hiện đại Dior | Louis Vuitton
                                                </Link>
                                            </h3>
                                            <span className="text-[12px]">Váy</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="w-[80px]">Thời trang</p>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="w-[80px]">Phụ nữ</p>
                                </td>
                                <td className="px-6 py-2">
                                    <div className="flex gap-1 flex-col">
                                        <span className="oldPrice line-through leading-3 text-gray-500 text-[14px] font-[500]">
                                            {formatCurrency(200000)}
                                        </span>
                                        <span className="price text-primary text-[14px] font-[600]">
                                            {formatCurrency(180000)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    <p className="text-[14px] w-[130px]">
                                        <span className="font-[600]">Còn hàng </span>
                                        (500)
                                    </p>
                                    <ProgressProductStatusComponent value={8} status="draft" />
                                </td>
                                <td className="px-6 py-2">
                                    <Rating name="size-small" defaultValue={4.7} readOnly size="small" />
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

export default ProductPage;
