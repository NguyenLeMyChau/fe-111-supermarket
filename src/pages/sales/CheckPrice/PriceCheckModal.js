// PriceCheckModal.js
import React, { useState } from "react";
import Modal from "react-modal";
import "./PriceCheckModal.scss"; // Ensure you create and import the necessary styles

Modal.setAppElement("#root"); // For accessibility

const PriceCheckModal = ({ isOpen, onRequestClose, onCheckPrice }) => {
  const [barcode, setBarcode] = useState("");
  const [price, setPrice] = useState(null);

  const handleCheckPrice = async () => {
    // Implement the logic to fetch the product price based on the barcode
    const fetchedPrice = await onCheckPrice(barcode);
    setPrice(fetchedPrice);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Check Price Modal"
      className="price-check-modal"
      overlayClassName="price-check-overlay"
    >
      <h2>Check Price</h2>
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Enter barcode"
      />
      <button onClick={handleCheckPrice}>Check Price</button>
      {price !== null && (
        <div>
          <p>Price: {price}</p>
        </div>
      )}
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default PriceCheckModal;
