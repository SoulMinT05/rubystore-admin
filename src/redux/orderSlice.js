import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
    selectOrder: null,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        fetchOrders: (state, action) => {
            state.orders = action.payload;
        },
        updateOrderStatus: (state, action) => {
            const index = state.orders.findIndex((u) => u._id === action.payload.orderId);
            if (index !== -1) {
                state.orders[index] = {
                    ...state.orders[index],
                    orderStatus: action.payload.orderStatus,
                };
            }
        },
        deleteOrder: (state, action) => {
            state.orders = state.orders.filter((u) => u._id !== action.payload._id);
        },
        deleteMultipleOrders: (state, action) => {
            const deleteOrder = action.payload.orderIds;
            state.orders = state.orders.filter((order) => !deleteOrder.includes(order._id));
        },
    },
});

export const { fetchOrders, updateOrderStatus, deleteOrder, deleteMultipleOrders } = orderSlice.actions;

export default orderSlice.reducer;
