import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./QuantityModal.scss"; // Ensure you create and import the necessary styles

Modal.setAppElement("#root"); // For accessibility

const QuantityModal = ({ isOpen, onRequestClose, product, onUpdateQuantity }) => {
  const [quantity, setQuantity] = useState(0); // Set initial quantity to 0
  const [initialQuantity, setInitialQuantity] = useState(0); 

  useEffect(() => {
    if (product) {
      setInitialQuantity(product.quantity); 
      setQuantity(product.quantity); 
    }
  }, [isOpen]);

  const handleQuantityChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (newValue >= 0) {
      setQuantity(newValue);
    }
  };

  const handleUpdateQuantity = () => {
    onUpdateQuantity(product._id, product.unit._id, quantity); // Ensure quantity is a number
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
      <h2 className="quantity-modal__title">Chỉnh sửa số lượng</h2>
      <div className="quantity-modal__content">
        <p className="quantity-modal__product-name">{product?.name}</p>

        {/* Display Initial Quantity */}
        <div className="quantity-modal__input-group">
          <label htmlFor="initial-quantity">Số lượng ban đầu:</label>
          <input
            type="number"
            value={initialQuantity}
            readOnly // Make this input read-only
            className="quantity-modal__input quantity-modal__input--initial"
            id="initial-quantity"
            disabled={true}
          />
        </div>

        {/* Input for Updated Quantity */}
        <div className="quantity-modal__input-group">
          <label htmlFor="updated-quantity">Số lượng mới:</label>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1" // Add minimum value to ensure it can't be negative
            className="quantity-modal__input quantity-modal__input--updated"
            id="updated-quantity"
          />
        </div>

        <button
          onClick={handleUpdateQuantity}
          className="quantity-modal__button quantity-modal__button--update"
        >
          Cập nhật
        </button>
        <button
          onClick={onRequestClose}
          className="quantity-modal__button quantity-modal__button--cancel"
        >
          Hủy
        </button>
      </div>
    </Modal>
  );
};

export default QuantityModal;
