import React, { useContext, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

import './ProductPage.scss';
import { Button, MenuItem, Select, Checkbox, Rating, Tooltip, Pagination, CircularProgress } from '@mui/material';

import { BiExport } from 'react-icons/bi';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import ProgressProductStatusComponent from '../../components/ProgressProductStatusComponent/ProgressProductStatusComponent';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaRegEye } from 'react-icons/fa6';
import { GoTrash } from 'react-icons/go';
import SearchBoxComponent from '../../components/SearchBoxComponent/SearchBoxComponent';
import axiosClient from '../../apis/axiosClient';
import * as XLSX from 'xlsx';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

const ProductPage = () => {
    const { products, setProducts } = useContext(MyContext);
    const context = useContext(MyContext);

    const [productId, setProductId] = useState(null);
    // const [productCategory, setProductCategory] = useState('');
    // const [productSubCategory, setProductSubCategory] = useState('');
    // const [productThirdSubCategory, setProductThirdSubCategory] = useState('');

    const [open, setOpen] = useState(false);
    const [isLoadingDeleteProduct, setIsLoadingDeleteProduct] = useState(false);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [openMultiple, setOpenMultiple] = useState(false);
    const [isLoadingMultiple, setIsLoadingMultiple] = useState(false);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [, setFormFields] = useState({
        categoryId: '',
        categoryName: '',
        subCategoryId: '',
        subCategoryName: '',
        thirdSubCategoryId: '',
        thirdSubCategoryName: '',
    });

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const [searchField, setSearchField] = useState('name');
    const [searchValue, setSearchValue] = useState('');
    const [priceValue, setPriceValue] = useState('');
    const [categoryValue, setCategoryValue] = useState('');
    const [subCategoryValue, setSubCategoryValue] = useState('');
    const [thirdSubCategoryValue, setThirdSubCategoryValue] = useState('');
    const [countInStockValue, setCountInStockValue] = useState('');
    const [discountValue, setDiscountValue] = useState('');
    const [ratingValue, setRatingValue] = useState(5);
    const [isFeaturedValue, setIsFeaturedValue] = useState('');

    const itemsPerPage = import.meta.env.VITE_LIMIT_DEFAULT;
    const [currentPage, setCurrentPage] = useState(1); // State lưu trang hiện tại
    const [totalPages, setTotalPages] = useState(1);
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    const handleChangeSearchField = (event) => {
        setSearchField(event.target.value);
    };

    useEffect(() => {
        setIsLoadingProducts(true);

        const handleDebounced = setTimeout(() => {
            const getProducts = async () => {
                let url = `/api/product/all-products-admin?page=${currentPage}&perPage=${itemsPerPage}`;

                try {
                    let finalValue = searchValue;

                    if (searchField === 'price') finalValue = priceValue;
                    if (searchField === 'categoryId') finalValue = categoryValue;
                    if (searchField === 'subCategoryId') finalValue = subCategoryValue;
                    if (searchField === 'thirdSubCategoryId') finalValue = thirdSubCategoryValue;
                    if (searchField === 'countInStock') finalValue = countInStockValue;
                    if (searchField === 'rating') finalValue = ratingValue;
                    if (searchField === 'discount') finalValue = discountValue;
                    if (searchField === 'isFeatured') finalValue = isFeaturedValue;

                    setCurrentPage(1);

                    if (finalValue && searchField) {
                        url += `&field=${searchField}&value=${finalValue}`;
                    }

                    const { data } = await axiosClient.get(url);
                    console.log('products: ', data);
                    if (data.success) {
                        setProducts(data?.products);
                        setTotalPages(data?.totalPages);
                    }
                } catch (error) {
                    console.error('Lỗi API:', error);
                    return [];
                } finally {
                    setIsLoadingProducts(false);
                }
            };
            getProducts();
        }, 500);

        return () => {
            clearTimeout(handleDebounced);
        };
    }, [
        context?.isOpenFullScreenPanel,
        currentPage,
        searchValue,
        priceValue,
        categoryValue,
        subCategoryValue,
        thirdSubCategoryValue,
        countInStockValue,
        ratingValue,
        discountValue,
        isFeaturedValue,
    ]);

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            products.map((product) => ({
                'Hình ảnh': product.images.length > 0 ? product.images[0] : 'Không có hình ảnh',
                'Tên sản phẩm': product?.name,
                Giá: product?.price ? product?.price + 'VND' : '0 VND',
                'Giá cũ': product?.oldPrice ? product?.oldPrice + 'VND' : '0 VND',
                'ID danh mục': product?.categoryId,
                'Tên danh mục': product?.categoryName,
                'ID danh mục con cấp 2': product?.subCategoryId,
                'Tên danh mục con cấp 2': product?.subCategoryName,
                'ID danh mục con cấp 3': product?.thirdSubCategoryId,
                'Tên danh mục con cấp 3': product?.thirdSubCategoryName,
                'Số lượng trong kho': product?.countInStock,
                'Sản phẩm đặc trưng': product?.isFeatured === true ? 'Có' : 'Không',
                'Trạng thái công khai': product?.isPublished === true ? 'Có' : 'Không',
                'Giảm giá': product?.discount ? product?.discount + '%' : '0%',
                'RAM sản phẩm': product?.productRam,
                'Kích cỡ': product?.productSize,
                'Cân nặng': product?.productWeight,
            }))
        );

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sản phẩm');

        // Xuất file Excel
        XLSX.writeFile(wb, 'SanPham.xlsx');
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts((prevSelectedProducts) => {
            let updatedSelectedProducts;

            if (prevSelectedProducts.includes(productId)) {
                // Nếu đã chọn thì bỏ chọn
                updatedSelectedProducts = prevSelectedProducts.filter((id) => id !== productId);
            } else {
                // Nếu chưa chọn thì chọn
                updatedSelectedProducts = [...prevSelectedProducts, productId];
            }

            const allSelectedOnPage = products.every((product) => updatedSelectedProducts.includes(product._id));
            setIsCheckedAll(allSelectedOnPage);

            return updatedSelectedProducts;
        });
    };

    const handleSelectAll = () => {
        const currentPageIds = products.map((product) => product._id);
        if (!isCheckedAll) {
            // Thêm các sản phẩm ở trang hiện tại
            const newSelected = Array.from(new Set([...selectedProducts, ...currentPageIds]));
            setSelectedProducts(newSelected);
            setIsCheckedAll(true);
        } else {
            // Bỏ các sản phẩm ở trang hiện tại
            const newSelected = selectedProducts.filter((id) => !currentPageIds.includes(id));
            setSelectedProducts(newSelected);
            setIsCheckedAll(false);
        }
    };
    useEffect(() => {
        const allSelectedOnPage = products.every((product) => selectedProducts.includes(product._id));
        setIsCheckedAll(allSelectedOnPage);
    }, [products, selectedProducts]);

    useEffect(() => {
        setSelectedProducts(selectedProducts);
    }, [selectedProducts]);

    const handleClickOpen = (id) => {
        setOpen(true);
        setProductId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseMultiple = () => {
        setOpenMultiple(false);
    };

    const selectCategoryByName = (name) => {
        setFormFields((prev) => ({
            ...prev,
            categoryName: name,
        }));
    };
    // const handleChangeProductCategory = async (event) => {
    //     setProductCategory(event.target.value);
    //     setProductSubCategory('');
    //     setProductThirdSubCategory('');
    //     setIsLoadingProducts(true);
    //     const { data } = await axiosClient.get(`/api/product/all-products-category-id/${event.target.value}`);
    //     if (data?.success) {
    //         setProducts(data?.products);
    //         setTimeout(() => {
    //             setIsLoadingProducts(false);
    //         }, 300);
    //     }
    // };

    // const handleChangeProductSubCategory = async (event) => {
    //     setProductSubCategory(event.target.value);
    //     setProductCategory('');
    //     setProductThirdSubCategory('');
    //     setIsLoadingProducts(true);
    //     const { data } = await axiosClient.get(`/api/product/all-products-sub-category-id/${event.target.value}`);
    //     if (data?.success) {
    //         setProducts(data?.products);
    //         setTimeout(() => {
    //             setIsLoadingProducts(false);
    //         }, 300);
    //     }
    // };
    const selectSubCategoryByName = (name) => {
        setFormFields((prev) => ({
            ...prev,
            subCategoryName: name,
        }));
    };

    // const handleChangeProductThirdSubCategory = async (event) => {
    //     setProductThirdSubCategory(event.target.value);
    //     setProductCategory('');
    //     setProductSubCategory('');
    //     setIsLoadingProducts(true);
    //     const { data } = await axiosClient.get(`/api/product/all-products-third-sub-category-id/${event.target.value}`);
    //     if (data?.success) {
    //         setProducts(data?.products);
    //         setTimeout(() => {
    //             setIsLoadingProducts(false);
    //         }, 300);
    //     }
    // };
    const selectThirdSubCategoryByName = (name) => {
        setFormFields((prev) => ({
            ...prev,
            thirdSubCategoryName: name,
        }));
    };

    const handleDeleteMultipleProduct = async () => {
        setIsLoadingMultiple(true);

        try {
            const { data } = await axiosClient.delete(`/api/product/deleteMultipleProduct`, {
                data: { ids: selectedProducts },
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                context.getProducts();
                handleCloseMultiple();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoadingMultiple(false);
        }
    };

    const handleDeleteProduct = async () => {
        setIsLoadingDeleteProduct(true);
        try {
            const { data } = await axiosClient.delete(`/api/product/${productId}`);
            if (data.success) {
                context.openAlertBox('success', data.message);
                context.getProducts();
                handleClose();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoadingDeleteProduct(false);
        }
    };

    const getStockLabelByQuantity = (countInStock) => {
        if (countInStock < 1) return 'Hết hàng';
        if (countInStock >= 1) return 'Còn hàng';
        return 'Sắp có hàng'; // nếu countInStock là null, undefined, hoặc lỗi
    };

    const getProductStatusBackgroundByStock = (countInStock) => {
        if (countInStock < 1) return 'outOfStock';
        if (countInStock >= 1) return 'active';

        return 'commingSoon'; // hoặc trạng thái mặc định
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
                    {products?.length > 1 && (isCheckedAll || selectedProducts.length > 1) && (
                        <Button
                            onClick={() => setOpenMultiple(true)}
                            className="btn !bg-red-500 !text-white !normal-case gap-1"
                        >
                            <BiExport />
                            Xoá tất cả
                        </Button>
                    )}
                    <Button onClick={handleExportExcel} className="btn !bg-green-500 !text-white !normal-case gap-1">
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
                {/* <div className="flex items-center w-full justify-between px-5 gap-4">
                    <div className="col w-[15%]">
                        <h4 className="font-[600] text-[13px] mb-2">Danh mục cha</h4>

                        {context?.categories?.length !== 0 && (
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                style={{ zoom: '80%' }}
                                labelId="demo-simple-select-label"
                                id="productCategoryDrop"
                                size="small"
                                className="w-full"
                                value={productCategory}
                                label="Danh mục"
                                onChange={handleChangeProductCategory}
                            >
                                {context?.categories?.map((cat) => {
                                    return (
                                        <MenuItem value={cat?._id} onClick={() => selectCategoryByName(cat?.name)}>
                                            {cat?.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        )}
                    </div>

                    <div className="col w-[15%]">
                        <h4 className="font-[600] text-[13px] mb-2">Danh mục con cấp 2</h4>

                        {context?.categories?.length !== 0 && (
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                style={{ zoom: '80%' }}
                                labelId="demo-simple-select-label"
                                id="productSubCategoryDrop"
                                size="small"
                                className="w-full"
                                value={productSubCategory}
                                label="Danh mục con cấp 2"
                                onChange={handleChangeProductSubCategory}
                            >
                                {context?.categories?.map((cat) => {
                                    return (
                                        cat?.children?.length !== 0 &&
                                        cat?.children.map((subCat) => {
                                            return (
                                                <MenuItem
                                                    value={subCat?._id}
                                                    onClick={() => selectSubCategoryByName(subCat?.name)}
                                                >
                                                    {subCat?.name}
                                                </MenuItem>
                                            );
                                        })
                                    );
                                })}
                            </Select>
                        )}
                    </div>
                    <div className="col w-[15%]">
                        <h4 className="font-[600] text-[13px] mb-2">Danh mục con cấp 3</h4>

                        {context?.categories?.length !== 0 && (
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                style={{ zoom: '80%' }}
                                labelId="demo-simple-select-label"
                                id="productThirdCategoryDrop"
                                size="small"
                                className="w-full"
                                value={productThirdSubCategory}
                                label="Danh mục con cấp 3"
                                onChange={handleChangeProductThirdSubCategory}
                            >
                                {context?.categories?.map((cat) => {
                                    return (
                                        cat?.children?.length !== 0 &&
                                        cat?.children.map((subCat) => {
                                            return (
                                                subCat?.children?.length !== 0 &&
                                                subCat?.children?.map((thirdCat) => {
                                                    return (
                                                        <MenuItem
                                                            value={thirdCat?._id}
                                                            onClick={() => selectThirdSubCategoryByName(thirdCat?.name)}
                                                        >
                                                            {thirdCat?.name}
                                                        </MenuItem>
                                                    );
                                                })
                                            );
                                        })
                                    );
                                })}
                            </Select>
                        )}
                    </div>
                </div> */}

                <div className="flex items-center w-full justify-between px-5 gap-4">
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
                                <MenuItem value="name">Tên sản phẩm</MenuItem>
                                <MenuItem value="categoryId">Danh mục</MenuItem>
                                <MenuItem value="subCategoryId">Danh mục con cấp 2</MenuItem>
                                <MenuItem value="thirdSubCategoryId">Danh mục con cấp 3</MenuItem>
                                <MenuItem value="price">Giá</MenuItem>
                                <MenuItem value="countInStock">Số lượng tồn kho</MenuItem>
                                <MenuItem value="rating">Đánh giá</MenuItem>
                                <MenuItem value="discount">Giảm giá</MenuItem>
                                <MenuItem value="isFeatured">Sản phẩm đặc trưng</MenuItem>
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
                    {/* CategoryId */}
                    {searchField === 'categoryId' && (
                        <div className="col w-[68%] mt-[18px]">
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                sx={{ height: '42px', marginTop: '10px' }}
                                size="small"
                                className="w-full !h-[42px]"
                                label="Danh mục"
                                value={categoryValue}
                                onChange={(e) => setCategoryValue(e.target.value)}
                            >
                                {context?.categories?.map((cat) => {
                                    return (
                                        <MenuItem value={cat?._id} onClick={() => selectCategoryByName(cat?.name)}>
                                            {cat?.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </div>
                    )}
                    {/* SubCategoryId */}
                    {searchField === 'subCategoryId' && (
                        <div className="col w-[68%] mt-[18px]">
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                sx={{ height: '42px', marginTop: '10px' }}
                                size="small"
                                className="w-full !h-[42px]"
                                label="Danh mục con cấp 2"
                                value={subCategoryValue}
                                onChange={(e) => setSubCategoryValue(e.target.value)}
                            >
                                {context?.categories?.map((cat) => {
                                    return (
                                        cat?.children?.length !== 0 &&
                                        cat?.children.map((subCat) => {
                                            return (
                                                <MenuItem
                                                    value={subCat?._id}
                                                    onClick={() => selectSubCategoryByName(subCat?.name)}
                                                >
                                                    {subCat?.name}
                                                </MenuItem>
                                            );
                                        })
                                    );
                                })}
                            </Select>
                        </div>
                    )}
                    {/* Third Sub Category ID */}
                    {searchField === 'thirdSubCategoryId' && (
                        <div className="col w-[68%] mt-[18px]">
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                sx={{ height: '42px', marginTop: '10px' }}
                                size="small"
                                className="w-full !h-[42px]"
                                label="Danh mục con cấp 2"
                                value={thirdSubCategoryValue}
                                onChange={(e) => setThirdSubCategoryValue(e.target.value)}
                            >
                                {context?.categories?.map((cat) => {
                                    return (
                                        cat?.children?.length !== 0 &&
                                        cat?.children.map((subCat) => {
                                            return (
                                                subCat?.children?.length !== 0 &&
                                                subCat?.children?.map((thirdCat) => {
                                                    return (
                                                        <MenuItem
                                                            value={thirdCat?._id}
                                                            onClick={() => selectThirdSubCategoryByName(thirdCat?.name)}
                                                        >
                                                            {thirdCat?.name}
                                                        </MenuItem>
                                                    );
                                                })
                                            );
                                        })
                                    );
                                })}
                            </Select>
                        </div>
                    )}

                    {/* Price */}
                    {searchField === 'price' && (
                        <div className="col w-[68%] mt-[18px]">
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                sx={{ height: '42px', marginTop: '10px' }}
                                size="small"
                                className="w-full !h-[42px]"
                                value={priceValue}
                                onChange={(e) => setPriceValue(e.target.value)}
                            >
                                <MenuItem value="<200">Dưới 200.000đ</MenuItem>
                                <MenuItem value="200-500">Từ 200.000đ - 500.000đ</MenuItem>
                                <MenuItem value="500-1000">Từ 500.000đ - 1.000.000đ</MenuItem>
                                <MenuItem value="1000-5000">Từ 1.000.000đ - 5.000.000đ</MenuItem>
                                <MenuItem value=">5000">Trên 5.000.000đ</MenuItem>
                            </Select>
                        </div>
                    )}
                    {/* Count in stock */}
                    {searchField === 'countInStock' && (
                        <div className="col w-[68%] mt-[18px]">
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                sx={{ height: '42px', marginTop: '10px' }}
                                size="small"
                                className="w-full !h-[42px]"
                                value={countInStockValue}
                                onChange={(e) => setCountInStockValue(e.target.value)}
                            >
                                <MenuItem sx={{ fontWeight: 400, color: '#ef4444' }} value="0">
                                    Hết hàng (0)
                                </MenuItem>
                                <MenuItem value="1-100">Từ 1 - 100</MenuItem>
                                <MenuItem value="100-500">Từ 100 - 500</MenuItem>
                                <MenuItem value="500-1000">Từ 500 - 1000</MenuItem>
                                <MenuItem value=">1000">Trên 1000</MenuItem>
                            </Select>
                        </div>
                    )}
                    {/* Rating */}
                    {searchField === 'rating' && (
                        <div className="col w-[68%] mt-[18px]">
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                sx={{ height: '42px', marginTop: '10px' }}
                                size="small"
                                className="w-full !h-[42px]"
                                value={ratingValue}
                                onChange={(e) => setRatingValue(e.target.value)}
                            >
                                <MenuItem value={5}>
                                    <Rating name="size-small" value={5} readOnly size="small" />
                                </MenuItem>
                                <MenuItem value={4}>
                                    <Rating name="size-small" value={4} readOnly size="small" />
                                </MenuItem>
                                <MenuItem value={3}>
                                    <Rating name="size-small" value={3} readOnly size="small" />
                                </MenuItem>
                                <MenuItem value={2}>
                                    <Rating name="size-small" value={2} readOnly size="small" />
                                </MenuItem>
                                <MenuItem value={1}>
                                    <Rating name="size-small" value={1} readOnly size="small" />
                                </MenuItem>
                            </Select>
                        </div>
                    )}
                    {/* Discount */}
                    {searchField === 'discount' && (
                        <div className="col w-[68%] mt-[18px]">
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                sx={{ height: '42px', marginTop: '10px' }}
                                size="small"
                                className="w-full !h-[42px]"
                                value={discountValue}
                                onChange={(e) => setDiscountValue(e.target.value)}
                            >
                                <MenuItem value="<2%">Dưới 2%</MenuItem>
                                <MenuItem value="2%-5%">Từ 2% - 5%</MenuItem>
                                <MenuItem value="5%-10%">Từ 5% - 10%</MenuItem>
                                <MenuItem value="10%-20%">Từ 10% - 20%</MenuItem>
                                <MenuItem value=">20%">Trên 20%</MenuItem>
                            </Select>
                        </div>
                    )}

                    {/* isFeatured */}
                    {searchField === 'isFeatured' && (
                        <div className="col w-[68%] mt-[18px]">
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                sx={{ height: '42px', marginTop: '10px' }}
                                size="small"
                                className="w-full !h-[42px]"
                                value={isFeaturedValue}
                                onChange={(e) => setIsFeaturedValue(e.target.value)}
                            >
                                <MenuItem sx={{ fontWeight: 400, color: '#22c55e' }} value="true">
                                    Đặc trưng
                                </MenuItem>
                                <MenuItem sx={{ fontWeight: 400, color: '#ef4444' }} value="false">
                                    Không đặc trưng
                                </MenuItem>
                            </Select>
                        </div>
                    )}
                </div>

                <br />

                <div className="relative overflow-x-auto mt-1 pb-5">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                        {!isLoadingProducts && products?.length > 0 && (
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
                        )}

                        <tbody>
                            {isLoadingProducts ? (
                                <tr>
                                    <td colSpan={999}>
                                        <div className="flex items-center justify-center w-full min-h-[400px]">
                                            <CircularProgress color="inherit" />
                                        </div>
                                    </td>
                                </tr>
                            ) : products?.length > 0 ? (
                                products?.map((product) => {
                                    return (
                                        <tr key={product._id} className="odd:bg-white  even:bg-gray-50 border-b">
                                            <td className="px-6 pr-0 py-2">
                                                <div className="w-[60px]">
                                                    <Checkbox
                                                        {...label}
                                                        checked={selectedProducts.includes(product._id)}
                                                        onChange={() => handleSelectProduct(product._id)}
                                                        size="small"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-0 py-2">
                                                <div className="flex items-center gap-4 w-[330px]">
                                                    <div className="img w-[65px] h-[65px] rounded-md overflow-hidden group">
                                                        <Link to={`/product/${product?._id}`}>
                                                            <img
                                                                src={product?.images[0]}
                                                                className="w-full group-hover:scale-105 transition-all"
                                                                alt=""
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div className="info w-[75%]">
                                                        <h3 className="text-[12px] font-[600] leading-4 hover:text-primary transition-all">
                                                            <Link to={`/product/${product?._id}`}>{product?.name}</Link>
                                                        </h3>
                                                        <span className="text-[12px]">{product?.brand}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[80px]">{product?.categoryName}</p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="w-[80px]">{product?.subCategoryName}</p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className="flex gap-1 flex-col">
                                                    <span className="oldPrice line-through leading-3 text-gray-500 text-[14px] font-[500]">
                                                        {formatCurrency(product?.oldPrice)}
                                                    </span>
                                                    <span className="price text-primary text-[14px] font-[600]">
                                                        {formatCurrency(product?.price)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="text-[14px] w-[130px]">
                                                    <span className="font-[600]">
                                                        {getStockLabelByQuantity(product?.countInStock || 0)}{' '}
                                                    </span>
                                                    ({product?.countInStock || 0})
                                                </p>
                                                <ProgressProductStatusComponent
                                                    value={product?.countInStock}
                                                    status={getProductStatusBackgroundByStock(
                                                        product?.countInStock || 0
                                                    )}
                                                />
                                            </td>
                                            <td className="px-6 py-2">
                                                <Rating
                                                    name="size-small"
                                                    value={Number(product?.rating) || 0}
                                                    readOnly
                                                    size="small"
                                                />
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className="flex items-center gap-1">
                                                    <Tooltip title="Xem chi tiết" placement="top">
                                                        <Link to={`/product/${product?._id}`}>
                                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                                <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                            </Button>
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip
                                                        title="Chỉnh sửa"
                                                        placement="top"
                                                        onClick={() =>
                                                            context.setIsOpenFullScreenPanel({
                                                                open: true,
                                                                model: 'Cập nhật sản phẩm',
                                                                id: product?._id,
                                                            })
                                                        }
                                                    >
                                                        <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                            <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                                                        </Button>
                                                    </Tooltip>

                                                    <Tooltip title="Xoá" placement="top">
                                                        <Button
                                                            onClick={() => handleClickOpen(product._id)}
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
                                            <span className="text-gray-500">Chưa có sản phẩm</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoadingProducts && products?.length > 0 && (
                    <div className="flex items-center justify-center pt-5 pb-5 px-4">
                        <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} color="primary" />
                    </div>
                )}
            </div>

            {products?.length > 0 && (
                <Dialog
                    disableScrollLock
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'Xoá sản phẩm?'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Bạn có chắc chắn xoá sản phẩm này không?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Huỷ</Button>
                        {isLoadingDeleteProduct === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <Button className="btn-red" onClick={handleDeleteProduct} autoFocus>
                                Xác nhận
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            )}

            {products?.length > 0 && (
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
                            <Button className="btn-red" onClick={handleDeleteMultipleProduct} autoFocus>
                                Xác nhận
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default ProductPage;
