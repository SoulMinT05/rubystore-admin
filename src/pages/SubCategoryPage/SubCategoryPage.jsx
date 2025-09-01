import React, { useContext, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { FaAngleDown } from 'react-icons/fa6';

import './SubCategoryPage.scss';
import { Button } from '@mui/material';
import { BiExport } from 'react-icons/bi';
import { MyContext } from '../../App';
import EditSubCategoryComponent from '../../components/EditSubCategoryComponent/EditSubCategoryComponent';

import * as XLSX from 'xlsx';
import axiosClient from '../../apis/axiosClient';

const SubCategoryPage = () => {
    const { categories, setCategories } = useContext(MyContext);
    const [isOpen, setIsOpen] = useState(0);

    const context = useContext(MyContext);

    const handleExportExcel = () => {
        const flattenCategories = [];

        const traverse = (categoryList, level = 1, parentName = '--', parentImage = '') => {
            categoryList.forEach((category) => {
                flattenCategories.push({
                    'Tên danh mục': category.name,
                    Cấp: `Cấp ${level}`,
                    'Danh mục cha': parentName,
                    'Hình ảnh': level === 1 ? category.images?.[0] || 'Không có hình ảnh' : '',
                });

                if (category.children && category.children.length > 0) {
                    traverse(
                        category.children,
                        level + 1,
                        category.name,
                        level === 1 ? category.images?.[0] || '' : parentImage
                    );
                }
            });
        };

        traverse(categories); // bắt đầu từ cấp 1

        const ws = XLSX.utils.json_to_sheet(flattenCategories);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Danh mục');
        XLSX.writeFile(wb, 'DanhSachDanhMuc.xlsx');
    };

    useEffect(() => {
        const getCategories = async () => {
            try {
                const { data } = await axiosClient.get('/api/category/all-categories-admin');
                console.log('categories: ', data);
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
    }, [context?.isOpenFullScreenPanel]);

    const handleExpand = (index) => {
        if (isOpen === index) {
            setIsOpen(!isOpen);
        } else {
            setIsOpen(index);
        }
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
                    <Button onClick={handleExportExcel} className="btn !bg-green-500 !text-white !normal-case gap-1">
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

            <div className="card my-4 pt-5 pb-5 px-5 shadow-md sm:rounded-lg bg-white">
                {categories?.length !== 0 && (
                    <ul className="w-full">
                        {categories?.map((firstLevelCategory, index) => {
                            return (
                                <li className="w-full mb-1" key={index}>
                                    <div className="flex items-center w-full p-2 bg-[#f1f1f1] rounded-sm px-4">
                                        <span className="font-[500] flex items-center gap-4 text-[14px]">
                                            {firstLevelCategory?.name}
                                        </span>

                                        <Button
                                            onClick={() => handleExpand(index)}
                                            className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black !ml-auto"
                                        >
                                            <FaAngleDown />
                                        </Button>
                                    </div>

                                    {isOpen === index && (
                                        <>
                                            {firstLevelCategory?.children?.length !== 0 && (
                                                <ul className="w-full">
                                                    {firstLevelCategory?.children?.map((subCategory, _index) => {
                                                        return (
                                                            <li className="w-full py-1" key={_index}>
                                                                <EditSubCategoryComponent
                                                                    name={subCategory?.name}
                                                                    id={subCategory?._id}
                                                                    categories={context?.categories}
                                                                    selectedCategory={subCategory?.parentId}
                                                                    selectedCategoryName={
                                                                        subCategory?.parentCategoryName
                                                                    }
                                                                />

                                                                {subCategory?.children?.length !== 0 && (
                                                                    <ul className="pl-4">
                                                                        {subCategory?.children?.map(
                                                                            (thirdLevel, index_) => {
                                                                                return (
                                                                                    <li
                                                                                        className="w-full hover:bg-[#f1f1f1]"
                                                                                        key={index_}
                                                                                    >
                                                                                        <EditSubCategoryComponent
                                                                                            name={thirdLevel?.name}
                                                                                            id={thirdLevel?._id}
                                                                                            categories={
                                                                                                firstLevelCategory?.children
                                                                                            }
                                                                                            selectedCategory={
                                                                                                thirdLevel?.parentId
                                                                                            }
                                                                                            selectedCategoryName={
                                                                                                thirdLevel?.parentCategoryName
                                                                                            }
                                                                                        />
                                                                                    </li>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </ul>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </>
    );
};

export default SubCategoryPage;
