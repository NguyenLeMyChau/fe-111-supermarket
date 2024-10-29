import { useDispatch, useSelector } from "react-redux";
import { useAccessToken, useAxiosJWT } from "../utils/axiosInstance";
import { getInvoicesByAccountId, updateCustomerInfo } from "../services/userCustomerRequest";
import { useNavigate } from "react-router";

const useUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();
    const user = useSelector((state) => state.auth?.login?.currentUser);

    const updateUser = async (accountId, customerInfo) => {
        await updateCustomerInfo(accountId, customerInfo, navigate, accessToken, axiosJWT);
    }

    const getInvoice = async () => {
        await getInvoicesByAccountId(user.id, accessToken, axiosJWT, dispatch);
    }

    return { updateUser, getInvoice };
}

export default useUser;
