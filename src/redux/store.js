import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import staffReducer from './staffSlice';
import orderReducer from './orderSlice';
import voucherReducer from './voucherSlice';
import messageReducer from './messageSlice';
import notificationReducer from './notificationSlice';

const store = configureStore({
    reducer: {
        users: userReducer,
        staffs: staffReducer,
        orders: orderReducer,
        vouchers: voucherReducer,
        message: messageReducer,
        notification: notificationReducer,
    },
});

export default store;
