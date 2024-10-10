
const getAllUnit = async (accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.get(`/api/unit/get-units`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Get all unit failed:', error);
    }
};

export { getAllUnit };