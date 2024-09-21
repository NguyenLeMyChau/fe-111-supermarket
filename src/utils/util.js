import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const refreshToken = async () => {
    try {
        const refreshToken = sessionStorage.getItem('refreshToken');

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/refresh`, { refreshToken },
            {
                withCredentials: true, // Gửi cookie kèm theo request để server có thể đọc cookie
            });

        sessionStorage.setItem('refreshToken', response.data.refreshToken);


        return response.data;
    } catch (error) {
        console.log('Refresh token failed:', error);
    }
};

export const createAxiosInstance = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        withCredentials: true
    });

    newInstance.interceptors.request.use(
        async (config) => {
            const decodedToken = jwtDecode(user.accessToken);

            if (decodedToken.exp * 1000 < Date.now()) { // Token hết hạn
                try {
                    const newToken = await refreshToken();
                    const refreshUser = {
                        ...user,
                        accessToken: newToken.accessToken
                    };
                    dispatch(stateSuccess(refreshUser));
                    config.headers.Authorization = `Bearer ${newToken.accessToken}`; // Gán token mới cho header Authorization 
                } catch (error) {
                    console.error('Failed to refresh token:', error);
                }
            } else {
                config.headers.Authorization = `Bearer ${user.accessToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return newInstance;
};
