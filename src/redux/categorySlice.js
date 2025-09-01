import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: [],
};

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        fetchCategories: (state, action) => {
            state.categories = action.payload;
        },
        addCategory: (state, action) => {
            state.categories.push(action.payload);
        },
        updateCategory: (state, action) => {
            const index = state.categories.findIndex((u) => u._id === action.payload.categoryId);
            console.log('state.categories[index]: ', JSON.parse(JSON.stringify(state.categories[index])));

            if (index !== -1) {
                state.categories[index] = {
                    ...state.categories[index],
                    ...action.payload.category,
                };
            }
        },
        updateSubCategory: (state, action) => {
            const { updatedSubCategory, oldParentId } = action.payload;

            // Xóa parent cũ
            if (oldParentId) {
                const oldParentIndex = state.categories.findIndex((cat) => cat?._id === oldParentId);
                if (oldParentIndex !== -1) {
                    state.categories[oldParentIndex].children = state.categories[oldParentIndex].children.filter(
                        (child) => child?._id !== updatedSubCategory?._id
                    );
                }
            }

            // Add parent mới
            if (updatedSubCategory.parentId) {
                const newParentIndex = state.categories.findIndex((cat) => cat?._id === updatedSubCategory?.parentId);
                if (newParentIndex !== -1) {
                    // check nếu tồn tại thì update, không thì push
                    const childIndex = state.categories[newParentIndex].children.findIndex(
                        (child) => child?._id === updatedSubCategory?._id
                    );
                    // Parent mới giống Parent cũ
                    if (childIndex !== -1) {
                        state.categories[newParentIndex].children[childIndex] = {
                            ...state.categories[newParentIndex].children[childIndex],
                            ...updatedSubCategory,
                        };
                    }
                    // Parent mới khác Parent cũ
                    else {
                        state.categories[newParentIndex].children.push(updatedSubCategory);
                    }
                }
            }
        },

        deleteCategory: (state, action) => {
            state.categories = state.categories.filter((b) => b._id !== action.payload.categoryId);
        },
        deleteSubCategory: (state, action) => {
            const { deletedSubCat } = action.payload;
            if (deletedSubCat?.parentId) {
                const parentIndex = state.categories.findIndex((cat) => cat?._id === deletedSubCat?.parentId);
                if (parentIndex !== -1) {
                    state.categories[parentIndex].children = state.categories[parentIndex].children.filter(
                        (child) => child?._id !== deletedSubCat?._id
                    );
                }
            }
        },
        deleteMultipleCategories: (state, action) => {
            const deleteCategory = action.payload.categoryIds;
            state.categories = state.categories.filter((category) => !deleteCategory.includes(category._id));
        },
    },
});

export const {
    fetchCategories,
    addCategory,
    updateCategory,
    updateSubCategory,
    deleteCategory,
    deleteSubCategory,
    deleteMultipleCategories,
} = categorySlice.actions;

export default categorySlice.reducer;
