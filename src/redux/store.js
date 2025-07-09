import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import staffReducer from './staffSlice';
import voucherReducer from './voucherSlice';

const store = configureStore({
    reducer: {
        users: userReducer,
        staffs: staffReducer,
        vouchers: voucherReducer,
    },
});

export default store;
