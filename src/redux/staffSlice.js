import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    staffs: [],
    selectStaff: null,
};

const staffSlice = createSlice({
    name: 'staffs',
    initialState,
    reducers: {
        fetchStaffs: (state, action) => {
            state.staffs = action.payload;
        },
        updateStaffInfo: (state, action) => {
            const index = state.staffs.findIndex((s) => s._id === action.payload.staffId);
            if (index !== -1) {
                state.staffs[index] = {
                    ...state.staffs[index],
                    ...action.payload.staff,
                };
            }
        },
        toggleLockedStaff: (state, action) => {
            const index = state.staffs.findIndex((s) => s._id === action.payload.staffId);
            if (index !== -1) {
                state.staffs[index] = {
                    ...state.staffs[index],
                    isLocked: action.payload.isLocked,
                };
            }
        },
        deleteStaff: (state, action) => {
            state.staffs = state.staffs.filter((s) => s._id !== action.payload._id);
        },
        addStaff: (state, action) => {
            state.staffs.push(action.payload);
        },
        deleteMultipleStaffs: (state, action) => {
            const deleteStaff = action.payload.staffIds;
            state.staffs = state.staffs.filter((staff) => !deleteStaff.includes(staff._id));
        },
    },
});

export const { fetchStaffs, updateStaffInfo, toggleLockedStaff, deleteStaff, addStaff, deleteMultipleStaffs } =
    staffSlice.actions;

export default staffSlice.reducer;
