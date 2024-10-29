import React, { useState, useEffect } from 'react';
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
        setUnits, // Add setUnits to update the units array
        handleUnitSelect,
        unitOptions,
        productOptions,
        getUnitDescription,
        handleAddProduct,
        handleProductSelect,
        description,
        setDescription
    } = useAddBill();

    const [duplicateError, setDuplicateError] = useState(false);
    const [duplicateDetails, setDuplicateDetails] = useState([]);
    const [missingFieldsError, setMissingFieldsError] = useState(false);

    useEffect(() => {
        const checkForDuplicates = () => {
            const seen = new Set();
            const duplicates = [];
            for (let i = 0; i < products.length; i++) {
                const key = `${products[i].item_code}-${units[i]}`;
                if (seen.has(key)) {
                    duplicates.push({ item_code: products[i].item_code, unit: units[i] });
                }
                seen.add(key);
            }
            if (duplicates.length > 0) {
                setDuplicateError(true);
                setDuplicateDetails(duplicates);
            } else {
                setDuplicateError(false);
                setDuplicateDetails([]);
            }
        };

        const checkForMissingFields = () => {
            for (let i = 0; i < products.length; i++) {
                if (!products[i].item_code || !units[i]) {
                    setMissingFieldsError(true);
                    return;
                }
            }
            setMissingFieldsError(false);
        };

        checkForDuplicates();
        checkForMissingFields();
    }, [products, units]);

    const handleProductSelectWithReset = (index, selectedOption) => {
        handleProductSelect(index, selectedOption);
        const newUnits = [...units];
        newUnits[index] = null; // Reset the unit for the selected product
        setUnits(newUnits);
    };

    return (
        <div className="add-order-container">
            <h2>Phiếu nhập kho</h2>
            <div className="order-info">
                <div className='flex-row'>
                    <div className="info-group" style={{ width: 500, marginLeft: 150 }}>
                        <label>Phiếu nhập kho:</label>
                        <input
                            type="text"
                            value={billId}
                            onChange={(e) => setBillId(e.target.value)}
                            placeholder="Nhập mã phiếu nhập kho"
                        />
                    </div>

                    <div className="info-group">
                        <label>Mô tả:</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Nhập mô tả"
                            style={{ width: 350 }}
                        />
                    </div>
                </div>

                <div className='flex-row'>
                    <div className="info-group" style={{ width: 500, marginLeft: 150 }}>
                        <label>Tên người nhập:</label>
                        <span>{ordererName}</span>
                    </div>

                    <div className="info-group">
                        <label>Ngày nhập:</label>
                        <span>{formatDate(Date.now())}</span>
                    </div>
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
                                            onChange={(selectedOption) => handleProductSelectWithReset(index, selectedOption)}
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


                {duplicateError && (
                    <div className="error-message" style={{ color: 'red', fontSize: 14 }}>
                        <p>Có sản phẩm trùng mã hàng và đơn vị tính:</p>
                        <ul>
                            {duplicateDetails.map((detail, index) => (
                                <li key={index}>
                                    Mã hàng: {detail.item_code}, Đơn vị tính: {getUnitDescription(detail.unit)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {missingFieldsError && (
                    <div className="error-message" style={{ color: 'red', fontSize: 14 }}>
                        <p>Có sản phẩm chưa có mã hàng hoặc đơn vị tính.</p>
                    </div>
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
                            className={duplicateError || missingFieldsError ? 'disabled-button' : 'confirm-button'}
                            disabled={duplicateError || missingFieldsError}
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default AddBill;