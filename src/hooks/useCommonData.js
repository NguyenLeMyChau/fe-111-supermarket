import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDataManagerFailed, getDataManagerStart, getDataManagerSuccess } from '../store/reducers/commonDataSlice';
import { createAxiosInstance } from '../utils/util';
import { loginSuccess } from '../store/reducers/authSlice';
import { getAllSuppliers } from '../services/supplierRequest';
import { useNavigate } from 'react-router';
import { getAllCategories } from '../services/categoryRequest';

const useCommonData = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth?.login?.currentUser);
    const logout = useSelector((state) => state.auth?.login?.isLogout);
    const axiosJWT = createAxiosInstance(currentUser, dispatch, loginSuccess);
    const isDataFetched = useSelector((state) => state.commonData?.dataManager?.isFetched);

    useEffect(() => {
        const fetchDataManager = async () => {
            try {
                console.log('fetchDataManager is loading...');
                dispatch(getDataManagerStart());
                const suppliers = await getAllSuppliers(currentUser?.accessToken, axiosJWT);
                const categories = await getAllCategories(currentUser?.accessToken, axiosJWT);
                dispatch(getDataManagerSuccess({ suppliers: suppliers, categories: categories }));
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
        console.log('login', currentUser);
        if (!currentUser && !logout) {
            alert('Vui lòng đăng nhập để thực hiện chức năng này!');
            navigate('/login');
        } else if (currentUser?.role !== 'manager' && !logout) {
            alert('Chỉ có quản lý mới có thể truy cập trang này!');
            navigate('/login');
        }
    }, [currentUser, logout, navigate]);

    if (!currentUser || currentUser?.role !== 'manager') {
        return <div className='frame-access-denied'></div>;
    }

};

export default useCommonData;