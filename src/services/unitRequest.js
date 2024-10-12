
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

const getUnitById = async (unitId, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.get(`/api/unit/get-unit/${unitId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Get unit by id failed:', error);
    }
};

export { getAllUnit, getUnitById };