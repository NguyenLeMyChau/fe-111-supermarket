import { getInvoiceFailed, getInvoiceStart, getInvoiceSuccess } from "../store/reducers/invoiceSlice";


const getAllInvoices = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getInvoiceStart());
    try {
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

export { getAllInvoices, updateStatusOrder };