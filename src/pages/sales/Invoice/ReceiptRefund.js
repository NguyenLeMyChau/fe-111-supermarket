import React, { useEffect, useState, useMemo } from "react";
import "./Receipt.scss";
import { formatCurrency } from "../../../utils/fotmatDate";
import { getPromotions } from "../../../services/cartRequest";

const ReceiptRefund = ({ data }) => {
  const [promotion, setPromotion] = useState([]);
  const [discountTotal, setDiscountedTotal] = useState();
  const [appliedPromotion, setAppliedPromotion] = useState(null);
console.log(data)
  // Fetch promotions on component mount
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await getPromotions();
        if (response) {
          const percentagePromotions = response.filter(
            (promo) => promo.promotionLine_id.type === "percentage"
          );
          setPromotion(percentagePromotions);
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };
    fetchPromotions();
  }, []);

  // Calculate total product price and discount amount
  const totalProductPrice = useMemo(() => {
    return data.invoiceDetails.products.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  }, [data.invoiceDetails.products]);

  const calculateDiscountedPrice = (item) => {
    if (item.promotion) {
      const discountQuantity = Math.floor(item.quantity / (item.promotion.quantity + item.promotion.quantity_donate));
      return (item.quantity - discountQuantity) * item.price;
    }
    return 0;
  };

  const calculateDiscountedPriceAmount = (item) => {
    if (item.promotion && item.promotion.product_id?._id === item.product._id) {
      const discountQuantity = Math.floor(item.quantity / item.promotion.quantity);
      return discountQuantity * item.promotion.amount_donate;
    }
    return 0;
  };

  const totalDiscountAmount = useMemo(() => {
    return data.invoiceDetails.products.reduce((total, item) => {
      return total + (calculateDiscountedPrice(item) || calculateDiscountedPriceAmount(item));
    }, 0);
  }, [data.invoiceDetails.products]);

  const finalPaymentAmount = totalProductPrice - totalDiscountAmount;

  useEffect(() => {
    if (promotion.length > 0) {
      let currentTotal = finalPaymentAmount;
      const finalTotals = promotion.map((applicablePromotion) => {
        if (currentTotal > applicablePromotion.amount_sales) {
          const discountAmount = (currentTotal * applicablePromotion.percent) / 100;
          const limitedDiscount = Math.min(discountAmount, applicablePromotion.amount_limit);
          currentTotal -= limitedDiscount;
        }
        return currentTotal;
      });

      const minTotal = Math.min(...finalTotals);
      setDiscountedTotal(minTotal);
      setAppliedPromotion(minTotal !== finalPaymentAmount ? promotion[finalTotals.indexOf(minTotal)] : null);
    }
  }, [promotion, finalPaymentAmount]);

  return (
    <div className="receipt">
      <header className="receipt-header">
        <h2>Phiếu Hoàn Trả Capy Smart</h2>
        <p><strong>Nhân viên:</strong> {data.invoice.employee_id?.name}</p>
        <p><strong>Thời gian:</strong> {new Date(data.invoice.createdAt).toLocaleString()}</p>
        <p><strong>Mã hóa đơn thanh toán:</strong> {data.invoice.invoiceCode}</p>
        <p><strong>Mã hóa đơn hoàn trả:</strong> {data.invoice.invoiceCodeSale}</p>
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
                    <td colSpan={2}>{item.promotion.description}</td>
                    <td>
                      -{formatCurrency(
                        calculateDiscountedPrice(item) || calculateDiscountedPriceAmount(item)
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
        <div className="payment-line">
          <p><strong>Tổng tiền:</strong></p>
          <p className="amount">{formatCurrency(finalPaymentAmount)}</p>
        </div>
        {appliedPromotion && (
          <div className="payment-line">
            <p><strong>Khuyến mãi ({appliedPromotion.description}):</strong></p>
            <p className="amount">- {formatCurrency(finalPaymentAmount - discountTotal)} </p>
          </div>
        )}
        <div className="payment-line">
          <p><strong>Trả lại:</strong></p>
          <p className="amount">{formatCurrency(discountTotal)}</p>
        </div>
        <div className="payment-line">
          <p><strong>Phương thức thanh toán:</strong></p>
          <p className="amount">{data.invoice.paymentMethod}</p>
        </div>
      
        <div className="footer-message">
          <p>Cảm ơn quý khách đã mua sắm tại cửa hàng chúng tôi!</p>
          <p>Hẹn gặp lại!</p>
        </div>
      </footer>
    </div>
  );
};

export default ReceiptRefund;
