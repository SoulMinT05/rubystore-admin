import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    blogs: [],
};

const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        fetchBlogs: (state, action) => {
            state.blogs = action.payload;
        },
        addBlog: (state, action) => {
            state.blogs.push(action.payload);
        },
        updateBlog: (state, action) => {
            const index = state.blogs.findIndex((u) => u._id === action.payload.blogId);
            if (index !== -1) {
                state.blogs[index] = {
                    ...state.blogs[index],
                    ...action.payload.blog,
                };
            }
        },
        deleteBlog: (state, action) => {
            state.blogs = state.blogs.filter((b) => b._id !== action.payload.blogId);
        },
        deleteMultipleBlogs: (state, action) => {
            const deleteBlog = action.payload.blogIds;
            state.blogs = state.blogs.filter((blog) => !deleteBlog.includes(blog._id));
        },
    },
});

export const { fetchBlogs, addBlog, updateBlog, deleteBlog, deleteMultipleBlogs } = blogSlice.actions;

export default blogSlice.reducer;
