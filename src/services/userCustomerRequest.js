import { toast } from 'react-toastify';
import { getInvoiceCustomerFailed, getInvoiceCustomerStart, getInvoiceCustomerSuccess } from '../store/reducers/invoiceCustomerSlice';

const updateCustomerInfo = async (accountId, customerInfo, navigate, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/customer/update-customer/${accountId}`, {
            accountId,
            customerInfo,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        toast.warning('Vui lòng đăng nhập lại để cập nhật thông tin mới, chúng tôi xin lỗi vì sự bất tiện này');
        navigate('Login');
        return response.data;
    } catch (error) {
        console.error('Update product cart failed:', error);
    }
}

const getInvoicesByAccountId = async (accountId, accessToken, axiosJWT, dispatch) => {
    dispatch(getInvoiceCustomerStart());
    try {
        const response = await axiosJWT.get(`/api/customer/get-invoice/${accountId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getInvoiceCustomerSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get invoices failed:', error);
        dispatch(getInvoiceCustomerFailed());
    }
}

export { updateCustomerInfo, getInvoicesByAccountId };