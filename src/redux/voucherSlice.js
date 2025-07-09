import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    vouchers: [],
    selectUser: null,
};

const voucherSlice = createSlice({
    name: 'vouchers',
    initialState,
    reducers: {
        fetchVouchers: (state, action) => {
            state.vouchers = action.payload;
        },
        updateVoucherInfo: (state, action) => {
            const index = state.vouchers.findIndex((v) => v._id === action.payload.voucherId);
            if (index !== -1) {
                state.vouchers[index] = {
                    ...state.vouchers[index],
                    ...action.payload.voucher,
                };
            }
        },
        toggleActiveVoucher: (state, action) => {
            const index = state.vouchers.findIndex((v) => v._id === action.payload.voucherId);
            if (index !== -1) {
                state.vouchers[index] = {
                    ...state.vouchers[index],
                    isActive: action.payload.isActive,
                };
            }
        },
        deleteVoucher: (state, action) => {
            state.vouchers = state.vouchers.filter((v) => v._id !== action.payload._id);
        },
        addVoucher: (state, action) => {
            state.vouchers.push(action.payload);
        },
        deleteMultipleVouchers: (state, action) => {
            const deleteVoucher = action.payload.voucherIds;
            state.vouchers = state.vouchers.filter((voucher) => !deleteVoucher.includes(voucher._id));
        },
    },
});

export const {
    fetchVouchers,
    updateVoucherInfo,
    toggleActiveVoucher,
    deleteVoucher,
    addVoucher,
    deleteMultipleVouchers,
} = voucherSlice.actions;

export default voucherSlice.reducer;
