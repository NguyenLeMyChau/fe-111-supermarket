import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import PaymentModal from "../Invoice/PaymentModal";
import { clearProductPay, clearProductRefund, setCustomer, setProductPay, setProductRefund } from "../../../store/reducers/productPaySlice";
import { BsNutFill } from "react-icons/bs";

Modal.setAppElement("#root"); // For accessibility

const RefundModal = ({ isOpen, onRequestClose, getInvoice, accessToken, axiosJWT, dispatch }) => {
  const [invoiceCode, setInvoiceCode] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setInvoiceCode("");
      setError(null);
    }
  }, [isOpen]);

  // Function to handle invoice check
  const handleInvoiceCheck = async () => {
    if (!invoiceCode) {
      setError("Vui lòng nhập mã hóa đơn");
      return;
    }

    setError(null); // Reset error message
    try {
      const fetchedInvoice = await getInvoice(invoiceCode);
      console.log(fetchedInvoice);
      if (fetchedInvoice) {
        if( fetchedInvoice.invoice.isRefund !== true){
        // Calculate the total price of products
        const totalProductPrice = fetchedInvoice.invoiceDetails.products.reduce((total, item) => {
          return total + item.quantity * item.price;
        }, 0);

        // Dispatch actions to update the state with the fetched products and total amount
        dispatch(clearProductRefund());
        dispatch(setCustomer({ customer: fetchedInvoice.invoiceDetails.customer_id||null }));
        dispatch(setProductRefund({ productRefund: fetchedInvoice.invoiceDetails.products, totalRefund: totalProductPrice,invoiceCode:fetchedInvoice.invoice.invoiceCode,invoiceRefund: fetchedInvoice}));
        navigate('/frame-staff/refund');
      }
    else setError("Hóa đơn này đã trả hàng")} else {
        setError("Không tìm thấy hóa đơn");
      }
    } catch (err) {
      setError("Không tìm thấy hóa đơn");
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Check Invoice Modal"
        className="price-check-modal"
        overlayClassName="price-check-overlay"
      >
        <h2>Hoàn trả sản phẩm</h2>
        <div className="quantity-modal__input-group">
          <label htmlFor="initial-quantity">Mã hóa đơn</label>
          <input
            type="text"
            value={invoiceCode}
            onChange={(e) => setInvoiceCode(e.target.value)}
            placeholder="Nhập mã hóa đơn"
          />
        </div>
        
        <button onClick={handleInvoiceCheck}>Kiểm tra</button>
        {error && <div className="error-message">{error}</div>}
        
        <button onClick={onRequestClose}>Đóng</button>
      </Modal>
    </>
  );
};

export default RefundModal;
