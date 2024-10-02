// AddOrder.js
import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import Button from "../../components/button/Button";

const AddOrder = () => {
    const location = useLocation();
    const selectedProducts = location.state?.selectedProducts || []; // Nhận thông tin sản phẩm đã chọn

    const handleOrder = () => {
        console.log("Đặt hàng với sản phẩm:", selectedProducts);
    };

    return (
        <div className="order-container">
            <h2>Đặt hàng</h2>
            {selectedProducts.length > 0 ? (
                <div>
                    <h4>Thông tin sản phẩm đã chọn:</h4>
                    <ul>
                        {selectedProducts.map((product, index) => (
                            <li key={index}>{product.product_name} - {product.stock_quantity} VNĐ</li>
                        ))}
                    </ul>
                    <Button
                        text="Xác nhận đặt hàng"
                        backgroundColor="#1366D9"
                        onClick={handleOrder}
                    />
                </div>
            ) : (
                <p>Không có sản phẩm nào được chọn để đặt hàng.</p>
            )}
        </div>
    );
};

export default AddOrder;
