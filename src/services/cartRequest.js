import axios from "axios";
import { getCartFailed, getCartStart, getCartSuccess } from "../store/reducers/cartSlice";


const getCartById = async (dispatch, accessToken, axiosJWT, accountId) => {
    dispatch(getCartStart());
    try {
        const response = await axiosJWT.get(`/api/customer/get-cart-by-id?accountId=${accountId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getCartSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all carts failed:', error);
        dispatch(getCartFailed());
    }
};
const getPromotionByProductId = async (product_id) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/auth/get-promotion-by-product`, { product_id });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Get get-promotion-by-product failed:', error);
    }
}
const getPromotions= async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/auth/get-promotions`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Get get-promotion-by-product failed:', error);
    }
}


const addProductToCart = async (accessToken, axiosJWT, accountId, productId, quantity, total) => {
    try {
        const response = await axiosJWT.post(`/api/customer/add-product-to-cart`, {
            accountId,
            productId,
            quantity,
            total,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Thêm sản phẩm vào giỏ hàng thành công');
        return response.data;
    } catch (error) {
        console.error('Add product to cart failed:', error);
        alert('Thêm sản phẩm vào giỏ hàng thất bại ', error);
    }
}

const payCart = async (navigation, accessToken, axiosJWT, customerId, products,paymentMethod,paymentInfo,paymentAmount) => {
    try {
        const response = await axiosJWT.post(`/api/customer/pay-cart`, {
            customerId,
            products,
            paymentMethod,
            paymentInfo,
            paymentAmount
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Thanh toán giỏ hàng thành công');
        navigation.navigate('OrderSuccess');
        return response.data;
    } catch (error) {
        console.error('Pay cart failed:', error);
        alert('Thanh toán giỏ hàng thất bại ', error);
    }

}

const updateCart = async (accountId, productList, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/customer/update-cart`, {
            accountId,
            productList,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Update cart failed:', error);
    }
}

const removeProductCart = async (accountId, productId, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/customer/remove-product-cart`, {
            accountId,
            productId,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Remove product cart failed:', error);
    }
}

const updateProductCart = async (accountId, productId, quantity, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/customer/update-product-cart`, {
            accountId,
            productId,
            quantity,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Cập nhật giỏ hàng thành công');
        return response.data;
    } catch (error) {
        console.error('Update product cart failed:', error);
    }
}

const checkStockQuantityInCart = async (item_code, quantity, accessToken, axiosJWT) => {
    try {
        // Gửi yêu cầu GET với item_code và quantity qua query params
        const response = await axiosJWT.get(`/api/customer/check-stock-quantity-in-cart`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: { // Thêm params ở đây
                item_code: item_code,
                quantity: quantity
            }
        });
        console.log('response.data', response.data)
        return response.data;
    } catch (error) {
        console.error('Check stock quantity failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}



export {
    getCartById,
    addProductToCart,
    payCart,
    updateCart,
    removeProductCart,
    updateProductCart,
    getPromotionByProductId,
    checkStockQuantityInCart,
    getPromotions
}