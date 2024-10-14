import { getPriceFailed, getPriceStart, getPriceSuccess } from "../store/reducers/priceSlice";

const getAllPrices = async (accessToken, axiosJWT, dispatch) => {
    dispatch(getPriceStart());
    try {
        const response = await axiosJWT.get(`/api/price/productPrice`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getPriceSuccess(response.data));
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Get all prices failed:', error);
        dispatch(getPriceFailed());
    }
};

export { getAllPrices };
