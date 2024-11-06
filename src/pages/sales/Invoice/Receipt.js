import React from "react";
import "./Receipt.scss";
const Receipt = ({ data }) => {
  return (
    <div className="receipt">
      <h2>Hóa Đơn Thanh Toán</h2>
      <p><strong>Nhân viên:</strong> {data.cashierName}</p>
      <p><strong>Thời gian:</strong> {new Date(data.transactionTime).toLocaleString()}</p>
      <p><strong>Số hóa đơn:</strong> {data.receiptNumber}</p>

      <h3>Chi tiết sản phẩm</h3>
      <table>
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price}đ</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p><strong>Tổng tiền:</strong> {data.total}đ</p>
      <p><strong>Phương thức thanh toán:</strong> {data.paymentMethod}</p>
      <p><strong>Mật khẩu WiFi:</strong> {data.wifiPassword}</p>

      <div className="footer">
        <p>Cảm ơn quý khách đã mua sắm tại cửa hàng chúng tôi!</p>
        <p>Hẹn gặp lại!</p>
      </div>
    </div>
  );
};

export default Receipt;
