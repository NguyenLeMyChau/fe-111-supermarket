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
        handleQuantityChange,
        handleRemoveProduct,
        handleOrder,
        isLoading,
        billId,
        setBillId,
        units,
        handleUnitSelect,
        unitOptions,
        productOptions,
        getUnitDescription,
        handleAddProduct,
        handleProductSelect
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
            </div>

            <div className="product-list">
                <h4>Thông tin nhập:</h4>

                {products.length > 0 ? (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Mã hàng</th>
                                <th>Tên sản phẩm</th>
                                <th>Đơn vị tính</th>
                                <th style={{ textAlign: 'center' }}>Số lượng</th>
                                <th style={{ textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <td>
                                        <Select
                                            value={product.item_code ? { value: product.item_code, label: product.item_code } : null}
                                            onChange={(selectedOption) => handleProductSelect(index, selectedOption)}
                                            options={productOptions}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>
                                        <Select
                                            value={units[index] ? { value: units[index], label: getUnitDescription(units[index]) } : null}
                                            onChange={(selectedOption) => handleUnitSelect(index, selectedOption)}
                                            options={unitOptions(product)}
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantities[index] || 1}
                                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                            className="quantity-input"
                                            style={{ width: '60px', height: '20px', textAlign: 'center', fontSize: 16 }}
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleRemoveProduct(index)}
                                            style={{
                                                marginBottom: '10px',
                                                padding: '10px 20px',
                                                backgroundColor: '#FF0000',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: 14
                                            }}
                                        >
                                            Xoá
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                ) : (
                    <p className="no-products">Chưa có sản phẩm nào để hiển thị.</p>
                )}


                {/* Nút để thêm sản phẩm mới */}
                <button
                    onClick={handleAddProduct}
                    style={{
                        marginBottom: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#323C64',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: 20
                    }}
                >
                    +
                </button>

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
