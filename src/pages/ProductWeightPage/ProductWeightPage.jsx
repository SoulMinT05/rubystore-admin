import React, { useContext, useEffect, useState } from 'react';
import './ProductWeightPage.scss';
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

const ProductWeightPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProductsWeight, setIsLoadingProductsWeight] = useState(false);
    const [isLoadingDeleteProductsWeight, setIsLoadingDeleteProductsWeight] = useState(false);

    const [formFields, setFormFields] = useState({
        name: '',
    });
    const [open, setOpen] = useState(false);
    const [openMultiple, setOpenMultiple] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [isLoadingMultiple, setIsLoadingMultiple] = useState(false);
    const [productWeightId, setProductWeightId] = useState(null);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [productsWeight, setProductsWeight] = useState([]);
    const [selectedProductsWeight, setSelectedProductsWeight] = useState([]);

    const context = useContext(MyContext);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const handleClickOpenUpdate = (id) => {
        const selected = productsWeight.find((item) => item._id === id);
        if (!selected) return;

        setProductWeightId(id);
        setFormFields({ name: selected.name }); // gán name trước
        setOpenUpdate(true); // mở dialog sau
    };

    const handleCloseUpdate = () => {
        setOpenUpdate(false);
    };

    const getProductsWeight = async () => {
        try {
            setIsLoadingProductsWeight(true);
            const { data } = await axiosClient.get('/api/product/all-products-weight');
            if (data.success) {
                setTimeout(() => {
                    setProductsWeight(data?.productsWeight);
                }, 100);
                setIsLoadingProductsWeight(false);
            } else {
                console.error('Lỗi lấy weight sản phẩm:', data.message);
            }
        } catch (error) {
            console.error('Lỗi API:', error);
            return [];
        }
    };
    useEffect(() => {
        getProductsWeight();
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

    const handleSelectProductWeight = (productWeightId) => {
        setSelectedProductsWeight((prevSelectedProductsWeight) => {
            let updatedSelectedProductsWeight;

            if (prevSelectedProductsWeight.includes(productWeightId)) {
                // Nếu đã chọn thì bỏ chọn
                updatedSelectedProductsWeight = prevSelectedProductsWeight.filter((id) => id !== productWeightId);
            } else {
                // Nếu chưa chọn thì chọn
                updatedSelectedProductsWeight = [...prevSelectedProductsWeight, productWeightId];
            }

            const allSelectedOnPage = productsWeight.every((product) =>
                updatedSelectedProductsWeight.includes(product._id)
            );
            setIsCheckedAll(allSelectedOnPage);

            return updatedSelectedProductsWeight;
        });
    };

    const handleSelectAll = () => {
        const currentPageIds = productsWeight.map((product) => product._id);
        if (!isCheckedAll) {
            // Thêm các sản phẩm ở trang hiện tại
            const newSelected = Array.from(new Set([...selectedProductsWeight, ...currentPageIds]));
            setSelectedProductsWeight(newSelected);
            setIsCheckedAll(true);
        } else {
            // Bỏ các sản phẩm ở trang hiện tại
            const newSelected = selectedProductsWeight.filter((id) => !currentPageIds.includes(id));
            setSelectedProductsWeight(newSelected);
            setIsCheckedAll(false);
        }
    };
    useEffect(() => {
        const allSelectedOnPage = productsWeight.every((product) => selectedProductsWeight.includes(product._id));
        setIsCheckedAll(allSelectedOnPage);
    }, [productsWeight, selectedProductsWeight]);

    useEffect(() => {
        setSelectedProductsWeight(selectedProductsWeight);
    }, [selectedProductsWeight]);

    const handleDeleteMultipleProduct = async () => {
        setIsLoadingMultiple(true);

        try {
            const { data } = await axiosClient.delete(`/api/product/weight/deleteMultipleProductWeight`, {
                data: { ids: selectedProductsWeight },
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                getProductsWeight();
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
        setProductWeightId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseMultiple = () => {
        setOpenMultiple(false);
    };

    const handleAddProductWeight = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (formFields.name === '') {
                context.openAlertBox('error', 'Cần nhập cân nặng sản phẩm');
                setIsLoading(false);
                return;
            }
            const { data } = await axiosClient.post('/api/product/create-weight', formFields);
            if (data.success) {
                context.openAlertBox('success', data.message);
                getProductsWeight();
            }
        } catch (error) {
            console.log(error);
            context.openAlertBox('error', error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProductWeight = async () => {
        if (!formFields.name.trim()) {
            context.openAlertBox('error', 'Cân nặng không được để trống!');
            return;
        }

        try {
            const { data } = await axiosClient.put(`/api/product/update-product-weight/${productWeightId}`, {
                name: formFields.name.trim(),
            });

            if (data.success) {
                context.openAlertBox('success', 'Cập nhật cân nặng thành công!');
                setFormFields({ name: '' });
                setProductWeightId(null);
                getProductsWeight();
            } else {
                context.openAlertBox('error', data.message);
            }
        } catch (error) {
            console.error(error);
            context.openAlertBox('error', 'Lỗi khi cập nhật cân nặng!');
        }
    };

    const handleDeleteProductWeight = async (e) => {
        e.preventDefault();
        setIsLoadingDeleteProductsWeight(true);
        try {
            const { data } = await axiosClient.delete(`/api/product/weight/${productWeightId}`);
            if (data.success) {
                context.openAlertBox('success', data.message);
                getProductsWeight();
                handleClose();
            }
        } catch (error) {
            console.log(error);
            context.openAlertBox('error', error.response.data.message);
        } finally {
            setIsLoadingDeleteProductsWeight(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0 mt-3">
                <h2 className="text-[18px] font-[600]">Cân nặng sản phẩm</h2>
            </div>
            <div className="card my-4 pt-5 pb-5 shadow-md sm:rounded-lg bg-white">
                <form
                    className="form p-6 py-3"
                    onSubmit={productWeightId ? handleUpdateProductWeight : handleAddProductWeight}
                >
                    <div className="col">
                        <h3 className="text-[14px] font-[500] mb-1 text-black">Cân nặng sản phẩm</h3>
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
                                <span className="text-[16px]">
                                    {productWeightId ? 'Cập nhật cân nặng' : 'Thêm cân nặng'}
                                </span>
                            </>
                        )}
                    </Button>
                    {productWeightId && (
                        <Button
                            type="button"
                            className="bg-gray-400 text-white py-2 px-4 rounded"
                            onClick={() => {
                                setFormFields({ name: '' });
                                setProductWeightId(null);
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
                                    Cân nặng
                                </th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingProductsWeight === false ? (
                                productsWeight?.length > 0 &&
                                productsWeight?.map((product) => (
                                    <tr key={product._id} className="odd:bg-white  even:bg-gray-50 border-b">
                                        <td className="px-6 pr-0 py-2">
                                            <div className="w-[60px]">
                                                <Checkbox
                                                    {...label}
                                                    checked={selectedProductsWeight.includes(product._id)}
                                                    onChange={() => handleSelectProductWeight(product._id)}
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
                {(isCheckedAll || selectedProductsWeight.length > 1) && (
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
                                context.openAlertBox('error', 'Tên cân nặng không được để trống!');
                                return;
                            }

                            try {
                                const { data } = await axiosClient.put(`/api/product/weight/${productWeightId}`, {
                                    name,
                                });

                                if (data.success) {
                                    context.openAlertBox('success', 'Cập nhật cân nặng thành công!');
                                    getProductsWeight();
                                    setProductWeightId(null);
                                    setFormFields({ name: '' });
                                    handleCloseUpdate();
                                } else {
                                    context.openAlertBox('error', data.message);
                                }
                            } catch (error) {
                                console.error(error);
                                context.openAlertBox('error', 'Lỗi khi cập nhật cân nặng!');
                            }
                            handleCloseUpdate();
                        },
                    },
                }}
            >
                <DialogTitle>Cập nhật cân nặng sản phẩm</DialogTitle>
                <DialogContent>
                    <DialogContentText>Nhập tên cân nặng muốn cập nhật</DialogContentText>
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
                <DialogTitle id="alert-dialog-title">{'Xoá cân nặng sản phẩm?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn xoá cân nặng sản phẩm này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Huỷ</Button>
                    {isLoadingDeleteProductsWeight === true ? (
                        <CircularProgress color="inherit" />
                    ) : (
                        <Button className="btn-red" onClick={handleDeleteProductWeight} autoFocus>
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

export default ProductWeightPage;
