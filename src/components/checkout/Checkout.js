import React, { useState } from 'react';

const Checkout = ({ total, handleCheckout }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const submitCheckout = () => {
    handleCheckout(paymentMethod);
  };

  return (
    <div>
      <h2>Checkout</h2>
      <p>Total: ${total.toFixed(2)}</p>
      <label>
        Payment Method:
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="cash">Cash</option>
          <option value="credit">Credit Card</option>
        </select>
      </label>
      <button onClick={submitCheckout}>Complete Sale</button>
    </div>
  );
};

export default Checkout;
