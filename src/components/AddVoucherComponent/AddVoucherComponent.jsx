import React, { useContext, useState } from 'react';

import './AddVoucherComponent.scss';
import UploadImagesComponent from '../UploadImagesComponent/UploadImagesComponent';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Button, CircularProgress, MenuItem, Select } from '@mui/material';
import { MyContext } from '../../App';
import axiosClient from '../../apis/axiosClient';
import { useDispatch } from 'react-redux';
import { addVoucher } from '../../redux/voucherSlice';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
const AddVoucherComponent = () => {
    const dispatch = useDispatch();
    const context = useContext(MyContext);
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState('');
    const [discountValue, setDiscountValue] = useState('');
    const [minOrderValue, setMinOrderValue] = useState('');
    const [quantityVoucher, setQuantityVoucher] = useState('');
    const [isActive, setIsActive] = useState('');
    const [expiresAt, setExpiresAt] = useState(null);

    const [isLoadingAddVoucher, setIsLoadingAddVoucher] = useState(false);

    const handleCreateVoucher = async (e) => {
        e.preventDefault();
        setIsLoadingAddVoucher(true);

        try {
            const { data } = await axiosClient.post('/api/voucher/createVoucher', {
                code,
                discountType,
                discountValue,
                minOrderValue,
                quantityVoucher,
                isActive,
                expiresAt,
            });
            if (data.success) {
                context.openAlertBox('success', data.message);
                dispatch(addVoucher(data?.voucher));
                context.setIsOpenFullScreenPanel({
                    open: false,
                });
            }
        } catch (error) {
            console.log('error: ', error);
            context.openAlertBox('error', error.response.data.message);
        } finally {
            setIsLoadingAddVoucher(false);
        }
    };

    return (
        <section className="p-5 bg-gray-50">
            <form onSubmit={handleCreateVoucher} className="form p-8 py-3 max-h-[800px] ">
                <div className="scroll overflow-y-scroll">
                    <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Code</h3>
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                            <p className="text-[12px] italic text-gray-500 mt-1">
                                Nếu không nhập code, thì sẽ được hệ thống tạo ngẫu nhiên
                            </p>
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Loại voucher</h3>
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                labelId="demo-simple-select-label"
                                id="discountTypeVoucher"
                                size="small"
                                className="w-full"
                                label="Trạng thái voucher"
                                value={discountType}
                                onChange={(e) => setDiscountType(e.target.value)}
                            >
                                <MenuItem value="percent">%</MenuItem>
                                <MenuItem value="fixed">VND</MenuItem>
                            </Select>
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Giá trị voucher</h3>
                            <input
                                value={discountValue}
                                onChange={(e) => setDiscountValue(e.target.value)}
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 mb-3 gap-3">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Giá trị đơn hàng tối thiểu</h3>
                            <input
                                value={minOrderValue}
                                onChange={(e) => setMinOrderValue(e.target.value)}
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Số lượng voucher</h3>
                            <input
                                value={quantityVoucher}
                                onChange={(e) => setQuantityVoucher(e.target.value)}
                                type="text"
                                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
                            />
                        </div>
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Trạng thái voucher</h3>
                            <Select
                                MenuProps={{ disableScrollLock: true }}
                                labelId="demo-simple-select-label"
                                id="isActiveVoucher"
                                size="small"
                                className="w-full"
                                label="Trạng thái voucher"
                                value={isActive}
                                onChange={(e) => setIsActive(e.target.value)}
                            >
                                <MenuItem value="true">Kích hoạt</MenuItem>
                                <MenuItem value="false">Vô hiệu hóa</MenuItem>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 mb-3 gap-3">
                        <div className="col">
                            <h3 className="text-[14px] font-[500] mb-1 text-black">Ngày hết hạn</h3>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Chọn ngày hết hạn voucher"
                                    value={expiresAt}
                                    onChange={(newValue) => setExpiresAt(newValue)}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                            <p className="text-[12px] italic text-gray-500 mt-1">
                                Nếu không nhập ngày hết hạn, thì mặc đinh là 7 ngày
                            </p>
                        </div>
                    </div>
                    <br />
                    <Button type="submit" className="btn-blue w-full !normal-case flex gap-2">
                        {isLoadingAddVoucher ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-[25px] text-white" />
                                <span className="text-[16px]">Thêm voucher</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default AddVoucherComponent;
