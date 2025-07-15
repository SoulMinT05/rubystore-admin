import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    reviews: [],
    selectOrder: null,
};

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        fetchReviews: (state, action) => {
            state.reviews = action.payload;
        },
        updateReview: (state, action) => {
            const index = state.reviews.findIndex((u) => u._id === action.payload.reviewId);
            if (index !== -1) {
                state.reviews[index] = {
                    ...state.reviews[index],
                    reviewStatus: action.payload.reviewStatus,
                };
            }
        },
        addReview: (state, action) => {
            state.reviews.unshift(action.payload);
        },
        addReply: (state, action) => {
            const { reviewId, newReply } = action.payload;
            const reviewIndex = state.reviews.findIndex((review) => review._id === reviewId);
            if (reviewIndex !== -1) {
                if (!state.reviews[reviewIndex].replies) {
                    state.reviews[reviewIndex].replies = [];
                }
                state.reviews[reviewIndex].replies.push(newReply);
            }
        },
        deleteReview: (state, action) => {
            state.reviews = state.reviews.filter((u) => u._id !== action.payload._id);
        },
        deleteMultipleReviews: (state, action) => {
            const deleteReview = action.payload.reviewIds;
            state.reviews = state.reviews.filter((review) => !deleteReview.includes(review._id));
        },
    },
});

export const { fetchReviews, updateReview, addReview, addReply, deleteReview, deleteMultipleReviews } =
    reviewSlice.actions;

export default reviewSlice.reducer;
