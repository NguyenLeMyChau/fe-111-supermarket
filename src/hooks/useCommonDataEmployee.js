import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAxiosInstance } from '../utils/util';
import { loginSuccess } from '../store/reducers/authSlice';
import { getAllSuppliers } from '../services/supplierRequest';
import { useLocation, useNavigate } from 'react-router';
import { getAllCategories, getAllProducts } from '../services/productRequest';
import { getAllCustomer, getAllEmployeeAndManager, getAllEmployees } from '../services/employeeRequest';
import { getAllPromotions } from '../services/promotionRequest';
import { getAllBill, getAllStocktaking, getAllTransaction, getAllWarehouse } from '../services/warehouseRequest';
import { getAllUnit } from '../services/unitRequest';
import { getAllPrices } from '../services/priceRequest'
import { getAllInvoices, getAllInvoicesRefund } from '../services/invoiceRequest';
import { toast } from 'react-toastify';

const useCommonDataEmployee = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const currentUser = useSelector((state) => state.auth?.login?.currentUser);
    const logout = useSelector((state) => state.auth?.login?.isLogout);
    const axiosJWT = createAxiosInstance(currentUser, dispatch, loginSuccess);

    const apiCallMapping = useMemo(() => ({
        '/frame-staff/order-online': getAllInvoices,
    }), []);

    useEffect(() => {
        // Kiểm tra currentUser và vai trò là 'manager'
        if (!currentUser || currentUser.role !== 'staff') {
            console.warn('currentUser is null or not staff');
            return;
        }

        const locationPath = location.pathname;

        // Lấy API call function tương ứng với locationPath
        const apiCall = apiCallMapping[locationPath];

        // Thực hiện API call nếu tồn tại
        if (apiCall) {
            apiCall(currentUser.accessToken, axiosJWT, dispatch);
        }

    }, [currentUser, axiosJWT, dispatch, location.pathname, apiCallMapping]);


    // useEffect(() => {
    //     if (!currentUser && !logout) {
    //         toast.warning('Vui lòng đăng nhập để thực hiện chức năng này!');
    //         navigate('/login');
    //     } else if (currentUser?.role !== 'staff' && !logout) {
    //         toast.warning('Chỉ có nhân viên có thể truy cập trang này!');
    //         navigate('/login');
    //     }
    // }, [currentUser, logout, navigate]);


    useEffect(() => {
        if (logout) {
            // dispatch(resetDataManager());
        }
    }, [logout, dispatch]);

    if (!currentUser || currentUser?.role !== 'manager') {
        return <div className='frame-access-denied'></div>;
    }

};

export default useCommonDataEmployee;