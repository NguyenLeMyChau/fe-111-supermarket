import React, { createContext, useContext, useState } from 'react';

// Tạo context
const PaymentModalContext = createContext();

// Tạo provider
export const PaymentModalProvider = ({ children }) => {
    const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState({});

    const [previousCart, setPreviousCart] = useState(null);


    return (
        <PaymentModalContext.Provider value={{
            isPaymentModalVisible,
            setPaymentModalVisible,
            paymentInfo,
            setPaymentInfo,
            paymentMethod,
            setPaymentMethod,
            previousCart,
            setPreviousCart
        }}>
            {children}
        </PaymentModalContext.Provider>
    );
};

// Hook để sử dụng context
export const usePaymentModal = () => useContext(PaymentModalContext);