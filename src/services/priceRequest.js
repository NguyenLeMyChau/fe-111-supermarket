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

const addProductPrice = async (accessToken, axiosJWT, newPriceData) => {
    try {
        const response = await axiosJWT.post(`/api/price/addPriceHeader`, newPriceData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Add product price failed:', error);
    }
};

export { addProductPrice };

const addProductPriceDetail = async (accessToken, axiosJWT, productPriceData) => {
    try {
        const response = await axiosJWT.post('/api/price/addPriceDetail', productPriceData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data; // or return response.data based on your backend response structure
    } catch (error) {
        throw error; // Handle error appropriately
    }
};
export {addProductPriceDetail};

const updateProductPrice = async (accessToken, axiosJWT, priceId, updatedPriceData) => {
  try {
    const response = await axiosJWT.put(`/api/price/updatePriceHeader/${priceId}`, updatedPriceData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    // If there is an error, dispatch the failure action
    console.error("Update product price failed:", error);
  }
};

export { updateProductPrice };

export const updateProductPriceDetail = async (accessToken, axiosJWT, priceData,priceDetailid) => {
    try {
        const response = await axiosJWT.put(`/api/price/updatePriceDetail/${priceDetailid}`, priceData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error updating product price detail: ' + error.message);
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