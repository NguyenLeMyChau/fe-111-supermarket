import { getEmployeeAndManagerFailed, getEmployeeAndManagerStart, getEmployeeAndManagerSuccess, getEmployeeFailed, getEmployeeStart, getEmployeeSuccess } from "../store/reducers/employeeSlice";
import { getCustomerFailed, getCustomerStart, getCustomerSuccess } from "../store/reducers/customerSlice";
import axios from "axios";

const getAllEmployees = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getEmployeeStart());
    try {
        const response = await axiosJWT.get(`/api/employee/get-employees`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getEmployeeSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all categories failed:', error);
        dispatch(getEmployeeFailed());
    }
};

const registerEmployee = async (registerData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/auth/register-employee`, registerData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Resign employee failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

const updateEmployee = async (employeeId, employeeData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/employee/update-employee/${employeeId}`, employeeData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Cập nhật thông tin nhân viên thành công');
        return response.data;
    } catch (error) {
        console.error('Update employee failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

const getAllCustomer = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getCustomerStart());
    try {
        const response = await axiosJWT.get(`/api/employee/get-customers`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getCustomerSuccess(response.data));
        return response.data;
    } catch (error) {
        dispatch(getCustomerFailed());
        console.error('Get all categories failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
};

const registerCustomer = async (registerData) => {
    try {
        const response = await axios.post(`/api/auth/register-customer`, registerData);
        alert('Đăng ký khách hàng thành công');
        return response.data;
    } catch (error) {
        console.error('Resign customer failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

const updateCustomer = async (customerId, customerData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/employee/update-customer/${customerId}`, customerData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Cập nhật thông tin khách hàng thành công');
        return response.data;
    } catch (error) {
        console.error('Update customer failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

const getAllEmployeeAndManager = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getEmployeeAndManagerStart());
    try {
        const response = await axiosJWT.get(`/api/employee/get-employee-and-manager`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getEmployeeAndManagerSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all getAllEmployeeAndManager failed:', error);
        dispatch(getEmployeeAndManagerFailed());
    }
};


export { getAllEmployees, registerEmployee, updateEmployee, getAllCustomer, updateCustomer, registerCustomer, getAllEmployeeAndManager };