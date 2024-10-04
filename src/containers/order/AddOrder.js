import React from 'react';
import { useLocation } from 'react-router-dom';
import Button from "../../components/button/Button";
import './AddOrder.scss';
import Select from 'react-select';
import useAddOrder from '../../hooks/useAddOrder';

const AddOrder = () => {
    const location = useLocation();
    const selectedProducts = location.state?.selectedProduct?.warehousesWithProductNames || [];
    const supplier = location.state?.selectedProduct?.supplier || null;

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
        isLoadingSupplier
    } = useAddOrder(selectedProducts, supplier);

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
                                <th>Trạng thái</th>
                                <th>Số lượng đặt hàng</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.product_id}>
                                    <td>{product.product_name}</td>
                                    <td>{product.stock_quantity}</td>
                                    <td>{product.min_stock_threshold}</td>
                                    <td>
                                        <span className={product.status ? 'status-true' : 'status-false'}>
                                            {product.status ? 'Còn hàng' : 'Hết hàng'}
                                        </span>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantities[product.product_id]}
                                            onChange={(e) => handleQuantityChange(product.product_id, parseInt(e.target.value))}
                                            className="quantity-input"
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            text="Xóa"
                                            backgroundColor="#FF0000"
                                            onClick={() => handleRemoveProduct(product.product_id)}
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
