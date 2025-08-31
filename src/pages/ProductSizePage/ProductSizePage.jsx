import React, { useContext, useEffect, useState } from 'react';
import './ProductSizePage.scss';
import {
    Button,
    CircularProgress,
    Checkbox,
    Dialog,
    Tooltip,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
} from '@mui/material';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { AiOutlineEdit } from 'react-icons/ai';
import { GoTrash } from 'react-icons/go';
import { MyContext } from '../../App';
import axiosClient from '../../apis/axiosClient';

const ProductSizePage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProductsSize, setIsLoadingProductsSize] = useState(false);
    const [isLoadingDeleteProductsSize, setIsLoadingDeleteProductsSize] = useState(false);

    const [formFields, setFormFields] = useState({
        name: '',
    });
    const [open, setOpen] = useState(false);
    const [openMultiple, setOpenMultiple] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [isLoadingMultiple, setIsLoadingMultiple] = useState(false);
    const [productSizeId, setProductSizeId] = useState(null);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [productsSize, setProductsSize] = useState([]);
    const [selectedProductsSize, setSelectedProductsSize] = useState([]);

    const context = useContext(MyContext);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const handleClickOpenUpdate = (id) => {
        const selected = productsSize.find((item) => item._id === id);
        if (!selected) return;

        setProductSizeId(id);
        setFormFields({ name: selected.name }); // gán name trước
        setOpenUpdate(true); // mở dialog sau
    };

    const handleCloseUpdate = () => {
        setOpenUpdate(false);
    };

    const getProductsSize = async () => {
        try {
            setIsLoadingProductsSize(true);
            const { data } = await axiosClient.get('/api/product/all-products-size');
            if (data.success) {
                setTimeout(() => {
                    setProductsSize(data?.productsSize);
                }, 100);
                setIsLoadingProductsSize(false);
            } else {
                console.error('Lỗi lấy Size sản phẩm:', data.message);
            }
        } catch (error) {
            console.error('Lỗi API:', error);
            return [];
        }
    };
    useEffect(() => {
        getProductsSize();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFields(() => {
            return {
                ...formFields,
                [name]: value,
            };
        });
    };

    const handleSelectProductSize = (productSizeId) => {
        setSelectedProductsSize((prevSelectedProductsSize) => {
            let updatedSelectedProductsSize;

            if (prevSelectedProductsSize.includes(productSizeId)) {
                // Nếu đã chọn thì bỏ chọn
                updatedSelectedProductsSize = prevSelectedProductsSize.filter((id) => id !== productSizeId);
            } else {
                // Nếu chưa chọn thì chọn
                updatedSelectedProductsSize = [...prevSelectedProductsSize, productSizeId];
            }

            const allSelectedOnPage = productsSize.every((product) =>
                updatedSelectedProductsSize.includes(product._id)
            );
            setIsCheckedAll(allSelectedOnPage);

            return updatedSelectedProductsSize;
        });
    };

    const handleSelectAll = () => {
        const currentPageIds = productsSize.map((product) => product._id);
        if (!isCheckedAll) {
            // Thêm các sản phẩm ở trang hiện tại
            const newSelected = Array.from(new Set([...selectedProductsSize, ...currentPageIds]));
            setSelectedProductsSize(newSelected);
            setIsCheckedAll(true);
        } else {
            // Bỏ các sản phẩm ở trang hiện tại
            const newSelected = selectedProductsSize.filter((id) => !currentPageIds.includes(id));
            setSelectedProductsSize(newSelected);
            setIsCheckedAll(false);
        }
    };
    useEffect(() => {
        const allSelectedOnPage = productsSize.every((product) => selectedProductsSize.includes(product._id));
        setIsCheckedAll(allSelectedOnPage);
    }, [productsSize, selectedProductsSize]);

    useEffect(() => {
        setSelectedProductsSize(selectedProductsSize);
    }, [selectedProductsSize]);

    const handleDeleteMultipleProduct = async () => {
        setIsLoadingMultiple(true);

        try {
            const { data } = await axiosClient.delete(`/api/product/size/deleteMultipleProductSize`, {
                data: { ids: selectedProductsSize },
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                getProductsSize();
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
        setProductSizeId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseMultiple = () => {
        setOpenMultiple(false);
    };

    const handleAddProductSize = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (formFields.name === '') {
                context.openAlertBox('error', 'Cần nhập Size sản phẩm');
                setIsLoading(false);
                return;
            }
            const { data } = await axiosClient.post('/api/product/create-size', formFields);
            if (data.success) {
                context.openAlertBox('success', data.message);
                getProductsSize();
                setFormFields({
                    name: '',
                });
            }
        } catch (error) {
            console.log(error);
            context.openAlertBox('error', error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProductSize = async () => {
        if (!formFields.name.trim()) {
            context.openAlertBox('error', 'Tên Size không được để trống!');
            return;
        }

        try {
            const { data } = await axiosClient.put(`/api/product/update-product-size/${productSizeId}`, {
                name: formFields.name.trim(),
            });

            if (data.success) {
                context.openAlertBox('success', 'Cập nhật Size thành công!');
                setFormFields({ name: '' });
                setProductSizeId(null);
                getProductsSize();
            } else {
                context.openAlertBox('error', data.message);
            }
        } catch (error) {
            console.error(error);
            context.openAlertBox('error', 'Lỗi khi cập nhật Size!');
        }
    };

    const handleDeleteProductSize = async (e) => {
        e.preventDefault();
        setIsLoadingDeleteProductsSize(true);
        try {
            const { data } = await axiosClient.delete(`/api/product/size/${productSizeId}`);
            if (data.success) {
                context.openAlertBox('success', data.message);
                getProductsSize();
                handleClose();
            }
        } catch (error) {
            console.log(error);
            context.openAlertBox('error', error.response.data.message);
        } finally {
            setIsLoadingDeleteProductsSize(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0 mt-3">
                <h2 className="text-[18px] font-[600]">Size sản phẩm</h2>
            </div>
            <div className="card my-4 pt-5 pb-5 shadow-md sm:rounded-lg bg-white">
                <form
                    className="form p-6 py-3"
                    onSubmit={productSizeId ? handleUpdateProductSize : handleAddProductSize}
                >
                    <div className="col">
                        <h3 className="text-[14px] font-[500] mb-1 text-black">Size sản phẩm</h3>
                        <input
                            name="name"
                            value={formFields.name}
                            disabled={isLoading === true ? true : false}
                            onChange={handleChange}
                            type="text"
                            className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                        />
                    </div>
                    <br />
                    <Button type="submit" className="btn-blue w-full !normal-case flex gap-2 mb-4">
                        {isLoading === true ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-[25px] text-white" />
                                <span className="text-[16px]">{productSizeId ? 'Cập nhật Size' : 'Thêm Size'}</span>
                            </>
                        )}
                    </Button>
                    {productSizeId && (
                        <Button
                            type="button"
                            className="bg-gray-400 text-white py-2 px-4 rounded"
                            onClick={() => {
                                setFormFields({ name: '' });
                                setProductSizeId(null);
                            }}
                        >
                            Huỷ
                        </Button>
                    )}
                </form>
            </div>

            <div className="card my-4 pt-5 pb-5 shadow-md sm:rounded-lg bg-white">
                <div className="relative overflow-x-auto">
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
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Size
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingProductsSize === false ? (
                                productsSize?.length > 0 &&
                                productsSize?.map((product) => (
                                    <tr key={product._id} className="odd:bg-white  even:bg-gray-50 border-b">
                                        <td className="px-6 pr-0 py-2">
                                            <div className="w-[60px]">
                                                <Checkbox
                                                    {...label}
                                                    checked={selectedProductsSize.includes(product._id)}
                                                    onChange={() => handleSelectProductSize(product._id)}
                                                    size="small"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-2">
                                            <p className="w-[80px]">{product?.name}</p>
                                        </td>
                                        <td className="px-6 py-2">
                                            <div className="flex items-center gap-1">
                                                <Tooltip
                                                    title="Chỉnh sửa"
                                                    placement="top"
                                                    onClick={() => handleClickOpenUpdate(product._id)}
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
                                ))
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
                {(isCheckedAll || selectedProductsSize.length > 1) && (
                    <div className="flex justify-center mt-8">
                        <Button
                            onClick={() => setOpenMultiple(true)}
                            className="btn !w-[95%] !bg-red-500 !text-white !normal-case gap-1"
                        >
                            Xoá tất cả
                        </Button>
                    </div>
                )}
            </div>

            <Dialog
                disableScrollLock
                open={openUpdate}
                onClose={handleCloseUpdate}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: async (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            const name = formJson.name;

                            if (!name) {
                                context.openAlertBox('error', 'Tên Size không được để trống!');
                                return;
                            }

                            try {
                                const { data } = await axiosClient.put(`/api/product/size/${productSizeId}`, {
                                    name,
                                });

                                if (data.success) {
                                    context.openAlertBox('success', 'Cập nhật Size thành công!');
                                    getProductsSize();
                                    setProductSizeId(null);
                                    setFormFields({ name: '' });
                                    handleCloseUpdate();
                                } else {
                                    context.openAlertBox('error', data.message);
                                }
                            } catch (error) {
                                console.error(error);
                                context.openAlertBox('error', 'Lỗi khi cập nhật Size!');
                            }
                            handleCloseUpdate();
                        },
                    },
                }}
            >
                <DialogTitle>Cập nhật Size sản phẩm</DialogTitle>
                <DialogContent>
                    <DialogContentText>Nhập tên Size muốn cập nhật</DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        type="name"
                        fullWidth
                        variant="standard"
                        value={formFields.name}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button className="!normal-case" onClick={handleCloseUpdate}>
                        Huỷ
                    </Button>
                    <Button className="!normal-case" type="submit">
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Xoá Size sản phẩm?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn xoá Size sản phẩm này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Huỷ</Button>
                    {isLoadingDeleteProductsSize === true ? (
                        <CircularProgress color="inherit" />
                    ) : (
                        <Button className="btn-red" onClick={handleDeleteProductSize} autoFocus>
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

export default ProductSizePage;
