import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifications: [],
    allNotifications: [],
    unreadCountNotifications: 0,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        fetchNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.notifications = state.notifications.slice(0, 4);
            state.unreadCountNotifications += 1;
        },
        getUnreadCountNotifications: (state, action) => {
            state.unreadCountNotifications = action.payload;
        },
        markNotificationRead: (state, action) => {
            const notificationIndex = state.notifications.findIndex(
                (notification) => notification._id === action.payload.notificationId
            );
            if (notificationIndex !== -1) {
                state.notifications[notificationIndex].isRead = true;
                state.unreadCountNotifications -= 1;
            }
        },
        markAllNotificationsAsRead: (state) => {
            state.notifications = state.notifications.map((notification) => ({
                ...notification,
                isRead: true,
            }));
            state.allNotifications = state.allNotifications.map((notification) => ({
                ...notification,
                isRead: true,
            }));
            state.unreadCountNotifications = 0;
        },
    },
});

export const {
    fetchNotifications,
    addNotification,
    getUnreadCountNotifications,
    markNotificationRead,
    markAllNotificationsAsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;
