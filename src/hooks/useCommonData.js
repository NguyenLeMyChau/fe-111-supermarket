import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAxiosInstance } from '../utils/util';
import { loginSuccess } from '../store/reducers/authSlice';
import { getAllSuppliers } from '../services/supplierRequest';
import { useLocation, useNavigate } from 'react-router';
import { getAllCategories, getAllProducts } from '../services/productRequest';
import { getAllEmployees } from '../services/employeeRequest';
import { getAllPromotions } from '../services/promotionRequest';
import { getAllOrder, getAllWarehouse } from '../services/warehouseRequest';

const useCommonData = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const currentUser = useSelector((state) => state.auth?.login?.currentUser);
    const logout = useSelector((state) => state.auth?.login?.isLogout);
    const axiosJWT = createAxiosInstance(currentUser, dispatch, loginSuccess);

    useEffect(() => {
        if (!currentUser || !currentUser.role === 'manager') {
            console.warn('currentUser is null or not manager');
            return; // Ngừng thực hiện các API call nếu currentUser là null
        }

        const locationPath = location.pathname;
        if (locationPath === '/admin/inventory') {
            getAllWarehouse(currentUser.accessToken, axiosJWT, dispatch);
        }
        if (locationPath === '/admin/order') {
            getAllOrder(currentUser.accessToken, axiosJWT, dispatch);
        }
        if (locationPath === '/admin/product') {
            getAllProducts(currentUser.accessToken, axiosJWT, dispatch);
        }
        if (locationPath === '/admin/category') {
            getAllCategories(currentUser.accessToken, axiosJWT, dispatch);
        }
        if (locationPath === '/admin/supplier') {
            getAllSuppliers(currentUser.accessToken, axiosJWT, dispatch);
        }
        if (locationPath === '/admin/employee') {
            getAllEmployees(currentUser.accessToken, axiosJWT, dispatch);
        }
        if (locationPath === '/admin/promotion') {
            getAllPromotions(currentUser.accessToken, axiosJWT, dispatch);
        }
    }, [currentUser, axiosJWT, dispatch, location.pathname]);


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