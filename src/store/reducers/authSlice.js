import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    login: {
        currentUser: null,
        isFetching: false,
        error: false,
        isLogout: false,
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.login.isFetching = true;
            state.login.isLogout = false;
        },
        loginSuccess(state, action) {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed(state) {
            state.login.isFetching = false;
            state.login.error = true;
        },
        logoutStart(state) {
            state.login.isFetching = true;
        },
        logoutSuccess(state) {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = false;
            state.login.isLogout = true;
        },
        logoutFailed(state) {
            state.login.isFetching = false;
            state.login.error = true;
        },
        resetLogoutState: (state) => {
            state.login.isLogout = false;
        },
    },
});

export const { loginStart, loginSuccess, loginFailed, logoutStart, logoutSuccess, logoutFailed, resetLogoutState } = authSlice.actions;
export default authSlice.reducer;