import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.scss";
import { useDispatch, useSelector } from "react-redux";
import { clearCustomer, clearProductPay, clearProductRefund } from "../../store/reducers/productPaySlice";
import axios from "axios";
import { getPromotionByProductId, getPromotions, payCart, refundCart } from "../../services/cartRequest";
import ModalComponent from "../../components/modal/Modal";
import { green } from "@mui/material/colors";
import { useAccessToken, useAxiosJWT } from "../../utils/axiosInstance";
import Receipt from "../sales/Invoice/Receipt";
import Modal from 'react-modal';
import PaymentModal from "../sales/Invoice/PaymentModal";
import { formatCurrency } from "../../utils/fotmatDate";
import PaymentModalRefund from "../sales/Invoice/PaymentModalRefund";

const Refund = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const productList = useSelector((state) => state.productPay.producRefund);
  const totalAmountPay = useSelector((state) => state.productPay.totalRefund);
  const [totalAmount, setTotalAmount] = useState(useSelector((state) => state.productPay.totalRefund));
  const customer = useSelector((state) => state.productPay.customer);
  const invoiceCodeRefund = useSelector((state) => state.productPay.invoiceCode);
  const [promotion, setPromotion] = useState([]);
  const [customerPaid, setCustomerPaid] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const [productWithPromotions, setProductWithPromotions] = useState([]);
  const change = customerPaid > totalAmount ? customerPaid - totalAmount : 0;
  const [showIneligibleModal, setShowIneligibleModal] = useState(false); // State to show/hide modal
  const [discountedTotal, setDiscountedTotal] = useState(totalAmount || 0);
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [ineligiblePromotions, setIneligiblePromotions] = useState([]);
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  const [dataInvoices, setDataInvoices] = useState();
  console.log(productList);
  const [isPaid, setIsPaid] = useState(false);

  const [paymentInfo, setPaymenInfo] = useState(null);
  useEffect(() => {
    if (customer) {
      setPaymenInfo({
        name: customer.name,
        gender: customer.gender,
        phone: customer.phone,
        address: customer.address,
      });
    }
  }, [customer]); // Chạy effect mỗi khi customer thay đổi
  useEffect(() => {
    if (totalAmountPay) {
      setTotalAmount(totalAmountPay);
    }
  }, [totalAmountPay]);
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await getPromotions();
        if (response) {
          // Lọc ra những khuyến mãi có type là 'percentage'
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
    const fetchProductPromotions = async () => {
      const ineligible = [];
      let updatedTotalAmount = totalAmount; // Biến tạm để tính tổng sau khi áp dụng khuyến mãi

      const productPromises = productList.map(async (product) => {
        console.log( product.product._id,)
        const promotions = await getPromotionByProductId(
          product.product._id,
          product.unit_id._id
        );
        if (promotions && promotions.length > 0) {
          const applicablePromotions = promotions.map((promotion) => {
            console.log(promotion)
            const promotionLine = promotion.promotionLine_id;
            if (promotionLine) {
              if (promotionLine.type === 'quantity') {
                console.log(product._id)
                console.log( promotion.product_id)
                // Trường hợp 1: product_id === promotion.product_id === promotion.product_donate
                if ( product.product._id === promotion.product_id && product.product._id=== promotion.product_donate) {
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
                  updatedTotalAmount -= product.price * eligibleQuantity
                  return { ...product, promotion, discountAmount: product.price * eligibleQuantity }; // Có khuyến mãi

                  // Trường hợp 2: product_id === promotion.product_id và product_id !== promotion.product_donate
                } else if (product.product._id=== promotion.product_id && product.product._id!== promotion.product_donate) {
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
                  } else if (eligibleQuantity < 1) {
                    // Thêm vào danh sách không đủ điều kiện
                    ineligible.push({
                      ...product,
                      promotion,
                      requiredQuantity: promotion.quantity,
                    });
                    return { ...product, promotion: null };
                  }
                  else
                    return { ...product, promotion: null }; // Có khuyến mãi

                  // Trường hợp 3: product_id !== promotion.product_id và product_id === promotion.product_donate
                } else if (product.product._id !== promotion.product_id && product.product._id=== promotion.product_donate) {
                  const promotionProductExists = productList.some(p => p._id === promotion.product_id && p.unit === promotion.unit_id);
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
                  updatedTotalAmount -= product.price * eligibleQuantity
                  return { ...product, promotion, discountAmount: product.price * eligibleQuantity }; // Có khuyến mãi

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
            }
          });
          return applicablePromotions;
        }
        console.log("no pro")
        return [{ ...product, promotion: null }];
      });

      const productsWithPromotions = await Promise.all(productPromises);
      console.log(productsWithPromotions.flat())
      setProductWithPromotions(productsWithPromotions.flat());
      setIneligiblePromotions(ineligible);
      setShowIneligibleModal(ineligible.length > 0 ? true : false);
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

        return currentTotal;
      });
      const minTotal = Math.min(...finalTotals);
      if (minTotal === totalAmount) {
        setDiscountedTotal(totalAmount);
        setAppliedPromotion(null);
      } else {

        setDiscountedTotal(minTotal);
        const bestPromotion = promotion[finalTotals.indexOf(minTotal)];
        setAppliedPromotion(bestPromotion);
      }
    }
  }, [promotion, totalAmount]);

  const closeModal = () => {
    setShowIneligibleModal(false);
  };
  const closeModalPay = () => {
    setIsPaid(false);
    dispatch(clearCustomer());
    dispatch(clearProductPay());
    dispatch(clearProductRefund());
    navigate("/frame-staff/stall");
  };
  // Xử lý quay lại trang bán hàng
  const handleBack = () => {
    dispatch(clearCustomer());
    dispatch(clearProductRefund());
    navigate("/frame-staff/stall");
  };

  // Xử lý thanh toán
  const handlePayment = async () => {
    const isConfirmed = window.confirm('Bạn có chắc chắn hoàn tiền');
    if (!isConfirmed) return;
 
    try {
      const response = await refundCart(
        accessToken,
        axiosJWT,
        currentUser.user,
        invoiceCodeRefund,
      );
      console.log('pay cart response:', response.data);
      if (response?.success) {
        alert("Trả hàng thành công!");
        setIsPaid(true);
        setDataInvoices(response.data);
      } else {
        alert(response?.message || "Thanh toán thất bại!");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
    }
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
                    <td>{product.product.name}</td>
                    <td>{product.unit_id.description}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.quantity}</td>
                    <td>{formatCurrency(product.price * product.quantity)}</td>
                  </tr>
                  {product.promotion && ( // Kiểm tra xem có khuyến mãi không
                    <tr>
                      <td colSpan="1">
                        {"KM"}
                      </td>
                      <td>{product.product.name}</td>
          
                      <td colSpan="3">{product.promotion?.description}</td>

                      <td>-{formatCurrency(product.discountAmount)}</td>
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
        <h3>Hoàn tiền</h3>
        <div className="payment-info">
          {customer && (
            <>
              <div className="payment-line" style={{ color: 'blue' }}>
                <p ><strong>Khách hàng:</strong></p>
                <p className="amount">{customer.name}</p>
              </div>
              <div className="payment-line" style={{ color: 'blue' }}>
                <p><strong>Số điện thoại:</strong></p>
                <p className="amount">{customer.phone}</p>
              </div>
            </>
          )}

          <div className="payment-line">
            <p><strong>Tổng số tiền sản phẩm:</strong></p>
            <p className="amount">{formatCurrency(totalAmount)}</p>
          </div>

          {appliedPromotion && (
            <div className="payment-line">
              <p><strong>Khuyến mãi ({appliedPromotion.description}):</strong></p>
              <p className="amount">- {formatCurrency(totalAmount - discountedTotal)} </p>
            </div>
          )}

          <div className="payment-line total-due">
            <p><strong>Tổng số tiền hoàn trả:</strong></p>
            <p className="amount">{formatCurrency(discountedTotal)}</p>
          </div>

          <div className="payment-method-grid">
            {["Tiền mặt"].map(
              (method) => (
                <button
                  key={method}
                  className={`payment-method-btn ${paymentMethod === method ? "selected" : ""
                    }`}
                  onClick={() => setPaymentMethod(method)}
                >
                  {method}
                </button>
              )
            )}
          </div>
        </div>

        <div className="refund-line">
            <button className="refund-button-confirm" onClick={handlePayment} disabled={productWithPromotions.length === 0}>
              Xác nhận
            </button>
          <button onClick={handleBack} className="refund-button-cancel">
            Hủy
          </button>
        </div>
      </div>

 {isPaid && dataInvoices && <PaymentModalRefund isPaid={isPaid} closeModal={closeModalPay} accessToken={accessToken} axiosJWT={axiosJWT} invoiceId={dataInvoices.invoiceCode} />}
      <ModalComponent
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
      </ModalComponent>
    </div>
  );
};

export default Refund;
