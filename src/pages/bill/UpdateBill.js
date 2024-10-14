import React, { useState } from 'react';
import { formatDate } from '../../utils/fotmatDate';
import '../../containers/order/AddOrder.scss';
import Button from '../../components/button/Button';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { updateBill } from '../../services/warehouseRequest';

const UpdateBill = ({ bill }) => {
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();

    const [billId, setBillId] = useState(bill.bill_id);
    const [products, setProducts] = useState(bill.products);
    const [isLoading, setIsLoading] = useState(false);

    const handleBillIdChange = (e) => {
        setBillId(e.target.value);
    };

    const handleQuantityChange = (index, value) => {
        const updatedProducts = products.map((product, i) =>
            i === index ? { ...product, quantity: value } : product
        );
        setProducts(updatedProducts);
    };

    const handleUpdateBill = async () => {
        try {
            setIsLoading(true);
            // Xử lý cập nhật phiếu nhập kho
            console.log('bill', bill)
            console.log('Cập nhật phiếu nhập kho:', { billId, products });
            // Thêm logic cập nhật phiếu nhập kho tại đây
            await updateBill(bill.bill_id, billId, products, accessToken, axiosJWT);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <div className="add-order-container">
            <h2>Phiếu nhập kho</h2>
            <div className="order-info">
                <div className='flex-row'>
                    <div className="info-group" style={{ width: 500, marginLeft: 70 }}>
                        <label>Mã phiếu nhập kho:</label>
                        <input
                            type="text"
                            value={billId}
                            onChange={handleBillIdChange}
                            className="bill-id-input"
                        />
                    </div>
                    <div className="info-group">
                        <label>Ngày nhập:</label>
                        <span>{formatDate(bill.createdAt)}</span>
                    </div>
                </div>

                <div className='flex-row'>
                    <div className="info-group" style={{ width: 500, marginLeft: 70 }}>
                        <label>Tên người nhập:</label>
                        <span>{bill.employee.name}</span>
                    </div>

                    <div className="info-group">
                        <label>Nhà cung cấp:</label>
                        <span>{bill.supplier_id.name}</span>
                    </div>
                </div>
            </div>

            <div className="product-list">
                <h4>Thông tin nhập:</h4>

                {products.length > 0 && (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Mã sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Đơn vị tính</th>
                                <th style={{ textAlign: 'center' }}>Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product._id}>
                                    <td>{product.item_code}</td>
                                    <td>{product.name}</td>
                                    <td>{product.unit_name}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <input
                                            type="number"
                                            min="1"
                                            value={product.quantity}
                                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                            className="quantity-input"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <div className="flex-row-center" style={{ textAlign: 'center', marginTop: 20 }}>
                {isLoading ? (
                    <p className='loading'>Đang cập nhật...</p>
                ) : (
                    products.length > 0 && (
                        <Button
                            text="Cập nhật phiếu nhập"
                            backgroundColor="#1366D9"
                            onClick={handleUpdateBill}
                            className="confirm-button"
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default UpdateBill;