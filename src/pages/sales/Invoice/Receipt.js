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
      if(item.promotion.promotionLine_id.type === 'quantity') {
     
      const discountedPrice =  item?.quantity_donate * item.price;
      return {
        discountedPrice,
      };
    }
  }
    return { discountedPrice: 0};
  }
  ;
  const calculateDiscountAmount = (item) => {
    if (item.promotion && item.promotion.product_id?._id === item.product._id) {
      const discountQuantity = Math.floor(
        item.quantity / item.promotion.quantity
      );
      const discountedPrice = discountQuantity * item.promotion.amount_donate;
      return {
       
        discountedPrice,
       
      };
    }
    return { discountedPrice: 0};
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
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
  
            </tr>
          </thead>
          <tbody>
            {data.invoiceDetails.products.map((product, index) => {
                const isGift = product.promotion && product.quantity > product.quantity_donate; // Kiểm tra nếu số lượng mua lớn hơn số lượng tặng
              return (
              <React.Fragment key={index}>
                
                {product.promotion === null && (
          <>
          <tr>
            <td>{index + 1}</td>
            <td colSpan={4}>{product?.product?.name}</td>
          </tr>
          <tr>
            <td></td>
            <td>{product.unit_id.description}</td>
            <td>{product?.quantity}</td>
            <td>{formatCurrency(product?.price)}</td>
            <td>{formatCurrency(product?.quantity * product?.price)}</td>
          </tr>
          </>
          )}
            {isGift && (
               <>
               <tr>
              <td>{index + 1}</td>
              <td colSpan={4}>{product?.product?.name}</td>
            </tr>
            <tr>
            <td></td>
              <td>{product.unit_id.description}</td>
              <td>{formatCurrency(product.price)}</td>
              <td>{product.quantity - product.quantity_donate}</td> {/* Số lượng mua thêm */}
              <td>{formatCurrency(product.price * (product.quantity - product.quantity_donate))}</td> {/* Thành tiền cho số lượng mua thêm */}
            </tr>
            </>
          )}
           {product.promotion && product.promotion.promotionLine_id.type === 'quantity' && product.quantity_donate > 0 && (
             <>
            <tr className="promotion-row">
             <td>KM</td>
             <td colSpan={4}>{product?.promotion?.description} : {product?.product?.name}</td>
          </tr>
          <tr className="promotion-row">
          <td></td>
          <td>{product.unit_id.description}</td>
              <td>{formatCurrency(0)}</td>
              <td>{product.quantity_donate}</td>
              <td>{formatCurrency(0)}</td>
          </tr>
          </>
          )}
          {product.promotion && product.promotion.promotionLine_id.type === 'amount' && product.quantity > 0 && (
           
             <>
             <tr>
             <td>{index + 1}</td>
             <td colSpan={4}>{product?.promotion?.description} : {product?.product?.name}</td>
          </tr>
              <tr>
              <td></td>
              <td>{product.unit_id.description}</td>
              <td>{formatCurrency(product.price)}</td>
              <td>{product.quantity}</td>
              <td>{formatCurrency(product.price * product.quantity)}</td>
            </tr>
            <tr className="promotion-row">
            <td>KM</td>
            <td colSpan={4}>{product?.promotion?.description} : {product?.product?.name}</td>
          </tr>
          <tr className="promotion-row">
            <td></td>
              <td>{product.unit_id.description}</td>
              <td>-{formatCurrency(product.promotion.amount_donate)}</td> {/* Giá sau khi giảm */}
              <td>{product.quantity}</td>
              <td>-{formatCurrency((product.promotion.amount_donate) * product.quantity)}</td> {/* Thành tiền sau giảm */}
            </tr>
            </>
          )}
              </React.Fragment>
            )})}
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
