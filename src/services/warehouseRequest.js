import { toast } from "react-toastify";
import { getOrderFailed, getOrderStart, getOrderSuccess } from "../store/reducers/orderSlice";
import { getStocktakingFailed, getStocktakingStart, getStocktakingSuccess } from "../store/reducers/stocktakingSlice";
import { getTransactionFailed, getTransactionStart, getTransactionSuccess } from "../store/reducers/transactionSlice";
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
        toast.error(error.response ? error.response.data.message : error.message);
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
        toast.error(error.response ? error.response.data.message : error.message);
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
        toast.error(error.response ? error.response.data.message : error.message);
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
        toast.error(error.response ? error.response.data.message : error.message);
    }
}

const addBillWarehouse = async (orderData, navigate, accessToken, axiosJWT) => {
    const { accountId, billId, description, productList } = orderData;

    try {
        const response = await axiosJWT.post(`/api/warehouse/add-bill-warehouse`,
            { accountId, billId, description, productList },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            toast.success('Nhập hàng thành công!');
        navigate('/admin/bill');
        return response.data;
    } catch (error) {
        console.error('Add bill failed:', error);
        toast.error(error.response ? error.response.data.message : error.message);
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
        toast.error(error.response ? error.response.data.message : error.message);
    }
}

const updateBill = async (oldBillId, newBillId, productList, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/warehouse/update-bill`, { oldBillId, newBillId, productList }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        toast.success('Cập nhật phiếu nhập kho thành công!');
        return response.data;
    } catch (error) {
        console.error('update bill failed:', error);
        toast.error(error.response ? error.response.data.message : error.message);
    }
}

const getAllTransaction = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getTransactionStart());
    try {
        const response = await axiosJWT.get(`api/warehouse/get-all-transaction`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getTransactionSuccess(response.data));
        return response.data;
    } catch (error) {
        dispatch(getTransactionFailed());
        console.error('Get all transaction failed:', error);
        toast.error(error.response ? error.response.data.message : error.message);
    }
}

const cancelBill = async (billId, cancel_reason, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/warehouse/cancel-bill`, { billId, cancel_reason }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        toast.success('Huỷ phiếu nhập thành công');
        return response.data;
    } catch (error) {
        console.error('Cancel bill failed:', error);
        toast.error(error.response ? error.response.data.message : error.message);
    }
}

const addStocktaking = async (stocktakingData, navigate, accessToken, axiosJWT) => {
    const { accountId, stocktakingId, reason, productList } = stocktakingData;
    try {
        const response = await axiosJWT.post(`/api/warehouse/add-stocktaking`, {
            accountId,
            stocktakingId,
            reason,
            productList,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        toast.success('Nhập phiếu kiểm kê kho thành công!');
        navigate('/admin/stocktaking');
        return response.data;
    } catch (error) {
        console.error('Add stocktaking failed:', error);
        toast.error(error.response ? error.response.data.message : error.message);
    }
}

const getAllStocktaking = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getStocktakingStart());
    try {
        const response = await axiosJWT.get(`/api/warehouse/get-all-stocktaking`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getStocktakingSuccess(response.data));
        return response.data;
    } catch (error) {
        dispatch(getStocktakingFailed());
        console.error('Get all stocktaking failed:', error);
        toast.error(error.response ? error.response.data.message : error.message);
    }
}

export {
    getAllWarehouse,
    getAllOrder,
    orderProductFromSupplier,
    updateOrderStatus,
    addBillWarehouse,
    getAllBill,
    updateBill,
    getAllTransaction,
    cancelBill,
    addStocktaking,
    getAllStocktaking
};