import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [],
    selectUser: null,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        fetchUsers: (state, action) => {
            state.users = action.payload;
        },
        updateUserInfo: (state, action) => {
            const index = state.users.findIndex((u) => u._id === action.payload.userId);
            if (index !== -1) {
                state.users[index] = {
                    ...state.users[index],
                    ...action.payload.user,
                };
            }
        },
        toggleLockedUser: (state, action) => {
            const index = state.users.findIndex((u) => u._id === action.payload.userId);
            if (index !== -1) {
                state.users[index] = {
                    ...state.users[index],
                    isLocked: action.payload.isLocked,
                };
            }
        },
        deleteUser: (state, action) => {
            state.users = state.users.filter((u) => u._id !== action.payload._id);
        },
        addUser: (state, action) => {
            state.users.push(action.payload);
        },
        deleteMultipleUsers: (state, action) => {
            const deleteUser = action.payload.userIds;
            state.users = state.users.filter((user) => !deleteUser.includes(user._id));
        },
    },
});

export const { fetchUsers, updateUserInfo, toggleLockedUser, deleteUser, addUser, deleteMultipleUsers } =
    userSlice.actions;

export default userSlice.reducer;
