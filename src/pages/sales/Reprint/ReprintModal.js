import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import PaymentModal from "../Invoice/PaymentModal";

Modal.setAppElement("#root"); // For accessibility

const ReprintModal = ({ isOpen, onRequestClose, getInvoice, accessToken, axiosJWT }) => {
  const [invoiceCode, setInvoiceCode] = useState("");
  const [invoiceInfo, setInvoiceInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setInvoiceCode("");
      setInvoiceInfo(null);
      setError(null);
      setIsPaymentModalOpen(false);
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
     
      if (fetchedInvoice) {
        setInvoiceInfo(fetchedInvoice);
        setIsPaymentModalOpen(true); // Open PaymentModal if invoice is found
        onRequestClose(); // Close ReprintModal
      } else {
        setInvoiceInfo(null);
        setError("Không tìm thấy hóa đơn");
      }
    } catch (err) {
      setInvoiceInfo(null);
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
        <h2>In lại hóa đơn</h2>
        <input
          type="text"
          value={invoiceCode}
          onChange={(e) => setInvoiceCode(e.target.value)}
          placeholder="Nhập mã hóa đơn"
        />
        <button onClick={handleInvoiceCheck}>Kiểm tra</button>
        {error && <div className="error-message">{error}</div>}
        
        <button onClick={onRequestClose}>Đóng</button>
      </Modal>

      {/* PaymentModal để in lại hóa đơn */}
      {isPaymentModalOpen && invoiceInfo && (
        <PaymentModal
          isPaid={isPaymentModalOpen}
          closeModal={() => setIsPaymentModalOpen(false)}
          accessToken={accessToken}
          axiosJWT={axiosJWT}
          invoiceId={invoiceInfo}
        />
      )}
    </>
  );
};

export default ReprintModal;
