
const getAllEmployees = async (accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.get(`/api/employee/get-employees`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Get all categories failed:', error);
    }
};

export { getAllEmployees };