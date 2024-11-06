import React from "react";
import "./Receipt.scss";
const Receipt = ({ data }) => {
  console.log(data);
  return (
    <div className="receipt">
      <h2>Hóa Đơn Thanh Toán</h2>
      <p><strong>Nhân viên:</strong> {data.invoice.employee_id.name}</p>
      <p><strong>Thời gian:</strong> {new Date(data.invoice.createdAt).toLocaleString()}</p>
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
          {data.invoiceDetails.products.map((item, index) => (
            <tr key={index}>
              <td>{item.product.name}</td>
              <td>{item.product.quantity}</td>
              <td>{item.product.price}đ</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p><strong>Tổng tiền:</strong> {data.invoice.paymentAmount}đ</p>
      <p><strong>Phương thức thanh toán:</strong> {data.invoice.paymentMethod}</p>

      <div className="footer">
        <p>Cảm ơn quý khách đã mua sắm tại cửa hàng chúng tôi!</p>
        <p>Hẹn gặp lại!</p>
      </div>
    </div>
  );
};

export default Receipt;
