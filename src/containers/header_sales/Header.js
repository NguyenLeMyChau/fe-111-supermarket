import React from 'react';
import './Header.scss';

const Header = ({ supermarketName, address, employeeName }) => {
  // Lấy ngày tháng hiện tại
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="header">
      <div className="supermarket-info">
        <h1>{supermarketName}</h1>
        <p>{address}</p>
      </div>
      <div className="employee-info">
        <p>Nhân viên: {employeeName}</p>
        <p>Ngày hôm nay: {currentDate}</p>
      </div>
    </div>
  );
};

export default Header;
