
const getAllCategories = async (accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.get(`/api/product/get-categories`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Get all categories failed:', error);
    }
};

export { getAllCategories };