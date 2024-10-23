import React from 'react';
import Button from "../../components/button/Button";
import Select from 'react-select';
import { formatDate } from '../../utils/fotmatDate';
import useAddBill from '../../hooks/useAddBill';

const AddBill = () => {
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
        billId,
        setBillId,
        productOptions,
        handleProductSelect,
        units,
        handleUnitSelect,
        unitOptions,
        getUnitDescription
    } = useAddBill();

    return (
        <div className="add-order-container">
            <h2>Phiếu nhập kho</h2>
            <div className="order-info">
                <div className="info-group">
                    <label>Phiếu nhập kho:</label>
                    <input
                        type="text"
                        value={billId}
                        onChange={(e) => setBillId(e.target.value)}
                        placeholder="Nhập mã phiếu nhập kho"
                    />
                </div>
                <div className="info-group">
                    <label>Tên người nhập:</label>
                    <span>{ordererName}</span>
                </div>

                <div className="info-group">
                    <label>Ngày nhập:</label>
                    <span>{formatDate(Date.now())}</span>
                </div>

                <div className="info-group">
                    <label>Nhà cung cấp:</label>
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

            {selectedSupplier && (
                <div className="product-select">
                    <h4>Chọn sản phẩm theo mã hàng:</h4>
                    <Select
                        onChange={handleProductSelect}
                        options={productOptions}
                        placeholder="Chọn mã sản phẩm"
                    />
                </div>
            )}

            <div className="product-list">
                <h4>Thông tin nhập:</h4>
                {products.length > 0 ? (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Mã hàng</th>
                                <th>Tên sản phẩm</th>
                                <th>Đơn vị tính</th>
                                <th>Số lượng</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.item_code}</td>
                                    <td>{product.name}</td>
                                    <td>
                                        <Select
                                            value={units[index] ? { value: units[index], label: getUnitDescription(units[index]) } : null}
                                            onChange={(selectedOption) => handleUnitSelect(index, selectedOption)}
                                            options={unitOptions(product)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantities[index] || 1} // Sử dụng index để lấy số lượng
                                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))} // Truyền index
                                            className="quantity-input"
                                        />
                                    </td>

                                    <td>
                                        <Button
                                            text="Xóa"
                                            backgroundColor="#FF0000"
                                            onClick={() => handleRemoveProduct(index)}
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
                    <p className='loading'>Đang tạo phiếu nhập...</p>
                ) : (
                    products.length > 0 && (
                        <Button
                            text="Xác nhận nhập kho"
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

export default AddBill;
