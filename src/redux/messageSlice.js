import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messagesSidebar: [],
    messagesDetails: [],
};

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        fetchMessagesSidebar: (state, action) => {
            state.messagesSidebar = action.payload;
        },
        updateOnlineStatusSidebar: (state, action) => {
            const { userId, isOnline, lastOnline } = action.payload;
            state.messagesSidebar = state.messagesSidebar.map((staff) =>
                staff?._id === userId
                    ? {
                          ...staff,
                          isOnline,
                          lastOnline,
                      }
                    : staff
            );
        },
        fetchMessagesDetails: (state, action) => {
            state.messagesDetails = action.payload;
        },
        sendMessage: (state, action) => {
            state.messagesDetails.push(action.payload);
        },
    },
});

export const { fetchMessagesSidebar, updateOnlineStatusSidebar, fetchMessagesDetails, sendMessage } =
    messageSlice.actions;

export default messageSlice.reducer;
