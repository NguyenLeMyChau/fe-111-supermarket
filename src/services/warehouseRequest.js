import { getOrderFailed, getOrderStart, getOrderSuccess } from "../store/reducers/orderSlice";
import { getProductsByWarehouseIdSucess, getWarehouseFailed, getWarehouseStart, getWarehouseSuccess } from "../store/reducers/warehouseSlice";


const getAllWarehouse = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getWarehouseStart());
    try {
        const response = await axiosJWT.get(`/api/warehouse/get-warehouses`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getWarehouseSuccess(response.data));
        return response.data;
    } catch (error) {
        dispatch(getWarehouseFailed());
        console.error('Get all warehouse failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
};

const getProductsByWarehouseId = async (accessToken, axiosJWT, dispatch, warehouseId) => {
    dispatch(getWarehouseStart());
    try {
        const response = await axiosJWT.get(`/api/warehouse/get-products-by-warehouse/${warehouseId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getProductsByWarehouseIdSucess(response.data));
        return response.data;
    } catch (error) {
        dispatch(getWarehouseFailed());
        console.error('Get all product with supplier and warehouse failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

const getAllOrder = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getOrderStart());
    try {
        const response = await axiosJWT.get(`api/warehouse/get-all-orders`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getOrderSuccess(response.data));
        return response.data;
    } catch (error) {
        dispatch(getOrderFailed());
        console.error('Get all order failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

export { getAllWarehouse, getProductsByWarehouseId, getAllOrder };