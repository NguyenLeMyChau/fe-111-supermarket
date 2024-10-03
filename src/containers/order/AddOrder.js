import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Button from "../../components/button/Button";
import './AddOrder.scss';
import { useSelector } from 'react-redux';
import Select from 'react-select';

const AddOrder = () => {
    const location = useLocation();
    const selectedProducts = location.state?.selectedProducts || [];
    const user = useSelector((state) => state.auth?.login?.currentUser.user);
    const suppliers = useSelector((state) => state.commonData?.dataManager?.suppliers) || [];

    const [quantities, setQuantities] = useState(
        selectedProducts.reduce((acc, product) => {
            acc[product.product_id] = 1;
            return acc;
        }, {})
    );

    const [products, setProducts] = useState(selectedProducts);
    const [ordererName, setOrdererName] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState(null); // Initialize as null

    useEffect(() => {
        if (user) {
            setOrdererName(user.name);
        }
        if (products.length > 0) {
            // Set default supplier as an object if products are available
            setSelectedSupplier({ value: products[0].supplier_name, label: products[0].supplier_name });
        }
    }, [user, products]);

    const handleQuantityChange = (productId, value) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: value < 1 ? 1 : value,
        }));
    };

    const handleRemoveProduct = (productId) => {
        setProducts(products.filter(product => product.product_id !== productId));
        setQuantities((prevQuantities) => {
            const newQuantities = { ...prevQuantities };
            delete newQuantities[productId];
            return newQuantities;
        });
    };

    const handleOrder = () => {
        console.log("Đặt hàng với sản phẩm:", products);
        console.log("Thông tin người đặt:", ordererName);
        console.log("Thông tin nhà cung cấp:", selectedSupplier);
    };

    const handleSupplierSelect = (selectedOption) => {
        setSelectedSupplier(selectedOption); // Set selected option correctly
    };

    // Map suppliers to the format expected by react-select
    const supplierOptions = suppliers.map(supplier => ({
        value: supplier.name,
        label: supplier.name,
    }));

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
                    <span>{selectedSupplier ? selectedSupplier.label : 'Chưa chọn nhà cung cấp'}</span> {/* Check if selectedSupplier is not null */}
                </div>
            </div>

            <div className="supplier-list">
                <h4>Chọn nhà cung cấp:</h4>
                <Select
                    value={selectedSupplier} // Use the object here
                    onChange={handleSupplierSelect}
                    options={supplierOptions} // Pass in the supplier options
                    placeholder="Chọn nhà cung cấp"
                />
            </div>

            {products.length > 0 ? (
                <div className="product-list">
                    <h4>Thông tin sản phẩm đã chọn:</h4>
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng tồn kho</th>
                                <th>Số lượng ngưỡng</th>
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
                    <Button
                        text="Xác nhận đặt hàng"
                        backgroundColor="#1366D9"
                        onClick={handleOrder}
                        className="confirm-button"
                    />
                </div>
            ) : (
                <p>Không có sản phẩm nào</p>
            )}
        </div>
    );
};

export default AddOrder;
