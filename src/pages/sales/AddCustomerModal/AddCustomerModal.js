// AddCustomerModal.js
import React, { useState } from "react";

const AddCustomerModal = ({ isOpen, onClose, onSubmit }) => {
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  const handleSubmit = () => {
    // Xử lý khi thông tin khách hàng được submit
    onSubmit(customerData);
    onClose(); // Đóng modal sau khi submit
  };

  if (!isOpen) return null;

  return (
    <div className="customer-info-modal-overlay">
        <div className="customer-info-modal">
        <h2>Thêm Khách Hàng</h2>
        <input
          type="text"
          name="name"
          placeholder="Tên khách hàng"
          value={customerData.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={customerData.phone}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={customerData.email}
          onChange={handleInputChange}
        />
        <button onClick={handleSubmit}>Lưu</button>
        <button onClick={onClose}>Hủy</button>
      </div>
    </div>
  );
};

export default AddCustomerModal;
