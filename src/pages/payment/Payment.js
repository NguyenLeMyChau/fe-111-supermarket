import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.scss';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productList, totalAmount } = location.state || { productList: [], totalAmount: 0 };

  const [customerPaid, setCustomerPaid] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const change = customerPaid > totalAmount ? customerPaid - totalAmount : 0;

  // Xử lý quay lại trang bán hàng
  const handleBack = () => {
    navigate('/');
  };

  // Xử lý thanh toán
  const handlePayment = () => {
    if (customerPaid < totalAmount) {
      alert('Số tiền trả không đủ.');
    } else {
      alert('Thanh toán thành công!');
      navigate('/');
    }
  };

  // Xử lý bàn phím để nhập số tiền khách trả
  const handleKeyPress = (value) => {
    setCustomerPaid((prev) => prev * 10 + value);
  };

  // Xóa hết số tiền đã nhập
  const handleClear = () => {
    setCustomerPaid(0);
  };

  // Xóa 1 số cuối cùng
  const handleDelete = () => {
    setCustomerPaid((prev) => Math.floor(prev / 10)); // Remove the last digit
  };

  return (
    <div className="payment-container">
      <div className="left-section">
        <h3>Chi tiết sản phẩm</h3>
        <table className="payment-product-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên sản phẩm</th>
              <th>Giá bán</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {productList.length > 0 ? (
              productList.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.price}đ</td>
                  <td>{product.quantity}</td>
                  <td>{product.price * product.quantity}đ</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-cart">Không có sản phẩm trong giỏ hàng</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="right-section">
        <h3>Thanh toán</h3>
        <div className="payment-info">
          <p><strong>Số tiền thanh toán:</strong> {totalAmount}đ</p>
          <p><strong>Số tiền khách trả:</strong> {customerPaid}đ</p>
          <p><strong>Tiền thối lại:</strong> {change}đ</p>

          <div className="payment-method-grid">
            {['Cash', 'ZaloPay', 'VNPay', 'Momo', 'Card', 'ShopeePay'].map((method) => (
              <button
                key={method}
                className={`payment-method-btn ${paymentMethod === method ? 'selected' : ''}`}
                onClick={() => setPaymentMethod(method)}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div className="payment-keypad-section">
          <input type="text" value={customerPaid} readOnly className="payment-keypad-input" placeholder="Nhập số tiền khách trả" />
          <div className="payment-keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button className='payment-button' key={num} onClick={() => handleKeyPress(num)}>{num}</button>
            ))}
            <button className='payment-button' onClick={() => handleKeyPress(0)}>0</button>
            <button className='payment-button' onClick={() => {handleKeyPress(0);handleKeyPress(0)}}>00</button> {/* Add '00' button */}
            <button className='payment-button' onClick={() =>  {handleKeyPress(0);handleKeyPress(0);handleKeyPress(0)}}>000</button> {/* Add '000' button */}
            <button className='payment-button' onClick={handleDelete}>⌫</button> {/* Add delete button */}
            <button className='payment-button' onClick={handleClear}>C</button>
            <button className='payment-button' onClick={handlePayment}>Thanh toán</button>
          </div>
          <button onClick={handleBack} className="back-btn">Quay lại</button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
