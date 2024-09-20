import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, resetLogoutState } from '../store/reducers/authSlice';

const loginUser = async (loginData, dispatch, navigate) => {
    dispatch(loginStart());

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, loginData);
        console.log('Login success:', response.data);

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
            navigate('/frame');
        } else if(userWithToken.role === 'staff'){
            navigate('/frame-staff');
        }
        else{
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
    } catch (error) {
        dispatch(logoutFailed());
        console.error('Logout failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

export { loginUser, logoutUser };