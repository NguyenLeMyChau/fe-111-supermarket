import React, { useState, useEffect } from 'react';
import useAddBill from '../../hooks/useAddBill';
import './ProductCustomer.scss';
import { TiDelete } from "react-icons/ti";
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/fotmatDate';

export default function UnitSelectModal({ isOpen, onClose, product }) {
    const [selectedUnit, setSelectedUnit] = useState(null);
    const { getUnitDescription } = useAddBill();
    const [quantity, setQuantity] = useState(1);
    const { addCart } = useCart();

    const promotionPrice = 35000;
    const originalPrice = 50000;
    const normalPrice = 60000;
    const promotionDescription = 'Giảm giá 30%';

    useEffect(() => {
        if (isOpen && product.unit_convert.length > 0) {
            setSelectedUnit(product.unit_convert[0]);
        }
    }, [isOpen, product.unit_convert]);

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

    const handleAddCart = async () => {
        console.log('selectedUnit', selectedUnit);
        await addCart(product._id, selectedUnit.unit, 1, 10000);
    }

    return (
        <div className='unit-customer-modal-overlay' onClick={onClose}>
            <div className='modal-content-customer' onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <h3>{product.name}</h3>
                    <TiDelete size={30} onClick={onClose} className='close-icon' color='#323C64' />
                </div>

                <ul className='unit-list'>
                    {product.unit_convert.map((unit, idx) => (
                        <li key={unit.unit} className='unit-item'>
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
                                            <div style={{ textAlign: "center" }}>

                                                <span className="promotion-price">{formatCurrency(promotionPrice)}</span>
                                                <br />
                                                <span className="original-price">{formatCurrency(originalPrice)}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="normal-price">{formatCurrency(normalPrice)}</span>
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
                    <button className='buy-button' onClick={handleAddCart}>MUA</button>
                </div>
            </div>
        </div>
    );
}