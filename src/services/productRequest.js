import { getCategoryFailed, getCategoryStart, getCategorySuccess } from "../store/reducers/categorySlice";
import { getProductFailed, getProductStart, getProductSuccess } from "../store/reducers/productSlice";

const getAllCategories = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getCategoryStart());
    try {
        const response = await axiosJWT.get(`/api/product/get-categories`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getCategorySuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all categories failed:', error);
        dispatch(getCategoryFailed());
    }
};

const getAllProducts = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getProductStart());
    try {
        const response = await axiosJWT.get(`/api/product/get-products`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getProductSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all products failed:', error);
        dispatch(getProductFailed());
    }
};

export { getAllCategories, getAllProducts };