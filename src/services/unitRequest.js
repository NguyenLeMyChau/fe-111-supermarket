import { getUnitFailed, getUnitStart, getUnitSuccess } from "../store/reducers/unitSlice";

const getAllUnit = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getUnitStart());
    try {
        const response = await axiosJWT.get(`/api/unit/get-units`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getUnitSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all unit failed:', error);
        dispatch(getUnitFailed());
    }
};

const getUnitById = async (unitId, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.get(`/api/unit/get-unit/${unitId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Get unit by id failed:', error);
    }
};

const addUnit = async (unitData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/unit/add-unit`, unitData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Thêm đơn vị tính thành công');
        return response.data;
    } catch (error) {
        console.error('Add unit failed:', error);
    }
};

const updateUnit = async (unitId, unitData, accessToken, axiosJWT, navigate) => {
    try {
        const response = await axiosJWT.put(`/api/unit/update-unit/${unitId}`, unitData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Cập nhật đơn vị tính thành công');
        navigate('/admin/unit');
        return response.data;
    } catch (error) {
        console.error('Update unit failed:', error);
    }
}

const deleteUnit = async (unitId, accessToken, axiosJWT, navigate) => {
    try {
        const response = await axiosJWT.delete(`/api/unit/delete-unit/${unitId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Xóa đơn vị tính thành công');
        navigate('/admin/unit');
        return response.data;
    } catch (error) {
        console.error('Delete unit failed:', error);
    }
}

export { getAllUnit, getUnitById, addUnit, updateUnit, deleteUnit };