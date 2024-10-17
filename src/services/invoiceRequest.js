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

export { getAllInvoices };