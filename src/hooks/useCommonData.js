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

const useCommonData = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const currentUser = useSelector((state) => state.auth?.login?.currentUser);
    const logout = useSelector((state) => state.auth?.login?.isLogout);
    const axiosJWT = createAxiosInstance(currentUser, dispatch, loginSuccess);

    const apiCallMapping = useMemo(() => ({
        '/admin/inventory': getAllWarehouse,
        '/admin/bill': getAllBill,
        '/admin/product': getAllProducts,
        '/admin/category': getAllCategories,
        '/admin/supplier': getAllSuppliers,
        '/admin/employee': getAllEmployees,
        '/admin/promotion': getAllPromotions,
        '/admin/price': getAllPrices,
        '/admin/invoice': getAllInvoices,
        '/admin/refund-invoice': getAllInvoicesRefund,
        '/admin/customer': getAllCustomer,
        '/admin/unit': getAllUnit,
        '/admin/transaction': getAllTransaction,
        '/admin/stocktaking': getAllStocktaking,
        '/admin/order-online': getAllInvoices,
        '/admin/statistical/daily-revenue': getAllEmployeeAndManager,
    }), []);

    useEffect(() => {
        // Kiểm tra currentUser và vai trò là 'manager'
        if (!currentUser || currentUser.role !== 'manager') {
            console.warn('currentUser is null or not manager');
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


    useEffect(() => {
        if (!currentUser && !logout) {
            toast.warning('Vui lòng đăng nhập để thực hiện chức năng này!');
            navigate('/login');
        } else if (currentUser?.role !== 'manager' && !logout) {
            toast.warning('Chỉ có quản lý mới có thể truy cập trang này!');
            navigate('/login');
        }
    }, [currentUser, logout, navigate]);


    useEffect(() => {
        if (logout) {
            // dispatch(resetDataManager());
        }
    }, [logout, dispatch]);

    if (!currentUser || currentUser?.role !== 'manager') {
        return <div className='frame-access-denied'></div>;
    }

};

export default useCommonData;