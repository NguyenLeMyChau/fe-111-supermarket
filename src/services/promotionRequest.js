
const getAllPromotions = async (accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.get(`/api/promotion/get-promotions`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Get all promotions failed:', error);
    }
};

export { getAllPromotions };