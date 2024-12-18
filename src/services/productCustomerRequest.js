import axios from 'axios';
import { getCategoryCustomerStart, getCategoryCustomerSuccess, getCategoryCustomerFailed } from '../store/reducers/categoryCustomerSlice';
import { getProductCustomerFailed, getProductCustomerStart, getProductCustomerSuccess } from '../store/reducers/productCustomerSlice';

// const getAllCategoriesCustomer = async (dispatch) => {
//     dispatch(getCategoryCustomerStart());
//     try {
//         const response = await axios.get(`http://localhost:5000/api/auth/get-categories`);
//         console.log(response.data)
//         dispatch(getCategoryCustomerSuccess(response.data));
//         return response.data;
//     } catch (error) {
//         console.error('Get all categories failed:', error);
//         dispatch(getCategoryCustomerFailed());
//     }
// };

const getAllCategoriesCustomer = async (dispatch) => {
    dispatch(getCategoryCustomerStart());
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/get-products-with-price-and-promotion`);
        console.log(response.data)
        dispatch(getCategoryCustomerSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all categories failed:', error);
        dispatch(getCategoryCustomerFailed());
    }
};

const getAllProductsCustomer = async (dispatch) => {
    dispatch(getProductCustomerStart());
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/get-products-with-price-and-promotion-no-category`);
        console.log(response.data)
        dispatch(getProductCustomerSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all categories failed:', error);
        dispatch(getProductCustomerFailed());
    }
};

export { getAllCategoriesCustomer, getAllProductsCustomer };