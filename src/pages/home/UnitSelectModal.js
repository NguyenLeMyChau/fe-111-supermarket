import React, { useState, useEffect } from 'react';
import useAddBill from '../../hooks/useAddBill';
import './ProductCustomer.scss';
import { TiDelete } from "react-icons/ti";
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/fotmatDate';
import { useSelector } from 'react-redux';

export default function UnitSelectModal({ isOpen, onClose, product }) {
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [productAddCart,setProductAddCart]=useState();
    const { getUnitDescription } = useAddBill();
    const [quantity, setQuantity] = useState(1);
    const { addCart } = useCart();
    const login = useSelector((state) => state.auth?.login?.currentUser);
    const categoriesCustomer = useSelector((state) => state.categoryCustomer?.categoriesCustomer) || [];
    const promotionPrice = 35000;
    const originalPrice = 50000;
    const normalPrice = 60000;
    const promotionDescription = 'Giảm giá 30%';
    console.log(product)

    useEffect(() => {
        if (isOpen && product.unit_convert.length > 0) {
            setSelectedUnit(product.unit_convert[0]);
        }
    }, [isOpen, product.unit_convert]);

    if (!isOpen) return null;

    const handleSelectUnit = (unit) => {
       
        const productGet = getProductByItem(unit.unit,product.item_code)
       
    if(productGet)
       setProductAddCart(productGet)
    setSelectedUnit(unit);
    };

    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrement = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };
    const findPriceByUnitAndCode = (unitId, itemCode) => {
        for (const category of categoriesCustomer) {
            const productMatch = category.products.find(p => p.item_code === itemCode && p.unit_id._id === unitId);
            if (productMatch) {
                return productMatch.price;
            }
        }
        return null;
    };

    const pricePromotionByItem = (unitId, itemCode) => {
        for (const category of categoriesCustomer) {
            const productMatch = category.products.find(p => p.item_code === itemCode && p.unit_id._id === unitId);
            if (productMatch) {
                return productMatch.promotions || [];
            }
        }
        return null;
    };
    const getProductByItem = (unitId, itemCode) => {
        for (const category of categoriesCustomer) {
            const productMatch = category.products.find(p => p.item_code === itemCode && p.unit_id._id === unitId);
            if (productMatch) {
                return productMatch;
            }
        }
        return null;
    };

    const handleAddCart = async () => {
       
        await addCart(productAddCart._id, productAddCart.unit_id._id,quantity, productAddCart.price*quantity);
        onClose()
    }

    return (
        <div className='unit-customer-modal-overlay' onClick={onClose}>
            <div className='modal-content-customer' onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <h3>{product.name}</h3>
                    <TiDelete size={30} onClick={onClose} className='close-icon' color='#323C64' />
                </div>

                <ul className='unit-list'>
                    {product.unit_convert.map((unit, idx) => {
                         const promotions = pricePromotionByItem(unit.unit, product.item_code);
                         const originalPrice = findPriceByUnitAndCode(unit.unit, product.item_code);
                         return (
                        
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

<div className="price">
                                            {promotions?.some(promo => promo.type === "amount") ? (
                                                <>
                                                    <span className="promotion-price">
                                                        {formatCurrency(originalPrice - promotions.find(promo => promo.type === "amount")?.amount_donate)}
                                                    </span>
                                                    <br />
                                                    <span className="original-price">{formatCurrency(originalPrice)}</span>
                                                </>
                                            ) : promotions?.some(promo => promo.type === "quantity") ? (
                                                <span className="original-price">{formatCurrency(originalPrice)}</span>
                                            ) : (
                                                <span className="normal-price">{formatCurrency(originalPrice)}</span>
                                            )}
                                        </div>
                                        {promotions && (
                                            <p className="promotion-description">
                                                {promotions[0]?.description}
                                            </p>
                                        )}
                                    </li>
                    )})}
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