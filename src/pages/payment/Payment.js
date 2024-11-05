import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.scss";
import { useDispatch, useSelector } from "react-redux";
import { clearProductPay } from "../../store/reducers/productPaySlice";
import axios from "axios";
import { getPromotionByProductId, getPromotions, payCart } from "../../services/cartRequest";
import Modal from "../../components/modal/Modal";
import { green } from "@mui/material/colors";
import { useAccessToken, useAxiosJWT } from "../../utils/axiosInstance";
const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const productList = useSelector((state) => state.productPay.productPay);
  const [totalAmount, setTotalAmount] = useState(
    useSelector((state) => state.productPay.totalAmount)
  );
  const customer = useSelector((state) => state.productPay.customer) || {};
  console.log(customer)
  const [promotion, setPromotion] = useState([]);
  const [customerPaid, setCustomerPaid] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [productWithPromotions, setProductWithPromotions] = useState([]);
  const change = customerPaid > totalAmount ? customerPaid - totalAmount : 0;
  const [showIneligibleModal, setShowIneligibleModal] = useState(false); // State to show/hide modal
  const [discountedTotal, setDiscountedTotal] = useState(totalAmount);
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [ineligiblePromotions, setIneligiblePromotions] = useState([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await getPromotions();
        if (response) {
          // Lọc ra những khuyến mãi có type là 'percentage'
          const percentagePromotions = response.filter(
            (promo) => promo.promotionLine_id.type === "percentage"
          );
          console.log(percentagePromotions)
          setPromotion(percentagePromotions);
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchPromotions();
    const fetchProductPromotions = async () => {
      const ineligible = [];
      let updatedTotalAmount = totalAmount; // Biến tạm để tính tổng sau khi áp dụng khuyến mãi

      const productPromises = productList.map(async (product) => {
        const promotions = await getPromotionByProductId(
          product._id,
          product.unit._id
        );
        console.log(product)
        console.log(promotions)
        if (promotions && promotions.length > 0) {
          const applicablePromotions = promotions.map((promotion) => {
            console.log(promotion)
            const promotionLine = promotion.promotionLine_id;
            if (promotionLine) {
              if (promotionLine.type === 'quantity') {
                // Trường hợp 1: product_id === promotion.product_id === promotion.product_donate
                if (product._id === promotion.product_id && product._id === promotion.product_donate) {
                  const totalQuantity = promotion.quantity + promotion.quantity_donate;
                  const eligibleQuantity = Math.floor(product.quantity / totalQuantity);
                  console.log('Eligible Quantity (same product):', eligibleQuantity);
                  
                  if (eligibleQuantity < 1) {
                    // Thêm vào danh sách không đủ điều kiện
                    ineligible.push({
                      ...product,
                      promotion,
                      message: 'Khuyến mãi chưa được áp dụng: số lượng không đủ.',
                      requiredQuantity: totalQuantity,
                    });
                    return { ...product, promotion: null }; // Không có khuyến mãi
                  }
                  updatedTotalAmount -=product.price.price* eligibleQuantity
                  return { ...product, promotion,discountAmount:product.price.price* eligibleQuantity}; // Có khuyến mãi
  
                // Trường hợp 2: product_id === promotion.product_id và product_id !== promotion.product_donate
                } else if (product._id === promotion.product_id && product._id !== promotion.product_donate) {
                  const eligibleQuantity = Math.floor(product.quantity / promotion.quantity);
                  const donateProductExists = productList.some(p => p._id === promotion.product_donate && p.unit === promotion.unit_id_donate);
                  console.log('Eligible Quantity (different donate product):', eligibleQuantity);
  
                  if (!donateProductExists) {
                    // Thêm vào danh sách không đủ điều kiện
                    ineligible.push({
                      ...donateProductExists,
                      promotion,
                      requiredQuantity: promotion.quantity_donate,
                    });
                    return { ...product, promotion: null }; // Không có khuyến mãi
                  }else if (eligibleQuantity < 1 ) {
                    // Thêm vào danh sách không đủ điều kiện
                    ineligible.push({
                      ...product,
                      promotion,
                      requiredQuantity: promotion.quantity,
                    });
                    return { ...product, promotion: null };}
                  else
                  return { ...product, promotion:null }; // Có khuyến mãi
  
                // Trường hợp 3: product_id !== promotion.product_id và product_id === promotion.product_donate
                } else if (product._id !== promotion.product_id && product._id === promotion.product_donate) {
                  const promotionProductExists = productList.some(p => p._id === promotion.product_id&& p.unit===promotion.unit_id);
                  const eligibleQuantity = Math.floor(product.quantity / promotion.quantity);
                  console.log('Eligible Quantity (donate product):', eligibleQuantity);
  
                  if (!promotionProductExists || eligibleQuantity < 1) {
                    ineligible.push({
                      ...promotionProductExists,
                      promotion,
                      requiredQuantity: promotion.quantity,
                    });
                    return { ...product, promotion: null }; // Không có khuyến mãi
                  }
                  updatedTotalAmount -=product.price.price* eligibleQuantity
                  return { ...product, promotion,discountAmount:product.price.price* eligibleQuantity}; // Có khuyến mãi

                }
              }
            if (promotionLine.type === "amount") {
              const eligibleQuantity = Math.floor(
                product.quantity / promotion.quantity
              );
              const discountAmount =
                eligibleQuantity >= 1
                  ? eligibleQuantity * promotion.amount_donate
                  : 0;

              if (eligibleQuantity >= 1) {
                updatedTotalAmount -= discountAmount; // Trừ discount vào tổng tiền
                return { ...product, promotion, discountAmount };
              } else {
                ineligible.push({
                  ...product,
                  promotion,
                  requiredQuantity: promotion.quantity,
                });
              }
            }
            return { ...product, promotion: null };
        }});
          return applicablePromotions;
        }
        return [{ ...product, promotion: null }];
      });

      const productsWithPromotions = await Promise.all(productPromises);
      console.log(productsWithPromotions)
      setProductWithPromotions(productsWithPromotions.flat());
      setIneligiblePromotions(ineligible);
      setShowIneligibleModal(ineligible.length > 0?true:false);
      setTotalAmount(updatedTotalAmount); 
    };

    fetchProductPromotions();
  }, [productList]);

  useEffect(() => {
    // Tính toán tổng tiền đã giảm mỗi khi promotion thay đổi
    if (promotion?.length > 0) {
      let currentTotal = totalAmount; // Bắt đầu từ tổng ban đầu
      const finalTotals = promotion.map((applicablePromotion) => {
        // Kiểm tra điều kiện để áp dụng khuyến mãi
        if (currentTotal > applicablePromotion.amount_sales) {
          const discountAmount =
            (currentTotal * applicablePromotion.percent) / 100;
          const amountLimit = applicablePromotion.amount_limit;

          // Giảm giá không vượt quá amount_limit
          if (discountAmount > amountLimit) {
            currentTotal -= amountLimit;
          } else {
            currentTotal -= discountAmount;
          }
        } else {
          // Nếu không đủ điều kiện, giữ nguyên currentTotal
          currentTotal = totalAmount;
        }

        console.log(currentTotal);
        return currentTotal;
      });
      const minTotal = Math.min(...finalTotals);
      console.log(minTotal);
      console.log(totalAmount);
      if (minTotal === totalAmount) {
        setDiscountedTotal(totalAmount);
        setAppliedPromotion(null);
      }else{  
        
        setDiscountedTotal(minTotal);
        const bestPromotion = promotion[finalTotals.indexOf(minTotal)];
        setAppliedPromotion(bestPromotion);}
    }
  }, [promotion, totalAmount]);

  const closeModal = () => {
    setShowIneligibleModal(false);
  };
  // Xử lý quay lại trang bán hàng
  const handleBack = () => {
    navigate("/frame-staff/stall");
  };

  // Xử lý thanh toán
  const handlePayment = async () => {
    const isConfirmed = window.confirm('Bạn có chắc chắn thanh toán');
    if (!isConfirmed) return;

    if (customerPaid < totalAmount) {
      alert("Số tiền trả không đủ.");
      return;
    }

    const paymentInfo = null;
    console.log(productWithPromotions)
    try {
      const response = await payCart(
        accessToken,
        axiosJWT,
        customer?._id,
        productWithPromotions,
        paymentMethod,
        paymentInfo,
        discountedTotal
      );
console.log(response)
      if (response?.success) {
        alert("Thanh toán thành công!");
        dispatch(clearProductPay());
        navigate("/frame-staff/stall");
      } else {
        alert(response?.message || "Thanh toán thất bại!");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
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
    setCustomerPaid((prev) => Math.floor(prev / 10));
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
              <th>Đơn vị</th>
              <th>Giá bán</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
             
            </tr>
          </thead>
          <tbody>
            {productWithPromotions.length > 0 ? (
              productWithPromotions.map((product, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.unit.description}</td>
                    <td>{product.price.price}đ</td>
                    <td>{product.quantity}</td>
                    <td>{product.price.price * product.quantity}đ</td>
                  </tr>
                  {product.promotion && ( // Kiểm tra xem có khuyến mãi không
                    <tr>
                      <td colSpan="1">
                        {"KM"}
                      </td>
                      <td>{product.promotion?.description}</td>
                      <td colSpan="1"></td>
                      <td colSpan="1"></td>
                      <td colSpan="1"></td>
                    <td>-{product.discountAmount}đ</td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-cart">
                  Không có sản phẩm trong giỏ hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="right-section">
  <h3>Thanh toán</h3>
  <div className="payment-info">
    <div className="payment-line">
      <p><strong>Tổng số tiền sản phẩm:</strong></p>
      <p className="amount">{totalAmount} đ</p>
    </div>

    {appliedPromotion && (
      <div className="payment-line">
        <p><strong>Khuyến mãi ({appliedPromotion.description}):</strong></p>
        <p className="amount">- {totalAmount-discountedTotal} đ</p>
      </div>
    )}

    <div className="payment-line total-due">
      <p><strong>Tổng số tiền thanh toán:</strong></p>
      <p className="amount">{discountedTotal} đ</p>
    </div>

    <div className="payment-line">
      <p><strong>Số tiền khách đưa:</strong></p>
      <p className="amount">{customerPaid} đ</p>
    </div>

    <div className="payment-line">
      <p><strong>Số tiền thối lại:</strong></p>
      <p className="amount">{change} đ</p>
    </div>


          <div className="payment-method-grid">
            {["Cash", "ZaloPay", "VNPay", "Momo", "Card", "ShopeePay"].map(
              (method) => (
                <button
                  key={method}
                  className={`payment-method-btn ${
                    paymentMethod === method ? "selected" : ""
                  }`}
                  onClick={() => setPaymentMethod(method)}
                >
                  {method}
                </button>
              )
            )}
          </div>
        </div>

        <div className="payment-keypad-section">
          <input
            type="text"
            value={customerPaid}
            readOnly
            className="payment-keypad-input"
            placeholder="Nhập số tiền khách trả"
          />
          <div className="payment-keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                className="payment-button"
                key={num}
                onClick={() => handleKeyPress(num)}
              >
                {num}
              </button>
            ))}
            <button
              className="payment-button"
              onClick={() => handleKeyPress(0)}
            >
              0
            </button>
            <button
              className="payment-button"
              onClick={() => {
                handleKeyPress(0);
                handleKeyPress(0);
              }}
            >
              00
            </button>
            <button
              className="payment-button"
              onClick={() => {
                handleKeyPress(0);
                handleKeyPress(0);
                handleKeyPress(0);
              }}
            >
              000
            </button>
            <button className="payment-button" onClick={handleDelete}>
              ⌫
            </button>
            <button className="payment-button" onClick={handleClear}>
              C
            </button>
            <button className="payment-button-pay"  onClick={handlePayment}>
              Thanh toán
            </button>
          </div>
          <button onClick={handleBack} className="back-btn">
            Quay lại
          </button>
        </div>
      </div>

      <Modal
        title={'Sản phẩm không đủ điều kiện khuyến mãi'}
        isOpen={showIneligibleModal}
        onRequestClose={closeModal}
        width={1000}
      >
        <div className="ineligible-modal">
        <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Đơn vị</th>
              <th>Số lượng yêu cầu</th>
              <th>Tên chương trình khuyến mãi</th>
            </tr>
          </thead>
          <tbody>
            {ineligiblePromotions.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.unit.description}</td>
                <td>{product.requiredQuantity}</td>
                <td>{product.promotion.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={closeModal}>Đóng</button>
        </div>
        </div>
      </Modal>
    </div>
  );
};

export default Payment;
