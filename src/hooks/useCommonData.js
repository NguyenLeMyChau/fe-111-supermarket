import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDataManagerFailed, getDataManagerStart, getDataManagerSuccess, resetDataManager } from '../store/reducers/commonDataSlice';
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
    const isDataFetched = useSelector((state) => state.commonData?.dataManager?.isFetched);

    useEffect(() => {
        const fetchDataManager = async () => {
            try {
                console.log('fetchDataManager is loading...');
                dispatch(getDataManagerStart());
                const [suppliers, categories, employees, products, promotions] = await Promise.all([
                    getAllSuppliers(currentUser?.accessToken, axiosJWT),
                    getAllCategories(currentUser?.accessToken, axiosJWT),
                    getAllEmployees(currentUser?.accessToken, axiosJWT),
                    getAllProducts(currentUser?.accessToken, axiosJWT),
                    getAllPromotions(currentUser?.accessToken, axiosJWT),
                ]);
                dispatch(getDataManagerSuccess({
                    suppliers: suppliers,
                    categories: categories,
                    employees: employees,
                    products: products,
                    promotions: promotions
                }));
            } catch (err) {
                console.log('Error while fetching suppliers:', err);
                dispatch(getDataManagerFailed());
            }
        };

        if (currentUser?.role === 'manager' && !isDataFetched) {
            fetchDataManager();
        }

    }, [currentUser, axiosJWT, dispatch, isDataFetched]);

    useEffect(() => {
        const locationPath = location.pathname;
        if (locationPath === '/admin/inventory') {
            getAllWarehouse(currentUser?.accessToken, axiosJWT, dispatch);
        }
        if (locationPath === '/admin/order') {
            getAllOrder(currentUser?.accessToken, axiosJWT, dispatch);
        }
    }, [currentUser?.accessToken, axiosJWT, dispatch, location.pathname]);


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
            dispatch(resetDataManager());
        }
    }, [logout, dispatch]);

    if (!currentUser || currentUser?.role !== 'manager') {
        return <div className='frame-access-denied'></div>;
    }

};

export default useCommonData;