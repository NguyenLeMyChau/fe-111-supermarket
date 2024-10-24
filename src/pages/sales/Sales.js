// Sales.js
import React, { useState } from "react";
import "./Sales.scss";
import { useNavigate } from "react-router-dom";
import PriceCheckModal from "./CheckPrice/PriceCheckModal.js"; // Import the modal
import QuantityModal from "./Quantity/QuantityModal.js";

const Sales = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState();
  const [barcode, setBarcode] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantityModalOpen, setQuantityModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(); // Initial total based on sample product

  const handleKeyPress = (value) => {
    setBarcode((prev) => parseInt(`${prev}${value}`));
  };

  const handleClear = () => {
    setBarcode(0);
  };

  // Handle selecting a product
  const handleRowClick = (product) => {
    setSelectedProduct(product);
  };
  // Open modal
  const openQuantityModal = () => {
    if (selectedProduct) {
      setQuantityModalOpen(true);
    }
  };
  const handleUpdateQuantity = (productId, newQuantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity, total: item.price * newQuantity - item.discount }
          : item
      )
    );
    setTotal(prevTotal =>
      prevTotal + cart.find(item => item.id === productId).price * (newQuantity - cart.find(item => item.id === productId).quantity)
    );
  };
  const handleDelete = () => {
    setBarcode(prevBarcode => {
      const newBarcode = prevBarcode.toString().slice(0, -1);
      return newBarcode ? Number(newBarcode) : 0;
    });
  };

  const addProduct = () => {
    if (product) {
      setCart([...cart, product]);
      setTotal(total + (product.price * product.quantity - product.discount));
    }
  };

 // Delete selected product
 const handleDeleteProduct = () => {
  if (selectedProduct) {
    setCart(cart.filter(item => item.id !== selectedProduct.id)); // Remove selected product
    setTotal(total - selectedProduct.total); // Update total
    setSelectedProduct(null); // Deselect the product
  }
};

 // Delete all products
 const handleDeleteAll = () => {
  // Add confirmation dialog
  const confirmDeleteAll = window.confirm("Bạn có chắc muốn xóa hết tất cả sản phẩm không?");
  if (confirmDeleteAll) {
    setCart([]); // Clear cart
    setTotal(0); // Reset total to 0
    setSelectedProduct(null); // Deselect any selected product
  }
};

// Handle cancel button to reset the screen
const handleCancel = () => {
  // Add confirmation dialog
  const confirmCancel = window.confirm("Bạn có chắc muốn hủy toàn bộ và đặt lại màn hình không?");
  if (confirmCancel) {
    setCart([]); // Clear cart
    setTotal(0); // Reset total to 0
    setSelectedProduct(null); // Deselect any selected product
    setQuantityModalOpen(false); // Optionally reset modal visibility
  }
};

  const handlePay = () => {
    navigate('/frame-staff/payment', { state: { productList: cart, totalAmount: total } });
  };

  // const checkPrice = async (barcode) => {
  //   // Simulate an API call to fetch the product price
  //   const fetchedProduct = await api.getProductByBarcode(barcode);
  //   return fetchedProduct ? fetchedProduct.price : "Not found";
  // };

  return (
    <div className="sales-container">
      <div className="row-top">
        <div className="cart-section">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>Giá bán</th>
                <th>Số lượng</th>
                <th>Giảm giá</th>
                <th>Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
               <tr
               key={item.id}
               onClick={() => handleRowClick(item)} // Set the selected product on row click
               className={`clickable-row ${selectedProduct?.id === item.id ? 'selected' : ''}`} // Highlight selected row
             >
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.discount || 0}</td>
                  <td>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-amount">
            <strong>Tổng cộng: {total}đ</strong>
          </div>
        </div>

        <div className="buttons-right">
          <button onClick={handlePay}>Pay</button>
          <button onClick={openQuantityModal} disabled={!selectedProduct}>Quantity</button> {/* Open modal */}
          <button onClick={handleDeleteProduct} disabled={!selectedProduct}>Delete</button> {/* Delete selected product */}
          <button onClick={handleDeleteAll} disabled={cart.length === 0}>DeleteAll</button> {/* Delete all products */}
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>

      <div className="row-bottom">
        <div className="function-section">
          <button>Đăng xuất</button>
          <button>Bán</button>
          <button>Trả hàng</button>
          <button>In lại hóa đơn</button>
          <button onClick={() => setIsModalOpen(true)}>Check Price</button>
          <button>Cash</button>
        </div>

        <div className="keypad-section">
          <div className="input-section">
            <input
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              type="number"
              className="keypad-input"
              placeholder="Nhập giá trị"
            />
            <button
              onClick={addProduct}
              className="submit-btn"
            >
              Nhập
            </button>
          </div>

          <div className="keypad">
            <button onClick={() => handleKeyPress(1)}>1</button>
            <button onClick={() => handleKeyPress(2)}>2</button>
            <button onClick={() => handleKeyPress(3)}>3</button>
            <button onClick={() => handleKeyPress(4)}>4</button>
            <button onClick={() => handleKeyPress(5)}>5</button>
            <button onClick={() => handleKeyPress(6)}>6</button>
            <button onClick={() => handleKeyPress(7)}>7</button>
            <button onClick={() => handleKeyPress(8)}>8</button>
            <button onClick={() => handleKeyPress(9)}>9</button>
            <button onClick={() => handleKeyPress(0)}>0</button>
            <button onClick={handleDelete}>Xóa</button>
            <button onClick={handleClear}>Xóa hết</button>
          </div>
        </div>
      </div>

      <PriceCheckModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        // onCheckPrice={checkPrice}
      />
      <QuantityModal
        isOpen={quantityModalOpen}
        onRequestClose={() => setQuantityModalOpen(false)}
        product={selectedProduct}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
};

export default Sales;
