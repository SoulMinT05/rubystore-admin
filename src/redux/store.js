import { configureStore } from '@reduxjs/toolkit';
import homeSlideReducer from './homeSlidesSlice';
import productReducer from './productSlice';
import categoryReducer from './categorySlice';
import userReducer from './userSlice';
import staffReducer from './staffSlice';
import orderReducer from './orderSlice';
import voucherReducer from './voucherSlice';
import messageReducer from './messageSlice';
import notificationReducer from './notificationSlice';
import reviewReducer from './reviewSlice';
import blogReducer from './blogSlice';

const store = configureStore({
    reducer: {
        homeSlides: homeSlideReducer,
        users: userReducer,
        staffs: staffReducer,
        products: productReducer,
        categories: categoryReducer,
        orders: orderReducer,
        vouchers: voucherReducer,
        blogs: blogReducer,
        reviews: reviewReducer,
        message: messageReducer,
        notification: notificationReducer,
    },
});

export default store;
