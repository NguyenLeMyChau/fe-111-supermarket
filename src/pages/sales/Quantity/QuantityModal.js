// QuantityModal.js
import React, { useState } from "react";
import Modal from "react-modal";
import "./QuantityModal.scss"; // Ensure you create and import the necessary styles

Modal.setAppElement("#root"); // For accessibility

const QuantityModal = ({ isOpen, onRequestClose, product, onUpdateQuantity }) => {
  const [quantity, setQuantity] = useState(product?.quantity || 1);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleUpdateQuantity = () => {
    onUpdateQuantity(product.id, quantity);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Quantity Modal"
      className="quantity-modal"
      overlayClassName="quantity-overlay"
    >
      <h2>Update Quantity</h2>
      <div className="modal-content">
        <p>Product: {product?.name}</p>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
        />
        <button onClick={handleUpdateQuantity}>Update</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default QuantityModal;
