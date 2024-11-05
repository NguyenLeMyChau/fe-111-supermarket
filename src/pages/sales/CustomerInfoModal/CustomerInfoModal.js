import React, { useState, useEffect } from "react";
import "./CustomerInfoModal.scss";
import { getCustomerByPhone } from "../../../services/cartRequest";
import { useAccessToken, useAxiosJWT } from "../../../utils/axiosInstance";
import { clearCustomer, setCustomer } from "../../../store/reducers/productPaySlice";
import { useDispatch, useSelector } from "react-redux";

const CustomerInfoModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const storedCustomer = useSelector((state) => state.productPay.customer || null);
  
  useEffect(() => {
    // Update customerInfo when the modal opens
    if (isOpen && storedCustomer && Object.keys(storedCustomer).length > 0) {
      setCustomerInfo(storedCustomer);
      setPhone(storedCustomer.phone); // Set phone number if it's available
    }
  }, [isOpen, storedCustomer]);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleCheckPhone = async () => {
    if (!phone) {
      setError("Vui lòng nhập số điện thoại");
      return;
    }

    setError(null);
    try {
      const fetchedCustomer = await getCustomerByPhone(phone, accessToken, axiosJWT);
      if (fetchedCustomer) {
        console.log(fetchedCustomer);
        setCustomerInfo(fetchedCustomer);
      } else {
        setCustomerInfo(null);
        setError("Không tìm thấy thông tin khách hàng");
      }
    } catch (err) {
      console.error("Error fetching customer data:", err);
      setError("Có lỗi xảy ra");
    }
  };

  const handleSubmit = () => {
    dispatch(setCustomer({ customer: customerInfo }));
    onSubmit(customerInfo);
    setCustomerInfo(null);
    setPhone("");
    setError(null);
    onRequestClose();
  };

  const handleDelete = () => {
    dispatch(clearCustomer());
    setCustomerInfo(null);
    setError(null);
  };
  const handleClose = () => {
    setPhone("");
    setError(null);
    onRequestClose();
  };

  return (
    isOpen && (
      <div className="customer-info-modal-overlay">
        <div className="customer-info-modal">
          <h2>Thông tin khách hàng</h2>
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={phone}
            onChange={handlePhoneChange}
          />
          <button onClick={handleCheckPhone}>Kiểm tra</button>
          <button onClick={handleClose}>Đóng</button>
          
          {error && <div className="error-message">{error}</div>}

          {customerInfo ? (
            <>
              <div className="customer-info">
                <p>Tên khách hàng: {customerInfo.name}</p>
                <p>Email: {customerInfo.email}</p>
                <p>Số điện thoại: {customerInfo.phone}</p>
                <p>Điểm tích lũy: {customerInfo.loyaltyPoints}</p>
                <p>Giới tính: {customerInfo.gender ? "Nam" : "Nữ"}</p>
                <p>Địa chỉ: 
                  {`${customerInfo.address?.street || ""}, 
                    ${customerInfo.address?.ward || ""}, 
                    ${customerInfo.address?.district || ""}, 
                    ${customerInfo.address?.city || ""}`}
                </p>
              </div>
              <button onClick={handleSubmit}>Xác nhận</button>
              <button onClick={handleDelete}>Xóa</button>
            </>
          ) : null}
        </div>
      </div>
    )
  );
};

export default CustomerInfoModal;
