import React, { useEffect, useState, useMemo } from "react";
import "./Receipt.scss";
import { formatCurrency } from "../../../utils/fotmatDate";
import { getPromotions } from "../../../services/cartRequest";

const Receipt = ({ data }) => {
  const [promotion, setPromotion] = useState([]);
  const [discountTotal, setDiscountedTotal] = useState();
  const [appliedPromotion, setAppliedPromotion] = useState(null);
console.log(data);
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

  const calculateDiscount = (item) => {
    if (item.promotion) {
      const discountQuantity = Math.floor(
        item.quantity / (item.promotion.quantity + item.promotion.quantity_donate)
      );
      const quantity= item.quantity - discountQuantity;
      const discountedPrice = discountQuantity * item.price;
      return {
        quantity,
        discountedPrice,
        discountQuantity,
        price: item.price
      };
    }
    return {quantity:0, discountedPrice: 0, discountQuantity: 0 , price: 0};
  };
  const calculateDiscountAmount = (item) => {
    if (item.promotion && item.promotion.product_id?._id === item.product._id) {
      const discountQuantity = Math.floor(
        item.quantity / item.promotion.quantity
      );
      const discountedPrice = discountQuantity * item.promotion.amount_donate;
      return {
        quantity: item.quantity,
        discountedPrice,
        discountQuantity,
        price: item.promotion.amount_donate
      };
    }
    return {quantity:0, discountedPrice: 0, discountQuantity: 0 ,price: item.promotion.amount_donate};
  };


  const totalDiscountAmount = useMemo(() => {
    return data.invoiceDetails.products.reduce((total, item) => {
      if (item.promotion?.promotionLine_id?.type === "quantity") {
        // Tính giảm giá cho khuyến mãi số lượng
        return total + calculateDiscount(item).discountedPrice;
      } else if (item.promotion?.promotionLine_id?.type === "amount") {
        // Tính giảm giá cho khuyến mãi giá trị
        return total + calculateDiscountAmount(item).discountedPrice;
      }
      return total; // Không có khuyến mãi
    }, 0);
  }, [data.invoiceDetails.products]);
  

  const finalPaymentAmount = totalProductPrice - totalDiscountAmount;

  useEffect(() => {
    if (promotion.length > 0) {
      let currentTotal = finalPaymentAmount;
      const finalTotals = promotion.map((applicablePromotion) => {
        if (currentTotal > applicablePromotion.amount_sales) {
          const discountAmount =
            (currentTotal * applicablePromotion.percent) / 100;
          const limitedDiscount = Math.min(
            discountAmount,
            applicablePromotion.amount_limit
          );
          currentTotal -= limitedDiscount;
        }
        return currentTotal;
      });

      const minTotal = Math.min(...finalTotals);
      setDiscountedTotal(minTotal);
      setAppliedPromotion(
        minTotal !== finalPaymentAmount
          ? promotion[finalTotals.indexOf(minTotal)]
          : null
      );
    }
  }, [promotion, finalPaymentAmount]);

  return (
    <div className="receipt">
      <header className="receipt-header">
        <h2>Phiếu Thanh Toán Capy Smart</h2>
        <p>
          <strong>Nhân viên:</strong> {data.invoice.employee_id?.name}
        </p>
        <p>
          <strong>Thời gian:</strong>{" "}
          {new Date(data.invoice.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Mã hóa đơn:</strong> {data.invoice.invoiceCode}
        </p>
      </header>

      <section className="receipt-details">
        <h3>Chi tiết sản phẩm</h3>
        <table className="product-table-receipt">
          <thead>
            <tr>
            <th>STT</th>
              <th>Đơn vị</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
  
            </tr>
          </thead>
          <tbody>
            {data.invoiceDetails.products.map((item, index) => (
              <React.Fragment key={index}>
                
                {item.promotion ? (
                  <>
                   <tr>
                  <td>{index + 1}</td>
                  <td colSpan={4}>{item?.product?.name}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>{item.unit_id.description}</td>
                  <td>{item.promotion.promotionLine_id.type==="amount"?item?.quantity:calculateDiscount(item).quantity}</td>
                 
                  <td>{formatCurrency(item?.price)}</td>
                  <td>{item.promotion.promotionLine_id.type==="amount"?item?.quantity*item.price:calculateDiscount(item).quantity*item.price}</td>
               
                </tr>
                   <tr className="promotion-row">
                   <td>KM</td>
                   <td colSpan={4}>{item?.promotion?.description} : {item?.product?.name}</td>
                 </tr>
                  <tr className="promotion-row">
                    <td></td>
                    <td>{item.promotion?.promotionLine_id.type==="amount"?item.promotion?.unit_id?.description:item.promotion?.unit_id_donate?.description}</td>
                    <td>{item.promotion.promotionLine_id.type==="amount"? calculateDiscountAmount(item).discountQuantity :
                        calculateDiscount(item).discountQuantity}</td>
                   <td>
                      {item.promotion?.promotionLine_id?.type === "amount"
      ? `-${formatCurrency(calculateDiscountAmount(item).price)}`
      : formatCurrency(0)}
                      </td>
                    <td>
                      
                    {item.promotion?.promotionLine_id?.type === "amount"
    ? `-${formatCurrency(calculateDiscountAmount(item).discountedPrice)}`
    : formatCurrency(0)}
                    </td>
                  </tr>
                  </>
                ):(<>
                <tr>
                  <td>{index + 1}</td>
                  <td colSpan={4}>{item?.product?.name}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>{item.unit_id.description}</td>
                  <td>{item?.quantity}</td>
                  <td>{formatCurrency(item?.price)}</td>
                  <td>{formatCurrency(item?.quantity * item?.price)}</td>
                </tr>
                </>)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="receipt-footer">
        <div className="payment-line">
          <p>
            <strong>Tổng tiền:</strong>
          </p>
          <p className="amount">{formatCurrency(finalPaymentAmount)}</p>
        </div>
        {appliedPromotion && (
          <div className="payment-line">
            <p>
              <strong>Khuyến mãi ({appliedPromotion.description}):</strong>
            </p>
            <p className="amount">
              - {formatCurrency(finalPaymentAmount - discountTotal)}{" "}
            </p>
          </div>
        )}
        <div className="payment-line">
          <p>
            <strong>Thành tiền:</strong>
          </p>
          <p className="amount">{formatCurrency(discountTotal)}</p>
        </div>
        <div className="payment-line">
          <p>
            <strong>Phương thức thanh toán:</strong>
          </p>
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

export default Receipt;
