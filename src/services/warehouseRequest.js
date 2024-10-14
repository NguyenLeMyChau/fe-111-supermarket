import { getOrderFailed, getOrderStart, getOrderSuccess } from "../store/reducers/orderSlice";
import { getWarehouseFailed, getWarehouseStart, getWarehouseSuccess } from "../store/reducers/warehouseSlice";


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

const orderProductFromSupplier = async (accessToken, axiosJWT, orderData) => {
    const { supplierId, accountId, products } = orderData;
    try {
        const response = await axiosJWT.post(`/api/warehouse/order-product-from-supplier`,
            { supplierId, accountId, products },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        return response.data;
    } catch (error) {
        console.error('Order product failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

const updateOrderStatus = async (accessToken, axiosJWT, orderId, newStatus, products) => {
    try {
        const response = await axiosJWT.put(`/api/warehouse/update-order-status`, { orderId, newStatus, products }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('update status failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

const addBillWarehouse = async (orderData, navigate, accessToken, axiosJWT) => {
    const { supplierId, accountId, billId, productList } = orderData;

    try {
        const response = await axiosJWT.post(`/api/warehouse/add-bill-warehouse`,
            { supplierId, accountId, billId, productList },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        alert('Nhập hàng thành công!');
        navigate('/admin/bill');
        return response.data;
    } catch (error) {
        console.error('Add bill failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

const getAllBill = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getOrderStart());
    try {
        const response = await axiosJWT.get(`api/warehouse/get-all-bill`, {
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

const updateBill = async (oldBillId, newBillId, productList, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/warehouse/update-bill`, { oldBillId, newBillId, productList }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Cập nhật phiếu nhập kho thành công!');
        return response.data;
    } catch (error) {
        console.error('update bill failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

export {
    getAllWarehouse,
    getAllOrder,
    orderProductFromSupplier,
    updateOrderStatus,
    addBillWarehouse,
    getAllBill,
    updateBill
};