import { getEmployeeFailed, getEmployeeStart, getEmployeeSuccess } from "../store/reducers/employeeSlice";

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

export { getAllEmployees, registerEmployee, updateEmployee };