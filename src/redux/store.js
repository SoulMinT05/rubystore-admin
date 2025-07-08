import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import staffReducer from './staffSlice';

const store = configureStore({
    reducer: {
        users: userReducer,
        staffs: staffReducer,
    },
});

export default store;
