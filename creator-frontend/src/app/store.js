import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../redux/authSlice';
import postsReducer from '../redux/postsSlice';

export default configureStore({
    reducer: {
        auth: authReducer,
        posts: postsReducer
    }
})