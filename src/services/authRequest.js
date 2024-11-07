import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, resetLogoutState } from '../store/reducers/authSlice';

const loginUser = async (loginData, dispatch, navigate) => {
    dispatch(loginStart());

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, loginData);

        const { accessToken, refreshToken } = response.data;

        // Lưu trữ refresh token trong sessionStorage
        sessionStorage.setItem('refreshToken', refreshToken);

        // Giải mã accessToken để lấy thông tin người dùng
        const decodedToken = jwtDecode(accessToken);

        const { exp, iat, ...userWithoutExpIat } = decodedToken;

        const userWithToken = {
            ...userWithoutExpIat,
            accessToken: response.data.accessToken
        };

        console.log('User with token:', userWithToken);

        // Lưu thông tin người dùng vào redux store 
        dispatch(loginSuccess(userWithToken));

        if (userWithToken.role === 'manager') {
            navigate('/admin/user');
        } else if (userWithToken.role === 'staff') {
            navigate('/frame-staff');
        } else if (userWithToken.role === 'customer') {
            navigate('/home');
        }
        else {
            alert('Chờ cập nhật role')
        }

    } catch (error) {
        dispatch(loginFailed());
        console.error('Login failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

const logoutUser = async (dispatch, navigate, accessToken, axiosJWT) => {
    dispatch(logoutStart());
    try {
        await axiosJWT.post(`/api/auth/logout`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        await dispatch(logoutSuccess());
        sessionStorage.removeItem('refreshToken');
        navigate('/login');
        setTimeout(() => {
            dispatch(resetLogoutState());
        }, 1000);
        // await dispatch(resetDataManager());
    } catch (error) {
        dispatch(logoutFailed());
        console.error('Logout failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

const updateUser = async (accountId, userData, dispatch, navigate, accessToken, axiosJWT) => {
    try {
        await axiosJWT.put(`/api/user/update-user/${accountId}`, userData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        alert('Cập nhật thông tin thành công. Vui lòng đăng nhập lại để thực hiện thao tác khác');

        logoutUser(dispatch, navigate, accessToken, axiosJWT);

    } catch (error) {
        console.error('Update user failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

const getProductsByBarcodeInUnitConvert = async (barcode, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/auth/get-product-by-barcode`, { barcode }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Get product by barcode failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

export { loginUser, logoutUser, updateUser, getProductsByBarcodeInUnitConvert };