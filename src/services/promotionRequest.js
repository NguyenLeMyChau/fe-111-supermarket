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

const addPromotionDetail = async (promotionLineData, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/promotion/add-promotion-detail`, promotionLineData, {
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

export { addPromotionDetail };

