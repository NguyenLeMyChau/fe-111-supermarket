import { getPriceFailed, getPriceStart, getPriceSuccess } from "../store/reducers/priceSlice";

const getAllPrices = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getPriceStart());
    try {
        const response = await axiosJWT.get(`/api/price/productPrice`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getPriceSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all prices failed:', error);
        dispatch(getPriceFailed());
    }
};

export { getAllPrices };

const addProductPrice = async (accessToken, axiosJWT,dispatch, newPriceData) => {
    dispatch(getPriceStart());
    try {
        const response = await axiosJWT.post(`/api/price/addPriceHeader`, newPriceData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getPriceSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Add product price failed:', error);
    }
};

export { addProductPrice };

const copyProductPrice = async (accessToken, axiosJWT,dispatch, productPriceData,id) => {
    dispatch(getPriceStart());
    try {
        const response = await axiosJWT.post(`/api/price/copyProductPrice`, {productPriceData,id}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getPriceSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Add product price failed:', error);
    }
};

export { copyProductPrice };

const addProductPriceDetail = async (accessToken, axiosJWT,dispatch, productPriceData) => {
    dispatch(getPriceStart());
    try {
        const response = await axiosJWT.post('/api/price/addPriceDetail', productPriceData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getPriceSuccess(response.data.data));
        return response.data; // or return response.data based on your backend response structure
    } catch (error) {
        throw error; // Handle error appropriately
    }
};
export {addProductPriceDetail};

const updateProductPrice = async (accessToken, axiosJWT,dispatch, priceId, updatedPriceData) => {
    dispatch(getPriceStart());
  try {
    const response = await axiosJWT.put(`/api/price/updatePriceHeader/${priceId}`, updatedPriceData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    dispatch(getPriceSuccess(response.data.allProductPrices));
    console.log( response.data)
    return response.data;
   
  } catch (error) {
    // If there is an error, dispatch the failure action
    console.error("Update product price failed:", error);
    dispatch(getPriceFailed());
  }
};

export { updateProductPrice };

export const updateProductPriceDetail = async (accessToken, axiosJWT,dispatch, priceData,priceDetailid) => {
    dispatch(getPriceStart());
    try {
        const response = await axiosJWT.put(`/api/price/updatePriceDetail/${priceDetailid}`, priceData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        dispatch(getPriceSuccess(response.data.data));
        return response.data;
    } catch (error) {
        console.error("Update product price failed:", error);
        dispatch(getPriceFailed());
    }
};

const getProductNoPrice = async (accessToken, axiosJWT,productPriceHeader_id) => {
    try {
        const response = await axiosJWT.get(`/api/price/getProductNoPrice`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                productPriceHeader_id
            }
        });  
        return response.data;
    } catch (error) {
        console.error('Get all prices failed:', error);
    }
};

export { getProductNoPrice };

const deleteProductPrice = async (accessToken, axiosJWT, dispatch, productPriceHeaderId) => {
    dispatch(getPriceStart());
    try {
        const response = await axiosJWT.delete(`/api/price/delete-header/${productPriceHeaderId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // Sau khi xóa thành công, cập nhật Redux store nếu cần thiết
        dispatch(getPriceSuccess(response.data.allProductPrices));
        console.log('ProductPriceHeader deleted:', response.data);
        return response.data;
    } catch (error) {
        console.error('Delete ProductPriceHeader failed:', error);
        dispatch(getPriceFailed());
        throw error;
    }
};

export { deleteProductPrice };

const deleteProductPriceDetail = async (accessToken, axiosJWT, dispatch,productPriceDetail_id) => {
    dispatch(getPriceStart());
    try {
        const response = await axiosJWT.delete(`/api/price/delete-detail/${productPriceDetail_id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getPriceSuccess(response.data.allProductPrices));
        console.log('ProductPriceDetail deleted:', response.data);
        return response.data;
    } catch (error) {
        console.error('Delete ProductPriceDetail failed:', error);
        throw error;
    }
};

export { deleteProductPriceDetail };