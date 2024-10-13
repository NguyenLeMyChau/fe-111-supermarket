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

const addPromotionHeader = async (promotionData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/promotion/add-promotion`, promotionData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Add promotion header failed:', error);
        throw error;
    }
};

export { addPromotionHeader };

const addPromotionLine = async (promotionLineData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/promotion/add-promotion-line`, promotionLineData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Add promotion line failed:', error);
        throw error;
    }
};

export { addPromotionLine };

const addPromotionDetail = async (promotionDetailData, accessToken, axiosJWT) => {
    console.log(promotionDetailData)
    try {
        const response = await axiosJWT.post(`/api/promotion/add-promotion-detail`, promotionDetailData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Add promotion detail failed:', error);
        throw error;
    }
};

export { addPromotionDetail };


const updatePromotionHeader = async (promotionHeaderId, updatedData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/promotion/update-promotion-header/${promotionHeaderId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Update promotion header failed:', error);
        throw error;
    }
};

export { updatePromotionHeader };


const updatePromotionLine = async (promotionLineId, updatedData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/promotion/update-promotion-line/${promotionLineId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Update promotion line failed:', error);
        throw error;
    }
};
export { updatePromotionLine };

const updatePromotionDetail = async (promotionDetailId, updatedData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.put(`/api/promotion/update-promotion-detail/${promotionDetailId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Update promotion line failed:', error);
        throw error;
    }
};

export { updatePromotionDetail };


