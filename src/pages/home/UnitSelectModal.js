import React, { useState, useEffect } from 'react';
import useAddBill from '../../hooks/useAddBill';
import './ProductCustomer.scss';
import { TiDelete } from "react-icons/ti";

export default function UnitSelectModal({ isOpen, onClose, units, productName }) {
    const [selectedUnit, setSelectedUnit] = useState(null);
    const { getUnitDescription } = useAddBill();
    const [quantity, setQuantity] = useState(1);

    const promotionPrice = 35000;
    const originalPrice = 50000;
    const normalPrice = 60000;
    const promotionDescription = 'Giảm giá 30%';

    useEffect(() => {
        if (isOpen && units.length > 0) {
            setSelectedUnit(units[0]);
        }
    }, [isOpen, units]);

    if (!isOpen) return null;

    const handleSelectUnit = (unit) => {
        setSelectedUnit(unit);
    };

    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrement = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    return (
        <div className='unit-customer-modal-overlay' onClick={onClose}>
            <div className='modal-content-customer' onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <h3>{productName}</h3>
                    <TiDelete size={30} onClick={onClose} className='close-icon' color='#323C64' />
                </div>

                <ul className='unit-list'>
                    {units.map((unit, idx) => (
                        <li key={idx} className='unit-item'>
                            <img src={unit.img} alt={unit.name} className='unit-img' />
                            <div className='unit-details'>
                                <p>{getUnitDescription(unit.unit)}</p>
                            </div>

                            <input
                                type="checkbox"
                                checked={selectedUnit === unit}
                                onChange={() => handleSelectUnit(unit)}
                                style={{ width: 20, height: 20 }}
                            />

                            <p className="price">
                                {
                                    promotionPrice ? (
                                        <>
                                            <span className="promotion-price">{promotionPrice.toLocaleString()}đ</span>
                                            <br />
                                            <span className="original-price">{originalPrice.toLocaleString()}đ</span>
                                        </>
                                    ) : (
                                        <span className="normal-price">{normalPrice.toLocaleString()}đ</span>
                                    )
                                }
                            </p>
                            {promotionDescription && <p className="promotion-description">{promotionDescription}</p>}

                        </li>
                    ))}
                </ul>

                <div className='quantity-buy'>
                    <div className='quantity-info'>
                        <p>Số lượng</p>
                        <button onClick={handleDecrement} className='quantity-button'>-</button>
                        <input type="number" min="1" value={quantity} readOnly className='quantity-input' />
                        <button onClick={handleIncrement} className='quantity-button'>+</button>
                    </div>
                    <button className='buy-button'>MUA</button>
                </div>
            </div>
        </div>
    );
}