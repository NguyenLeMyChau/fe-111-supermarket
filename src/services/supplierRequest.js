import { getSupplierFailed, getSupplierStart, getSupplierSuccess } from "../store/reducers/supplierSlice";

const getAllSuppliers = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getSupplierStart());
    try {
        const response = await axiosJWT.get(`/api/supplier/get-suppliers`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getSupplierSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all suppliers failed:', error);
        dispatch(getSupplierFailed());
    }
};

const addSupplier = async (supplierData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/supplier/add-supplier`, supplierData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Thêm thành công nhà cung cấp mới');
        return response.data;
    }
    catch (error) {
        console.error('Add supplier failed:', error);
    }
}

const updateSupplier = async (supplierId, supplierData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/supplier/update-supplier/${supplierId}`, supplierData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Cập nhật thành công nhà cung cấp');
        return response.data;
    }
    catch (error) {
        console.error('Update supplier failed:', error);
    }
}

export { getAllSuppliers, addSupplier, updateSupplier };