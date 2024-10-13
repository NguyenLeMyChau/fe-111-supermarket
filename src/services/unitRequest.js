import { getUnitFailed, getUnitStart, getUnitSuccess } from "../store/reducers/unitSlice";

const getAllUnit = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getUnitStart());
    try {
        const response = await axiosJWT.get(`/api/unit/get-units`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getUnitSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all unit failed:', error);
        dispatch(getUnitFailed());
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