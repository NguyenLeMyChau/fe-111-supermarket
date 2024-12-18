import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCustomer,
  clearProductPay,
} from "../../store/reducers/productPaySlice";
import axios from "axios";
import {
  checkPaymentStatus,
  getPromotionByProductId,
  getPromotions,
  payCart,
  payZalo,
} from "../../services/cartRequest";
import ModalComponent from "../../components/modal/Modal";
import { green } from "@mui/material/colors";
import { useAccessToken, useAxiosJWT } from "../../utils/axiosInstance";
import Receipt from "../sales/Invoice/Receipt";
import Modal from "react-modal";
import PaymentModal from "../sales/Invoice/PaymentModal";
import { formatCurrency } from "../../utils/fotmatDate";
import {
  calculateDiscount,
  calculateDiscountAmount,
} from "../../utils/calculatePromotion";
import { useSocket } from "../../context/SocketContext";
import { toast } from "react-toastify";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const productList = useSelector((state) => state.productPay.productPay);
  const totalAmountPay = useSelector((state) => state.productPay.totalAmount);
  const [totalAmount, setTotalAmount] = useState(
    useSelector((state) => state.productPay.totalAmount)
  );
  const customer = useSelector((state) => state.productPay.customer);
  const [promotion, setPromotion] = useState([]);
  const [customerPaid, setCustomerPaid] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const [productWithPromotions, setProductWithPromotions] = useState([]);
  const [showIneligibleModal, setShowIneligibleModal] = useState(false); // State to show/hide modal
  const [discountedTotal, setDiscountedTotal] = useState(totalAmount || 0);
  const change = customerPaid > discountedTotal  ? customerPaid - discountedTotal : 0;
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [ineligiblePromotions, setIneligiblePromotions] = useState([]);
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  const [dataInvoices, setDataInvoices] = useState(null);
  const urlParams = new URLSearchParams(window.location.search);
  const { emitSocketEvent } = useSocket();

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
        console.log(response)
        if (response) {
          // Lọc ra những khuyến mãi có type là 'percentage'
          const percentagePromotions = response?.filter(
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

      const productPromises = productList?.map(async (product) => {
        const promotions = await getPromotionByProductId(
          product._id,
          product.unit._id
        );
        if (promotions && promotions.length > 0) {
          const applicablePromotions = promotions.map((promotion) => {
            console.log(promotion);
            const promotionLine = promotion.promotionLine_id;
            if (promotionLine) {
              if (promotionLine.type === "quantity") {
                // Trường hợp 1: product_id === promotion.product_id === promotion.product_donate
                if (
                  product._id === promotion.product_id &&
                  product._id === promotion.product_donate &&
                  product.unit._id === promotion.unit_id?._id &&   product.unit._id===
                    promotion.unit_id_donate?._id
                ) {
                  const totalQuantity =
                    promotion.quantity + promotion.quantity_donate;
                  const eligibleQuantity = Math.floor(
                    product.quantity / totalQuantity
                  );
                  console.log(
                    "Eligible Quantity (same product):",
                    eligibleQuantity
                  );

                  if (eligibleQuantity < 1) {
                    // Thêm vào danh sách không đủ điều kiện
                    ineligible.push({
                      ...product,
                      promotion,
                      message:
                        "Khuyến mãi chưa được áp dụng: số lượng không đủ.",
                      requiredQuantity: totalQuantity,
                    });
                    return { ...product, promotion: null }; // Không có khuyến mãi
                  }
                  updatedTotalAmount -= product.price * eligibleQuantity;
                  return {
                    ...product,
                    promotion,
                    discountAmount: product.price * eligibleQuantity,
                    quantityDonate: eligibleQuantity,
                  }; // Có khuyến mãi

                  // Trường hợp 2: product_id === promotion.product_id và product_id !== promotion.product_donate
                } else if (
                  product._id === promotion.product_id &&
                  (product._id !== promotion.product_donate ||
                    product.unit._id !== promotion.unit_id_donate?._id)
                ) {
                  const eligibleQuantity = Math.floor(
                    product.quantity / promotion.quantity
                  );
                  const donateProductExists = productList.find(
                    (p) =>
                      p._id === promotion.product_donate &&
                      p.unit._id === promotion.unit_id_donate._id
                  );
                  console.log(
                    "Eligible Quantity (different donate product):",
                    eligibleQuantity
                  );

                  if (!donateProductExists) {
                    // Thêm vào danh sách không đủ điều kiện
                    ineligible.push({
                      ...product,
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
                  } else return { ...product, promotion: null }; // Có khuyến mãi

                  // Trường hợp 3: product_id !== promotion.product_id và product_id === promotion.product_donate
                } else if (
                  (product._id !== promotion.product_id &&
                    product._id === promotion.product_donate) ||
                  (product._id === promotion.product_donate &&
                    product.unit._id === promotion.unit_id_donate?._id)
                ) {
                  const promotionProductExists = productList.find(
                    (p) =>
                      p._id === promotion.product_id &&
                      p.unit._id === promotion.unit_id._id
                  );
                  const eligibleQuantity = Math.floor(
                    promotionProductExists?.quantity / promotion.quantity
                  );
                  console.log(
                    "Eligible Quantity (donate product):",
                    eligibleQuantity,
                    promotionProductExists
                  );

                  if (!promotionProductExists || eligibleQuantity < 1) {
                    ineligible.push({
                      ...product,
                      promotion,
                      requiredQuantity: promotion.quantity,
                    });
                    return { ...product, promotion: null }; // Không có khuyến mãi
                  }
                  updatedTotalAmount -= product.price * eligibleQuantity;
                  return {
                    ...product,
                    promotion,
                    discountAmount: product.price * eligibleQuantity,
                    quantityDonate: eligibleQuantity,
                  }; // Có khuyến mãi
                }
              }
              if (promotionLine.type === "amount") {
                console.log("promotion amouut")
                const eligibleQuantity = Math.floor(
                  product.quantity / promotion.quantity
                );
                const discountAmount =
                  eligibleQuantity >= 1
                    ? eligibleQuantity * promotion.amount_donate
                    : 0;

                if (eligibleQuantity >= 1) {
                  updatedTotalAmount -= discountAmount; // Trừ discount vào tổng tiền
                  return {
                    ...product,
                    promotion,
                    discountAmount,
                    quantityDonate: eligibleQuantity,
                  };
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
        return [{ ...product, promotion: null }];
      });

      const productsWithPromotions = await Promise.all(productPromises);
      setProductWithPromotions(productsWithPromotions.flat());
      setIneligiblePromotions(ineligible);
      console.log(productsWithPromotions);
      setShowIneligibleModal(ineligible.length > 0 ? true : false);
      setTotalAmount(updatedTotalAmount);
    };

    fetchProductPromotions();
  }, [productList]);

  useEffect(() => {
    // Tính toán tổng tiền đã giảm mỗi khi promotion thay đổi

    if (promotion?.length > 0) {
      
      const finalTotals = promotion.map((applicablePromotion) => {
        let currentTotal = totalAmount; // Bắt đầu từ tổng ban đầu
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
        console.log(bestPromotion);
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
    navigate("/frame-staff/stall");
  };
  // Xử lý quay lại trang bán hàng
  const handleBack = () => {
    navigate("/frame-staff/stall");
  };

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      // setIsLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const appTransId = urlParams.get("apptransid");
      console.log("App Transaction ID:", appTransId);
  
      if (appTransId) {
        try {
          // Gửi yêu cầu kiểm tra trạng thái thanh toán
          const responseCheck = await checkPaymentStatus(axiosJWT, appTransId);
          console.log("Response Check:", responseCheck);
          if (responseCheck.return_code === 1) {
            const cartData = JSON.parse(localStorage.getItem("paymentData"));
          console.log(cartData)
            if (!cartData) {
              
              return;
            }
            const {
              customerId,
              products,
              paymentMethod,
              paymentInfo,
              paymentAmount,
              promotionOnInvoice,
              discountPayment,
              totalPayment,
              
            } = cartData;
            const response = await payCart(
              emitSocketEvent,
              accessToken,
              axiosJWT,
              currentUser.user,
              customerId,
              products,
              paymentMethod,
              paymentInfo,
              paymentAmount,
              promotionOnInvoice,
              discountPayment,
              totalPayment,
              
            );
            if (response?.success) {
              toast.success("Thanh toán thành công!");
              
              setIsPaid(true);
              setDataInvoices(response.data);
              localStorage.removeItem("paymentData");
            } else {
              toast.error(response?.message || "Thanh toán thất bại!");
            }
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
          toast.warning("Không thể kiểm tra trạng thái thanh toán.");
        }
      }
    };
  
    fetchPaymentStatus(); // Gọi hàm khi trang được tải
  }, [
   
  ]);
  
  // Xử lý thanh toán
  
  const handlePayment = async () => {
    const isConfirmed = window.confirm("Bạn có chắc chắn thanh toán");
  if (!isConfirmed) return;
    if(paymentMethod === "ZaloPay"){
      try {
      const response = await payZalo(
          accessToken,
          axiosJWT,
         discountedTotal,
         currentUser.user,
         customer?.account_id,
         productWithPromotions,
         paymentMethod,
         paymentInfo,
         discountedTotal,
         appliedPromotion,
         totalAmount-discountedTotal,
         totalAmount
        );
        console.log("pay cart zalo response:", response);
     
      } catch (error) {
        console.error("Payment error:", error);
        toast.error("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
      }
    }
    if (paymentMethod === "Tiền mặt") {
      if (customerPaid < discountedTotal) {
        toast.warning("Số tiền trả không đủ.");
        return;
      }
      try {
        const response = await payCart(
          emitSocketEvent,
          accessToken,
          axiosJWT,
          currentUser.user,
          customer?.account_id,
          productWithPromotions,
          paymentMethod,
          paymentInfo,
          discountedTotal,
          appliedPromotion,
          totalAmount-discountedTotal,
          totalAmount,
          customerPaid
        );
        console.log("pay cart response:", response);
        if (response?.success) {
          toast.success("Thanh toán thành công!");
          setIsPaid(true);
          setDataInvoices(response.data);
        } else {
          toast.error(response?.message || "Thanh toán thất bại!");
        }
      } catch (error) {
        console.error("Payment error:", error);
        toast.error("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
      }
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
    productWithPromotions.map((product, index) => {
      const isGift = product.promotion && product.quantity > product.quantityDonate; // Kiểm tra nếu số lượng mua lớn hơn số lượng tặng

      return (
        <React.Fragment key={index}>
          {/* Hiển thị sản phẩm chính */}
          {product.promotion === null && (
            <tr>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.unit.description}</td>
              <td>{formatCurrency(product.price)}</td>
              <td>{product.quantity}</td>
              <td>{formatCurrency(product.price * product.quantity)}</td>
            </tr>
          )}
          

          {/* Hiển thị sản phẩm tặng (dành cho các loại khuyến mãi "quantity") */}
          {isGift && (
            <tr>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.unit.description}</td>
              <td>{formatCurrency(product.price)}</td>
              <td>{product.quantity - product.quantityDonate}</td> {/* Số lượng mua thêm */}
              <td>{formatCurrency(product.price * (product.quantity - product.quantityDonate))}</td> {/* Thành tiền cho số lượng mua thêm */}
            </tr>
          )}
          {product.promotion && product.promotion.promotionLine_id.type === 'quantity' && product.quantityDonate > 0 && (
            <tr className="promotion-row">
              <td>KM</td>
              <td>{`${product.promotion.description}: ${product.name}`}</td>
              <td>{product.unit.description}</td>
              <td>{formatCurrency(0)}</td>
              <td>{product.quantityDonate}</td>
              <td>{formatCurrency(0)}</td>
            </tr>
          )}

          {/* Hiển thị sản phẩm mua thêm (có giá trị và thành tiền) */}
          

          {/* Hiển thị sản phẩm giảm giá (khuyến mãi loại "amount") */}
          {product.promotion && product.promotion.promotionLine_id.type === 'amount' && product.quantity > 0 && (
            <>
              <tr>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.unit.description}</td>
              <td>{formatCurrency(product.price)}</td>
              <td>{product.quantity}</td>
              <td>{formatCurrency(product.price * product.quantity)}</td>
            </tr>
            <tr className="promotion-row">
              <td>KM</td>
              <td>{`${product.promotion.description}: ${product.name}`}</td>
              <td>{product.unit.description}</td>
              <td>-{formatCurrency(product.promotion.amount_donate)}</td> {/* Giá sau khi giảm */}
              <td>{product.quantity}</td>
              <td>-{formatCurrency((product.promotion.amount_donate) * product.quantity)}</td> {/* Thành tiền sau giảm */}
            </tr>
            </>
          )}
        </React.Fragment>
      );
    })
  ) : (
    <tr>
      <td colSpan="6" className="empty-cart">Không có sản phẩm trong giỏ hàng</td>
    </tr>
  )}
</tbody>



        </table>
      </div>

      <div className="right-section">
        <h3>Thanh toán</h3>
        <div className="payment-info">
          {customer && (
            <>
              <div className="payment-line" style={{ color: "blue" }}>
                <p>
                  <strong>Khách hàng:</strong>
                </p>
                <p className="amount">{customer.name}</p>
              </div>
              <div className="payment-line" style={{ color: "blue" }}>
                <p>
                  <strong>Số điện thoại:</strong>
                </p>
                <p className="amount">{customer.phone}</p>
              </div>
            </>
          )}

          <div className="payment-line">
            <p>
              <strong>Tổng số tiền sản phẩm:</strong>
            </p>
            <p className="amount">{formatCurrency(totalAmount)}</p>
          </div>

          {appliedPromotion && (
            <div className="payment-line">
              <p>
                <strong>{appliedPromotion.description}:</strong>
              </p>
              <p className="amount">
                - {formatCurrency(totalAmount - discountedTotal)}{" "}
              </p>
            </div>
          )}

          <div className="payment-line total-due">
            <p>
              <strong>Tổng số tiền thanh toán:</strong>
            </p>
            <p className="amount">{formatCurrency(discountedTotal)}</p>
          </div>

          <div className="payment-line">
            <p>
              <strong>Số tiền khách đưa:</strong>
            </p>
            <p className="amount">{formatCurrency(customerPaid)}</p>
          </div>

          <div className="payment-line">
            <p>
              <strong>Số tiền thối lại:</strong>
            </p>
            <p className="amount">{formatCurrency(change)}</p>
          </div>

          <div className="payment-line">
            <p>
              <strong>Phương thức thanh toán : </strong>
            </p>
          </div>
          <div className="payment-method-grid">
            {["Tiền mặt", "ZaloPay"].map((method) => (
              <button
                key={method}
                className={`payment-method-btn ${
                  paymentMethod === method ? "selected" : ""
                }`}
                onClick={() => setPaymentMethod(method)}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div className="payment-keypad-section">
          <input
            type="text"
            value={formatCurrency(customerPaid)}
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
                disabled={paymentMethod!=="Tiền mặt"}
                style={{ backgroundColor: paymentMethod !== "Tiền mặt" ? "gray" : "pink" }}
              >
                {num}
              </button>
            ))}
            <button
              className="payment-button"
              onClick={() => handleKeyPress(0)}
              style={{ backgroundColor: paymentMethod !== "Tiền mặt" ? "gray" : "pink" }}
            >
              0
            </button>
            <button
              className="payment-button"
              style={{ backgroundColor: paymentMethod !== "Tiền mặt" ? "gray" : "pink" }}
              onClick={() => {
                handleKeyPress(0);
                handleKeyPress(0);
              }}
            >
              00
            </button>
            <button
              className="payment-button"
              style={{ backgroundColor: paymentMethod !== "Tiền mặt" ? "gray" : "pink" }}
              onClick={() => {
                handleKeyPress(0);
                handleKeyPress(0);
                handleKeyPress(0);
              }}
            >
              000
            </button>
            <button className="payment-button" onClick={handleDelete}  style={{ backgroundColor: paymentMethod !== "Tiền mặt" ? "gray" : "pink" }}>
              ⌫
            </button>
            <button className="payment-button" onClick={handleClear}  style={{ backgroundColor: paymentMethod !== "Tiền mặt" ? "gray" : "pink" }}>
              C
            </button>
            <button
              className="payment-button-pay"
              onClick={handlePayment}
              disabled={productWithPromotions.length === 0}
            >
              Thanh toán
            </button>
          </div>
          <button onClick={handleBack} className="back-btn">
            Quay lại
          </button>
        </div>
      </div>

      {isPaid && dataInvoices && (
        <PaymentModal
          isPaid={isPaid}
          closeModal={closeModalPay}
          accessToken={accessToken}
          axiosJWT={axiosJWT}
          invoiceId={dataInvoices.invoiceCode}
        />
      )}
      {urlParams.size === 0 &&<ModalComponent
        title={"Sản phẩm không đủ điều kiện khuyến mãi"}
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
                  <th>Tên chương trình khuyến mãi</th>
                </tr>
              </thead>
              <tbody>
                {ineligiblePromotions.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                
                    <td>{product.promotion?.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={closeModal}>Đóng</button>
          </div>
        </div>
      </ModalComponent>}
    </div>
  );
};

export default Payment;
