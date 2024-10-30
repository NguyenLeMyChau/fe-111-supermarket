import React, { useState } from 'react';
import HeaderCustomer from '../../components/headerCustomer/HeaderCustomer';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router';
import './OrderCustomer.scss';
import { formatCurrency, formatDate } from '../../utils/fotmatDate';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const OrderDetailCustomer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { order } = location.state || {};
    const { street, ward, district, city } = order.paymentInfo.address;

    console.log('order', order)

    const [products] = useState([
        { id: 1, name: 'Coca chai 1L', promotion: 'Mua 2 tặng 1', unit: 'Chai', price: 15000, pricePromotion: 10000, quantity: 2, img: 'https://res.cloudinary.com/detikvnbw/image/upload/v1728208433/h5s4ci4bdqwbevsgieho.jpg' },
        { id: 2, name: 'Pepsi chai 390ml', unit: 'Chai', price: 8000, quantity: 1, img: 'https://res.cloudinary.com/detikvnbw/image/upload/v1728208434/bh7iwikjjhpnvam09epu.jpg' },
        { id: 3, name: 'Pepsi chai 390ml', unit: 'Chai', price: 8000, quantity: 1, img: 'https://res.cloudinary.com/detikvnbw/image/upload/v1728208434/bh7iwikjjhpnvam09epu.jpg' },
    ]);

    if (!order) {
        return <p>Không tìm thấy đơn hàng.</p>;
    }

    return (
        <div className='cart-customer-container'>
            <header>
                <HeaderCustomer />
            </header>

            <main className='main'>
                <div className='main-header'>
                    <div className='product-customer-header-content'>
                        <IoChevronBackOutline size={25} onClick={() => navigate(-1)} />
                        <h3>Chi tiết đơn hàng {order._id}</h3>
                    </div>
                </div>


                <div className='payment-info'>
                    <h5>Thông tin nhận hàng</h5>
                    <div className='content'>
                        <div className='info-text' style={{ width: '100%' }}>
                            <div className='order-customer-header' style={{ width: '100%' }}>
                                <p>{`${street}, ${ward}, ${district}, ${city}`}</p>
                                <div className='order-date'>
                                    <p>{formatDate(order.createdAt)}</p>
                                    <p className='relative-time' style={{ marginTop: -10 }}>{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: vi })}</p>
                                </div>
                            </div>

                            <div className='info-user'>
                                <span>{order.paymentInfo.name}</span>
                                <span>{order.paymentInfo.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tổng tiền */}
                <div className="payment-total" style={{ marginTop: 0, paddingBottom: 40 }}>
                    <h4>Thanh toán</h4>
                    <div className="payment-info-total">
                        <p>Phương thức thanh toán <span>{order.paymentMethod}</span></p>
                        <p>Tiền hàng: <span>2.000.000 VND</span></p>
                        <p>Giảm giá: <span>Miễn phí</span></p>
                        <p>Thanh toán: <span>2.000.000 VND</span></p>
                    </div>
                </div>

                {/* Giỏ hàng */}
                <div className='cart-items'>
                    <h3>Sản phẩm</h3>
                    <div className='items'>
                        {products.map(product => (
                            <div key={product.id} className='cart-item'>

                                <img src={product.img} alt={product.name} />
                                <div className='item-details'>
                                    <div>
                                        <h4>{product.name} - {product.unit}</h4>
                                        <span>Số lượng: {product.quantity}</span> <br />
                                        <span style={{ color: '#dc3545', fontWeight: 600 }}>{product.promotion}</span>
                                    </div>

                                    <div className='item-price'>

                                        {product.pricePromotion ? (
                                            <>
                                                <p className='original-price' style={{ fontWeight: 500, fontSize: 16 }}>{formatCurrency(product.pricePromotion)}</p>
                                                <p className='promotion-price' style={{ fontSize: 14 }}>{formatCurrency(product.price)}</p>
                                            </>
                                        ) : (
                                            <p className='original-price' style={{ fontWeight: 500, fontSize: 16 }}>{formatCurrency(product.price)}</p>
                                        )}
                                        <p className='original-price' style={{ fontWeight: 700, fontSize: 18 }}>Tổng tiền: {formatCurrency(product.price)}</p>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>




            </main>
        </div>
    );
};

export default OrderDetailCustomer;
