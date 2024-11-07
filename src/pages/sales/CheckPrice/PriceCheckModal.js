import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./PriceCheckModal.scss"; // Ensure you create and import the necessary styles
import { formatCurrency } from "../../../utils/fotmatDate";

Modal.setAppElement("#root"); // For accessibility

const PriceCheckModal = ({ isOpen, onRequestClose, checkPriceByBarcode }) => {
  const [barcode, setBarcode] = useState("");
  const [priceInfo, setPriceInfo] = useState(null);
  const [error, setError] = useState(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setBarcode("");
      setPriceInfo(null);
      setError(null);
    }
  }, [isOpen]);

  const handleCheckPrice = async () => {
    if (!barcode) {
      setError("Vui lòng nhập barcode");
      return;
    }

    setError(null); // Reset error message
    try {
      const fetchedPrice = await checkPriceByBarcode(barcode);
      if (fetchedPrice) {
        console.log(fetchedPrice);
        setPriceInfo(fetchedPrice);
      } else {
        setPriceInfo(null);
        setError("Không tìm thấy sản phẩm");
      }
    } catch (err) {
      console.error("Error fetching price:", err);
      setError("Có lỗi xảy ra");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Check Price Modal"
      className="price-check-modal"
      overlayClassName="price-check-overlay"
    >
      <h2>Kiểm tra giá</h2>
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Nhập barcode"
      />
      <button onClick={handleCheckPrice}>Kiểm tra giá</button>
      {error && <div className="error-message">{error}</div>}
      {priceInfo && (
        <div className="price-info">
          <p>Tên sản phẩm: {priceInfo.product.name}</p>
          <p>Đơn vị: {priceInfo.price?.unit.description}</p>
          <p>Giá: {formatCurrency(priceInfo.price?.price)}</p>
        </div>
      )}
      <button onClick={onRequestClose}>Đóng</button>
    </Modal>
  );
};

export default PriceCheckModal;
