import { createSlice } from '@reduxjs/toolkit';

export const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        value: [],
    },
    reducers: {
        
        setPosts: (state, action) => {
            state.value = action.payload;
        },
        removePostById: (state, action) => {
            state.value = state.value.filter(post => post._id !== action.payload);
        
        },
        unshiftPost: (state,action) => {
            state.value.unshift(action.payload);
        },
        
    }
});

export const { removePostById, setPosts, unshiftPost}  = postsSlice.actions;
export const selectPosts = (state) => state.posts.value;
export const selectPostById = (state, postId) => state.posts.value.find(post => post._id === postId);
export default postsSlice.reducer;

