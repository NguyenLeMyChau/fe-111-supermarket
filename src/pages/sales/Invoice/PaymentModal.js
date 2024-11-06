import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Receipt from "./Receipt";
import "./Receipt.scss";
import { getInvoiceById } from "../../../services/cartRequest";

const PaymentModal = ({ isPaid, closeModal, accessToken, axiosJWT, invoiceId }) => {
  const [isPrinted, setIsPrinted] = useState(false);
  const [data, setData] = useState(null);
console.log(invoiceId)
console.log(isPaid)
  // Gọi API để lấy dữ liệu hóa đơn khi modal mở
  useEffect(() => {
    if (isPaid && invoiceId) {
      const fetchInvoice = async () => {
        try {
          const invoiceData = await getInvoiceById(accessToken, axiosJWT, invoiceId);     
          console.log(invoiceData)
          setData(invoiceData);
        } catch (error) {
          console.error("Failed to fetch invoice data:", error);
        }
      };

      fetchInvoice();
    }
  }, [isPaid, invoiceId, accessToken, axiosJWT]);

  // Hàm in hóa đơn
  const handlePrint = () => {
    const receiptContent = document.getElementById("receiptToPrint");
    const bodyChildren = document.body.children;

    // Ẩn tất cả các phần tử không phải là hóa đơn
    Array.from(bodyChildren).forEach((child) => {
      if (child !== receiptContent) {
        child.style.visibility = "hidden";
      }
    });

    // In hóa đơn
    window.print();

    // Sau khi in xong, hiển thị lại các phần đã ẩn
    Array.from(bodyChildren).forEach((child) => {
      child.style.visibility = "visible";
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
          width: "400px", // Kích thước cố định
          margin: "auto", // Căn giữa
          textAlign: "center",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền overlay
        },
      }}
      centered
    >
      <button onClick={handlePrint}>In hóa đơn</button>
      <div id="receiptToPrint">
        {data ? <Receipt data={data} /> : <p>Loading...</p>}
      </div>
      
      {/* Hiển thị nút "Đóng" sau khi in xong */}
      {isPrinted && (
        <button onClick={closeModal}>Đóng</button>
      )}
    </Modal>
  );
};

export default PaymentModal;
