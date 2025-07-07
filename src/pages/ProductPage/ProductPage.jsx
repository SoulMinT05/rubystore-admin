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

    const [productCategory, setProductCategory] = useState('');
    const [productSubCategory, setProductSubCategory] = useState('');
    const [productThirdSubCategory, setProductThirdSubCategory] = useState('');

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

    const itemsPerPage = 10;
    // State lưu trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    // Tính tổng số trang
    const totalPages = Math.ceil(products.length / itemsPerPage);
    // Xử lý khi đổi trang
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };
    // Cắt dữ liệu theo trang
    const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

            const allSelectedOnPage = currentProducts.every((product) => updatedSelectedProducts.includes(product._id));
            setIsCheckedAll(allSelectedOnPage);

            return updatedSelectedProducts;
        });
    };

    const handleSelectAll = () => {
        const currentPageIds = currentProducts.map((product) => product._id);
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
        const allSelectedOnPage = currentProducts.every((product) => selectedProducts.includes(product._id));
        setIsCheckedAll(allSelectedOnPage);
    }, [currentProducts, selectedProducts]);

    useEffect(() => {
        setSelectedProducts(selectedProducts);
    }, [selectedProducts]);

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
    const handleChangeProductCategory = async (event) => {
        setProductCategory(event.target.value);
        setProductSubCategory('');
        setProductThirdSubCategory('');
        setIsLoadingProducts(true);
        const { data } = await axiosClient.get(`/api/product/all-products-category-id/${event.target.value}`);
        if (data?.success) {
            setProducts(data?.products);
            setTimeout(() => {
                setIsLoadingProducts(false);
            }, 300);
        }
    };

    const handleChangeProductSubCategory = async (event) => {
        setProductSubCategory(event.target.value);
        setProductCategory('');
        setProductThirdSubCategory('');
        setIsLoadingProducts(true);
        const { data } = await axiosClient.get(`/api/product/all-products-sub-category-id/${event.target.value}`);
        if (data?.success) {
            setProducts(data?.products);
            setTimeout(() => {
                setIsLoadingProducts(false);
            }, 300);
        }
    };
    const selectSubCategoryByName = (name) => {
        setFormFields((prev) => ({
            ...prev,
            subCategoryName: name,
        }));
    };

    const handleChangeProductThirdSubCategory = async (event) => {
        setProductThirdSubCategory(event.target.value);
        setProductCategory('');
        setProductSubCategory('');
        setIsLoadingProducts(true);
        const { data } = await axiosClient.get(`/api/product/all-products-third-sub-category-id/${event.target.value}`);
        if (data?.success) {
            setProducts(data?.products);
            setTimeout(() => {
                setIsLoadingProducts(false);
            }, 300);
        }
    };
    const selectThirdSubCategoryByName = (name) => {
        setFormFields((prev) => ({
            ...prev,
            thirdSubCategoryName: name,
        }));
    };

    useEffect(() => {
        const getProducts = async () => {
            try {
                setIsLoadingProducts(true);
                const { data } = await axiosClient.get('/api/product/all-products-admin');
                if (data.success) {
                    setTimeout(() => {
                        setProducts(data?.products);
                    }, 100);
                    setIsLoadingProducts(false);
                } else {
                    console.error('Lỗi lấy danh mục:', data.message);
                }
            } catch (error) {
                console.error('Lỗi API:', error);
                return [];
            }
        };
        getProducts();
    }, [context?.isOpenFullScreenPanel]);

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
                    {(isCheckedAll || selectedProducts.length > 1) && (
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
                <div className="flex items-center w-full justify-between px-5 gap-4">
                    <div className="col w-[15%]">
                        <h4 className="font-[600] text-[13px] mb-2">Danh mục cha</h4>

                        {context?.categories?.length !== 0 && (
                            <Select
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

                    <div className="col w-[20%] ml-auto">
                        <SearchBoxComponent />
                    </div>
                </div>

                <br />

                <div className="relative overflow-x-auto mt-1 pb-5">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                        {!isLoadingProducts && currentProducts?.length > 0 && (
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
                            {isLoadingProducts === false ? (
                                currentProducts?.length > 0 &&
                                currentProducts?.map((product) => {
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
                                                    defaultValue={product?.rating}
                                                    readOnly
                                                    size="small"
                                                />
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className="flex items-center gap-1">
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
                                                    <Tooltip title="Xem chi tiết" placement="top">
                                                        <Link to={`/product/${product?._id}`}>
                                                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]">
                                                                <FaRegEye className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                            </Button>
                                                        </Link>
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
                                            <CircularProgress color="inherit" />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoadingProducts && currentProducts?.length > 0 && (
                    <div className="flex items-center justify-center pt-5 pb-5 px-4">
                        <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} color="primary" />
                    </div>
                )}
            </div>

            <Dialog
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
        </>
    );
};

export default ProductPage;
