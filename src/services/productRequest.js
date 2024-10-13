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

const addCategory = async (categoryData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/product/add-category`, categoryData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Thêm thành công loại sản phẩm mới');
        return response.data;
    }
    catch (error) {
        console.error('Add category failed:', error);
    }
}

const updateCategory = async (categoryId, categoryData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/product/update-category/${categoryId}`, categoryData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Cập nhật thành công loại sản phẩm');
        return response.data;
    }
    catch (error) {
        console.error('Update category failed:', error);
    }
}


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

const getProductsDetail = async (accessToken, axiosJWT, productId) => {
    try {
        const response = await axiosJWT.get(`/api/product/get-product-detail/${productId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Get product detail failed:', error);
    }
}
const addProductWithWarehouse = async (productData, accessToken, axiosJWT, onClose) => {
    try {
        const response = await axiosJWT.post(`/api/product/add-product`, productData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Thêm thành công sản phẩm mới');
        onClose();
        return response.data;
    } catch (error) {
        console.error('Add product failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

const updateProduct = async (productId, productData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/product/update-product/${productId}`, productData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Cập nhật thành công sản phẩm');
        return response.data;
    } catch (error) {
        console.error('Update product failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}

export {
    getAllCategories, addCategory, updateCategory,
    getAllProducts, getProductsDetail, addProductWithWarehouse, updateProduct
};