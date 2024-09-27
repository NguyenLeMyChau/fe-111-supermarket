
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

const getAllProducts = async (accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.get(`/api/product/get-products`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Get all products failed:', error);
    }
};

export { getAllCategories, getAllProducts };