import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../store/reducers/authSlice';
import { createAxiosInstance } from './util';

export const useAxiosJWT = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth?.login?.currentUser) || {};

    const axiosJWT = createAxiosInstance(user, dispatch, loginSuccess);

    return axiosJWT;
};

export const useAccessToken = () => {
    const user = useSelector((state) => state.auth?.login?.currentUser) || {};
    return user.accessToken;
};