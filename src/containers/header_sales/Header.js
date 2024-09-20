import React from 'react';
import './Header.scss';

const Header = ({ supermarketName, address, employeeName }) => {
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
      </div>
      <div className="staff-info">
        <p>Nhân viên: {employeeName}</p>
        <p>Ngày hôm nay: {currentDate}</p>
      </div>
    </div>
  );
};

export default Header;
