import { addInvoice, getInvoiceFailed, getInvoiceRefundStart, getInvoiceRefundSuccess, getInvoiceStart, getInvoiceSuccess, resetInvoice, updateInvoiceStatus } from "../store/reducers/invoiceSlice";


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

const getInvoicesByInvoiceCode = async (accessToken, axiosJWT,dispatch,invoiceCode) => {
    
    try {
        dispatch(getInvoiceRefundStart());
        const response = await axiosJWT.post(`/api/invoice/get-invoice-by-invoiceCode`,{invoiceCode}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(addInvoice(response.data));
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Get One invoices failed:', error);
        dispatch(getInvoiceFailed());
    }
};

const getAllInvoicesRefund = async (accessToken, axiosJWT, dispatch) => {
    
    try {
        dispatch(getInvoiceRefundStart());
        const response = await axiosJWT.get(`/api/invoice/get-all-invoice-refund`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(response.data)
        dispatch(getInvoiceRefundSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all invoices refund failed:', error);
        dispatch(getInvoiceFailed());
    }
};

const updateStatusOrder = async (accessToken, axiosJWT, toast, navigate, invoice, status,emitSocketEvent,employee_id) => {
    console.log(employee_id);
    try {
        await axiosJWT.put(`/api/invoice/update-status-order`, {
            invoice_id:invoice._id,
            status,
            employee_id
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // toast.success('Cập nhật trạng thái đơn hàng thành công');
        emitSocketEvent("updateStatusSuccess",{invoiceCode:invoice.invoiceCode, status});
        // navigate('/admin/order-online');
    } catch (error) {
        console.error('Update status order failed:', error);
    }
};


export { getAllInvoices, updateStatusOrder,getAllInvoicesRefund,getInvoicesByInvoiceCode };