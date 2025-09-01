import React, { useContext, useEffect, useState } from 'react';

import { MdOutlineModeEdit } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';

import './EditSubCategoryComponent.scss';
import { Button, MenuItem, Select, CircularProgress } from '@mui/material';
import { MyContext } from '../../App';
import axiosClient from '../../apis/axiosClient';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const EditSubCategoryComponent = ({ name, id, categories, selectedCategory, selectedCategoryName }) => {
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        parentCategoryName: null,
        parentId: null,
    });
    const context = useContext(MyContext);
    const [selectVal, setSelectVal] = useState();
    const [categoryId, setCategoryId] = useState(null);

    const [open, setOpen] = useState(false);

    const handleClickOpen = (id) => {
        setOpen(true);
        setCategoryId(id);
    };

    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        formFields.name = name;
        formFields.parentCategoryName = selectedCategoryName;
        formFields.parentId = selectedCategory;
        setSelectVal(selectedCategory);
    }, []);

    const handleChange = (e) => {
        setSelectVal(e.target.value);
        formFields.parentId = e.target.value;
    };

    const onChangeInput = (e) => {
        const { name, value } = e.target;

        const categoryId = selectVal;
        setSelectVal(categoryId);

        setFormFields(() => {
            return {
                ...formFields,
                [name]: value,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (formFields.name === '') {
                context.openAlertBox('error', 'Hãy nhập tên danh mục');
                return;
            }
            const { data } = await axiosClient.put(`/api/category/${id}`, formFields);

            if (data.success) {
                context.openAlertBox('success', data.message);
                context.getCategories();
                setEditMode(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async () => {
        setIsLoadingDelete(true);
        try {
            const { data } = await axiosClient.delete(`/api/category/${categoryId}`);
            if (data.success) {
                context.openAlertBox('success', data.message);
                context.getCategories();
                handleClose();
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            context.openAlertBox('error', 'Cập nhật thất bại');
        } finally {
            setIsLoadingDelete(false);
        }
    };

    return (
        <>
            <form className="w-100 flex items-center gap-3 p-0 px-4" onSubmit={handleSubmit}>
                {editMode === true && (
                    <>
                        <div className="flex items-center justify-between py-2 gap-4">
                            <div className="w-[150px]">
                                <Select
                                    MenuProps={{ disableScrollLock: true }}
                                    style={{ zoom: '75%' }}
                                    className="w-full"
                                    size="small"
                                    value={selectVal}
                                    onChange={handleChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    {categories?.length !== 0 &&
                                        categories?.map((item, index) => {
                                            return (
                                                <MenuItem
                                                    value={item?._id}
                                                    key={index}
                                                    onClick={() => (formFields.parentCategoryName = item?.name)}
                                                >
                                                    {item?.name}
                                                </MenuItem>
                                            );
                                        })}
                                </Select>
                            </div>

                            <input
                                type="text"
                                className="w-full h-[30px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                                name="name"
                                value={formFields?.name}
                                onChange={onChangeInput}
                            />

                            <div className="flex items-center gap-2">
                                <Button
                                    size="small"
                                    className="btn-sml !min-w-[100px] !w-[100px]"
                                    type="submit"
                                    variant="contained"
                                >
                                    {isLoading === true ? <CircularProgress color="inherit" /> : 'Cập nhật'}
                                </Button>
                                <Button
                                    size="small"
                                    className="!min-w-[100px] !w-[100px]"
                                    variant="outlined"
                                    onClick={() => setEditMode(false)}
                                >
                                    Huỷ bỏ
                                </Button>
                            </div>
                        </div>
                    </>
                )}
                {editMode === false && (
                    <>
                        <span className="font-[500] text-[14px]">{name}</span>
                        <div className="flex items-center ml-auto gap-2">
                            <Button
                                onClick={() => setEditMode(true)}
                                className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black"
                            >
                                <MdOutlineModeEdit />
                            </Button>
                            <Button
                                onClick={() => handleClickOpen(id)}
                                className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black"
                            >
                                <FaRegTrashAlt />
                            </Button>
                        </div>
                    </>
                )}
            </form>

            <Dialog
                disableScrollLock
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Xoá danh mục?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn xoá danh mục này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Huỷ</Button>
                    {isLoadingDelete === true ? (
                        <CircularProgress color="inherit" />
                    ) : (
                        <Button className="btn-red" onClick={handleDeleteCategory} autoFocus>
                            Xác nhận
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EditSubCategoryComponent;
