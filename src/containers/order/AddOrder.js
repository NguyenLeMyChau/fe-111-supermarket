import React from 'react';
import { useLocation } from 'react-router-dom';
import Button from "../../components/button/Button";
import './AddOrder.scss';
import Select from 'react-select';
import useAddOrder from '../../hooks/useAddOrder';
import { formatCurrency, getStatusColor } from '../../utils/fotmatDate';

const AddOrder = () => {
    const location = useLocation();
    const selectedProducts = location.state?.selectedProduct || [];
    const supplierId = location.state?.selectedProduct[0]?.product.supplier_id || null;


    const {
        quantities,
        products,
        ordererName,
        selectedSupplier,
        handleQuantityChange,
        handleRemoveProduct,
        handleOrder,
        handleSupplierSelect,
        supplierOptions,
        isLoading,
        isLoadingSupplier,
    } = useAddOrder(selectedProducts, supplierId);

    return (
        <div className="add-order-container">
            <h2>Đặt hàng</h2>
            <div className="order-info">
                <div className="info-group">
                    <label>Tên người đặt:</label>
                    <span>{ordererName}</span>
                </div>

                <div className="info-group">
                    <label>Tên nhà cung cấp:</label>
                    <span>{selectedSupplier ? selectedSupplier.label : 'Chưa chọn nhà cung cấp'}</span>
                </div>
            </div>

            <div className="supplier-list">
                <h4>Chọn nhà cung cấp:</h4>
                <Select
                    value={selectedSupplier}
                    onChange={handleSupplierSelect}
                    options={supplierOptions}
                    placeholder="Chọn nhà cung cấp"
                />
            </div>

            <div className="product-list">
                <h4>Thông tin sản phẩm đã chọn:</h4>
                {isLoadingSupplier ? (
                    <p className='loading'>Đang tải thông tin sản phẩm...</p>
                ) : products.length > 0 ? (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng tồn kho</th>
                                <th>Số lượng ngưỡng</th>
                                <th>Giá trị quy đổi</th>
                                <th>Giá nhập</th>
                                <th>Trạng thái</th>
                                <th>Số lượng (Thùng)</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.product._id}>
                                    <td>{product.product.name}</td>
                                    <td>{product.stock_quantity}</td>
                                    <td>{product.min_stock_threshold}</td>
                                    <td>{product.unit_convert}</td>
                                    <td>{formatCurrency(product.order_Price)}</td>
                                    <td>
                                        <span style={{ color: getStatusColor(product.status), fontWeight: 500, fontSize: 16 }}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantities[product.product._id]}
                                            onChange={(e) => handleQuantityChange(product.product._id, parseInt(e.target.value))}
                                            className="quantity-input"
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            text="Xóa"
                                            backgroundColor="#FF0000"
                                            onClick={() => handleRemoveProduct(product.product._id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-products">Chưa có sản phẩm nào để hiển thị.</p>
                )}


                {isLoading ? (
                    <p className='loading'>Đang xử lý đơn đặt hàng...</p>
                ) : (
                    products.length > 0 && (
                        <Button
                            text="Xác nhận đặt hàng"
                            backgroundColor="#1366D9"
                            onClick={handleOrder}
                            className="confirm-button"
                        />
                    )
                )}
            </div>
        </div>
    );

};

export default AddOrder;
