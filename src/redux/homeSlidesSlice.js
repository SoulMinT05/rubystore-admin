import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    homeSlides: [],
};

const homeSlidesSlice = createSlice({
    name: 'homeSlides',
    initialState,
    reducers: {
        fetchHomeSlides: (state, action) => {
            state.homeSlides = action.payload;
        },
        addHomeSlide: (state, action) => {
            state.homeSlides.push(action.payload);
        },
        updateHomeSlide: (state, action) => {
            const index = state.homeSlides.findIndex((u) => u._id === action.payload.homeSlideId);
            if (index !== -1) {
                state.homeSlides[index] = {
                    ...state.homeSlides[index],
                    ...action.payload.blog,
                };
            }
        },
        deleteHomeSlide: (state, action) => {
            state.homeSlides = state.homeSlides.filter((b) => b._id !== action.payload.homeSlideId);
        },
        deleteMultipleHomeSlides: (state, action) => {
            const deleteHomeSlide = action.payload.homeSlidesIds;
            state.homeSlides = state.homeSlides.filter((blog) => !deleteHomeSlide.includes(blog._id));
        },
    },
});

export const { fetchHomeSlides, addHomeSlide, updateHomeSlide, deleteHomeSlide, deleteMultipleHomeSlides } =
    homeSlidesSlice.actions;

export default homeSlidesSlice.reducer;
