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
        fetchMessagesDetails: (state, action) => {
            state.messagesDetails = action.payload;
        },
        sendMessage: (state, action) => {
            state.messagesDetails.push(action.payload);
        },
    },
});

export const { fetchMessagesSidebar, fetchMessagesDetails, sendMessage } = messageSlice.actions;

export default messageSlice.reducer;
