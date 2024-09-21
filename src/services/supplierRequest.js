
const getAllSuppliers = async (accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.get(`/api/supplier/get-suppliers`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Get all suppliers failed:', error);
    }
};

export { getAllSuppliers };