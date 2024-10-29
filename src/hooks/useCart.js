import { useSelector } from "react-redux";
import { addProductToCart, checkStockQuantityInCart, payCart, updateProductCart } from "../services/cartRequest";
import { useState } from "react";
import useCommonDataCustomer from '../hooks/useCommonDataCustomer';
import { useAccessToken, useAxiosJWT } from "../utils/axiosInstance";
import { useNavigate } from "react-router";

const useCart = () => {
    const navigate = useNavigate();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();
    const { fetchDataCart } = useCommonDataCustomer();

    const user = useSelector((state) => state.auth?.login?.currentUser) || {};
    const [setLoadingCart] = useState(false);

    const addCart = async (productId, unitId, quantity, total) => {
        await addProductToCart(accessToken, axiosJWT, user.id, productId, unitId, quantity, total);
        // await fetchDataCart(setLoadingCart);
    }

    const updateProductToCart = async (productId, quantity, total) => {
        await updateProductCart(user.id, productId, quantity, total, accessToken, axiosJWT);
        await fetchDataCart(setLoadingCart);
    }

    const payProductInCart = async (customerId, products) => {
        await payCart(navigate, accessToken, axiosJWT, customerId, products);
    }

    const checkStockQuantity = async (item_code, quantity) => {
        await checkStockQuantityInCart(item_code, quantity, accessToken, axiosJWT);
    }

    return { addCart, payProductInCart, updateProductToCart, checkStockQuantity };
}

export default useCart;
