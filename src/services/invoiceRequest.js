import { getInvoiceFailed, getInvoiceStart, getInvoiceSuccess, resetInvoice } from "../store/reducers/invoiceSlice";


const getAllInvoices = async (accessToken, axiosJWT, dispatch) => {
    
    try {
        dispatch(getInvoiceStart());
        const response = await axiosJWT.get(`/api/invoice/get-all-invoice`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getInvoiceSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all invoices failed:', error);
        dispatch(getInvoiceFailed());
    }
};
const getAllInvoicesRefund = async (accessToken, axiosJWT, dispatch) => {
    dispatch(resetInvoice());
    try {
        dispatch(getInvoiceStart());
        const response = await axiosJWT.get(`/api/invoice/get-all-invoice-refund`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(response.data)
        dispatch(getInvoiceSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all invoices refund failed:', error);
        dispatch(getInvoiceFailed());
    }
};

const updateStatusOrder = async (accessToken, axiosJWT, toast, navigate, invoice_id, status) => {
    try {
        await axiosJWT.put(`/api/invoice/update-status-order`, {
            invoice_id,
            status
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        toast.success('Cập nhật trạng thái đơn hàng thành công');
        navigate('/admin/order-online');
    } catch (error) {
        console.error('Update status order failed:', error);
    }
};

export { getAllInvoices, updateStatusOrder,getAllInvoicesRefund };