import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Receipt from "./Receipt";
import "./Receipt.scss";

const sampleData = {
  cashierName: "Nguyễn Văn A",
  transactionTime: Date.now(),
  receiptNumber: "123456789",
  items: [
    { name: "Sữa", quantity: 2, price: 30000 },
    { name: "Bánh quy", quantity: 1, price: 15000 },
  ],
  total: 75000,
  paymentMethod: "Tiền mặt",
  wifiPassword: "abc123456",
};

const PaymentModal = ({ isPaid, closeModal }) => {
  const [isPrinted, setIsPrinted] = useState(false);

  // Hàm in hóa đơn
  const handlePrint = () => {
    // Lấy phần tử hóa đơn
    const receiptContent = document.getElementById("receiptToPrint");

    // Lưu trạng thái của các phần không cần in
    const bodyChildren = document.body.children;

    // Ẩn tất cả các phần tử không phải là hóa đơn
    Array.from(bodyChildren).forEach(child => {
      if (child !== receiptContent) {
        child.style.visibility = 'hidden';
      }
    });

    // In hóa đơn
    window.print();

    // Sau khi in xong, hiển thị lại các phần đã ẩn
    Array.from(bodyChildren).forEach(child => {
      child.style.visibility = 'visible';
    });

    // Đặt trạng thái isPrinted thành true để hiển thị nút "Đóng"
    setIsPrinted(true);
  };

  return (
    <Modal
      isOpen={isPaid}
      onRequestClose={closeModal}
      style={{
        content: {
          width: '400px', // Kích thước cố định
          margin: 'auto', // Căn giữa
          textAlign: 'center',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền overlay
        }
      }}
      centered
    >
      <button onClick={handlePrint}>In hóa đơn</button>
      <div id="receiptToPrint">
        <Receipt data={sampleData} />
      </div>
      
      {/* Hiển thị nút "Đóng" sau khi in xong */}
      {isPrinted && (
        <button onClick={closeModal}>Đóng</button>
      )}
    </Modal>
  );
};

export default PaymentModal;
