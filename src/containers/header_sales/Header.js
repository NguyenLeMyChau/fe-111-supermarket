import React, { useEffect, useState } from 'react';
import './Header.scss';
import { useSelector } from 'react-redux';

const Header = ({ supermarketName, address, employeeName }) => {
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  const customer = useSelector((state) => state.productPay.customer); // Lấy thông tin khách hàng từ Redux
  const [customerInfo, setCustomerInfo] = useState(null);

  useEffect(() => {
    // Cập nhật thông tin khách hàng mỗi khi thông tin khách hàng trong Redux thay đổi
    if (customer) {
      setCustomerInfo(customer);
    }else setCustomerInfo(null)
  }, [customer]); // Chạy mỗi khi customer thay đổi

  // Lấy ngày tháng hiện tại và định dạng theo ngày/tháng/năm
  const currentDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="staff-header">
      <div className="staff-supermarket-info">
        <h1>{supermarketName}</h1>
        <p>{address}</p>
        <p>Ngày hôm nay: {currentDate}</p>
      </div>
      <div className="staff-info">
        <p>Nhân viên: {currentUser?.user?.name}</p>
        <p>Mã nhân viên: {currentUser?.user?.employee_id}</p>
        {customerInfo && <p>Khách hàng: {customerInfo?.name}</p>}
      </div>
    </div>
  );
};

export default Header;
