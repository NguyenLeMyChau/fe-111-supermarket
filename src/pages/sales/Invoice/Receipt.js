import React from "react";
import "./Receipt.scss";
import { formatCurrency } from "../../../utils/fotmatDate";

const Receipt = ({ data }) => {
  const calculateDiscountedPrice = (item) => {
    if (item.promotion && item.promotion.product_donate === item.promotion.product_id) {
      const discountQuantity = Math.floor(item.quantity / (item.promotion.quantity + item.promotion.quantity_donate));
      return (item.quantity - discountQuantity) * item.price;
    } else if (item.promotion && item.promotion.product_donate !== item.promotion.product_id) {
      const ProductSales = data.invoiceDetails.products.find(
        (product) => product.product._id === item.promotion.product_id
      );
      const discountQuantity = Math.floor(item.quantity / ProductSales.promotion.quantity);
      return discountQuantity * item.price;
    }
    return item.price * item.quantity;
  };

  const calculateDiscountedPriceAmount = (item) => {
    if (item.promotion && item.promotion.product_id === item.product._id) {
      const discountQuantity = Math.floor(item.quantity / item.promotion.quantity);
      return discountQuantity * item.promotion.amount_donate;
    }
    return 0;  // In case no discount is applicable
  };

  return (
    <div className="receipt">
      <header className="receipt-header">
        <h2>Hóa Đơn Thanh Toán</h2>
        <p><strong>Nhân viên:</strong> {data.invoice.employee_id.name}</p>
        <p><strong>Thời gian:</strong> {new Date(data.invoice.createdAt).toLocaleString()}</p>
      </header>

      <section className="receipt-details">
        <h3>Chi tiết sản phẩm</h3>
        <table className="product-table-receipt">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {data.invoiceDetails.products.map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{formatCurrency(item.quantity * item.price)}</td>
                </tr>
                {item.promotion && (
                  <tr className="promotion-row">
                    <td>KM</td>
                    <td>{item.promotion.product_donate.name}</td>
                    <td colSpan={2}>Khuyến mãi</td>
                    <td>
                      -{formatCurrency(
                        item.promotion.product_donate === item.promotion.product_id
                          ? calculateDiscountedPrice(item)
                          : calculateDiscountedPriceAmount(item)
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="receipt-footer">
        <p><strong>Tổng tiền:</strong> {formatCurrency(data.invoice.paymentAmount)}</p>
        <p><strong>Phương thức thanh toán:</strong> {data.invoice.paymentMethod}</p>
        <div className="footer-message">
          <p>Cảm ơn quý khách đã mua sắm tại cửa hàng chúng tôi!</p>
          <p>Hẹn gặp lại!</p>
        </div>
      </footer>
    </div>
  );
};

export default Receipt;
