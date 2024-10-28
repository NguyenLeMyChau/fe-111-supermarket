import { useSelector } from "react-redux";
import { useAccessToken, useAxiosJWT } from "../util/axiosInstance";
import { useNavigation } from "@react-navigation/native";
import { getInvoicesByAccountId, updateCustomerInfo } from "../services/userRequest";

const useUser = () => {
    const navigation = useNavigation();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();
    const user = useSelector((state) => state.auth?.login?.currentUser);

    const updateUser = async (accountId, customerInfo) => {
        await updateCustomerInfo(accountId, customerInfo, navigation, accessToken, axiosJWT);
    }

    const getInvoice = async () => {
        await getInvoicesByAccountId(user.id, accessToken, axiosJWT);
    }

    return { updateUser, getInvoice };
}

export default useUser;
