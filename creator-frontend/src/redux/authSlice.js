import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        value: '',
    },
    reducers: {
        authAdmin: (state) => {
            state.value = 'admin';
        },
        authUser: (state) => {
            state.value = 'user';
        },
        setUsername: (state, action) => {
            state.value = action.payload;
        },
        remove: (state) => {
            state.value = '';
        }
    }
});

export const { authAdmin, authUser, setUsername, remove}  = authSlice.actions;
export const selectAuth = (state) => state.auth.value;
export default authSlice.reducer;

