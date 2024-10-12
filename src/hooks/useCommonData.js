import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAxiosInstance } from '../utils/util';
import { loginSuccess } from '../store/reducers/authSlice';
import { getAllSuppliers } from '../services/supplierRequest';
import { useLocation, useNavigate } from 'react-router';
import { getAllCategories, getAllProducts } from '../services/productRequest';
import { getAllEmployees } from '../services/employeeRequest';
import { getAllPromotions } from '../services/promotionRequest';
import { getAllBill, getAllWarehouse } from '../services/warehouseRequest';

const useCommonData = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const currentUser = useSelector((state) => state.auth?.login?.currentUser);
    const logout = useSelector((state) => state.auth?.login?.isLogout);
    const axiosJWT = createAxiosInstance(currentUser, dispatch, loginSuccess);
    const warehouses = useSelector((state) => state.warehouse?.warehouse);

    const apiCallMapping = useMemo(() => ({
        '/admin/inventory': getAllWarehouse,
        '/admin/bill': getAllBill,
        '/admin/product': getAllProducts,
        '/admin/category': getAllCategories,
        '/admin/supplier': getAllSuppliers,
        '/admin/employee': getAllEmployees,
        '/admin/promotion': getAllPromotions,
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
    }, [currentUser, axiosJWT, dispatch, location.pathname, apiCallMapping, warehouses]);


    useEffect(() => {
        if (!currentUser && !logout) {
            alert('Vui lòng đăng nhập để thực hiện chức năng này!');
            navigate('/login');
        } else if (currentUser?.role !== 'manager' && !logout) {
            alert('Chỉ có quản lý mới có thể truy cập trang này!');
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