// useFetchDataShop.js
import { useAccessToken, useAxiosJWT } from "../utils/axiosInstance";
import { getCartById } from "../services/cartRequest";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategoriesCustomer, getAllProductsCustomer } from "../services/productCustomerRequest";

const useCommonDataCustomer = () => {
    const dispatch = useDispatch();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();
    const user = useSelector((state) => state.auth?.login?.currentUser) || {};

    const fetchDataShop = async (setLoading) => {
        try {
            setLoading(true); // Bắt đầu loading
            await getAllCategoriesCustomer(dispatch);
            await getAllProductsCustomer(dispatch);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    const fetchDataCart = async (setLoading) => {
        try {
            setLoading(true); // Bắt đầu loading
            await getCartById(dispatch, accessToken, axiosJWT, user.id);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    }

    return { fetchDataShop, fetchDataCart };
};

export default useCommonDataCustomer;
