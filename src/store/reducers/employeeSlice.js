import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    employees: null,
    isFetching: false,
    error: false,
};

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        getEmployeeStart(state) {
            state.isFetching = true;
            state.error = false;
        },
        getEmployeeSuccess(state, action) {
            state.employees = action.payload;
            state.isFetching = false;
            state.error = false;
        },
        getEmployeeFailed(state) {
            state.isFetching = false;
            state.error = true;
        },
        resetEmployee(state) {
            state.employees = null;
            state.isFetching = false;
            state.error = false;
        },
    }
});

export const { getEmployeeStart, getEmployeeSuccess, getEmployeeFailed, resetEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;