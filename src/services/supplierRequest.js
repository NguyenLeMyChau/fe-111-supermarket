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

export { getAllSuppliers };