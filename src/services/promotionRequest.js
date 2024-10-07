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