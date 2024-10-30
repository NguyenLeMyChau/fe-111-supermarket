import { getPromotionFailed, getPromotionStart, getPromotionSuccess } from "../store/reducers/promotionSlice";

const getAllPromotions = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getPromotionStart());
    try {
        const response = await axiosJWT.get(`/api/promotion/get-promotions`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getPromotionSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all promotions failed:', error);
        dispatch(getPromotionFailed());
    }
};

export { getAllPromotions };

const addPromotionHeader = async (promotionData, accessToken,dispatch, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/promotion/add-promotion`, promotionData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }); 
        dispatch(getPromotionStart());
        dispatch(getPromotionSuccess(response.data.data));
        return response.data;
    } catch (error) {
        console.error('Add promotion header failed:', error);
        dispatch(getPromotionFailed());
        throw error;
    }
};

export { addPromotionHeader };

const addPromotionLine = async (promotionLineData,dispatch, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/promotion/add-promotion-line`, promotionLineData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getPromotionStart());
        dispatch(getPromotionSuccess(response.data.data));
        return response.data;
    } catch (error) {
        console.error('Add promotion line failed:', error);
        dispatch(getPromotionFailed());
        throw error;
    }
};

export { addPromotionLine };

const addPromotionDetail = async (promotionDetailData, dispatch,accessToken, axiosJWT) => {
    console.log(promotionDetailData)
    try {
        const response = await axiosJWT.post(`/api/promotion/add-promotion-detail`, promotionDetailData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }); 
        dispatch(getPromotionStart());
        dispatch(getPromotionSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Add promotion detail failed:', error);
        dispatch(getPromotionFailed());
        throw error;
    }
};

export { addPromotionDetail };


const updatePromotionHeader = async (promotionHeaderId, updatedData,dispatch, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/promotion/update-promotion-header/${promotionHeaderId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getPromotionStart());
        dispatch(getPromotionSuccess(response.data.data));
        return response.data;
    } catch (error) {
        console.error('Update promotion header failed:', error);
        dispatch(getPromotionFailed());
        throw error;
    }
};

export { updatePromotionHeader };


const updatePromotionLine = async (promotionLineId,dispatch, updatedData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/promotion/update-promotion-line/${promotionLineId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getPromotionStart());
        dispatch(getPromotionSuccess(response.data.data));
        return response.data;
    } catch (error) {
        console.error('Update promotion line failed:', error);
        dispatch(getPromotionFailed());
        throw error;
    }
};
export { updatePromotionLine };

const updatePromotionDetail = async (promotionDetailId, updatedData,dispatch, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/promotion/update-promotion-detail/${promotionDetailId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getPromotionStart());
        dispatch(getPromotionSuccess(response.data.data));
        return response.data;
    } catch (error) {
        console.error('Update promotion line failed:', error);
        dispatch(getPromotionFailed());
        throw error;
    }
};

export { updatePromotionDetail };

const deletePromotionLine = async (promotionLineId, accessToken,dispatch, axiosJWT) => {
    try {
        dispatch(getPromotionStart());
        const response = await axiosJWT.delete(`/api/promotion/delete-promotion-line/${promotionLineId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });  
        dispatch(getPromotionSuccess(response.data.data));
        return response.data;
    } catch (error) {
        console.error('Delete promotion line failed:', error);
        dispatch(getPromotionFailed());
        throw error;
    }
};

export { deletePromotionLine };
const deletePromotionDetail = async (promotionDetailId, accessToken,dispatch, axiosJWT) => {
    try {
        dispatch(getPromotionStart());
        const response = await axiosJWT.delete(`/api/promotion/delete-promotion-detail/${promotionDetailId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getPromotionSuccess(response.data.data));
        return response.data;
    } catch (error) {
        console.error('Delete promotion detail failed:', error);
        dispatch(getPromotionFailed());
        throw error;
    }
};

export { deletePromotionDetail };
const deletePromotionHeader = async (promotionHeaderId, accessToken, dispatch, axiosJWT) => {
    dispatch(getPromotionStart());
    try {
        const response = await axiosJWT.delete(`/api/promotion/delete-promotion-header/${promotionHeaderId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getPromotionSuccess(response.data.data));
        return response.data;
    } catch (error) {
        console.error('Delete promotion header failed:', error);
        dispatch(getPromotionFailed());
        throw error;
    }
};

export { deletePromotionHeader };

