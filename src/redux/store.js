import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import staffReducer from './staffSlice';
import orderReducer from './orderSlice';
import voucherReducer from './voucherSlice';

const store = configureStore({
    reducer: {
        users: userReducer,
        staffs: staffReducer,
        orders: orderReducer,
        vouchers: voucherReducer,
    },
});

export default store;
