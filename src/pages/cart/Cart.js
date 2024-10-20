import { useState } from 'react';
import HeaderCustomer from '../../components/headerCustomer/HeaderCustomer';
import './Cart.scss';
import { IoWarning } from "react-icons/io5";
import { FiChevronRight } from "react-icons/fi";
import { MdChangeCircle } from "react-icons/md";
import { AiFillCloseCircle } from "react-icons/ai"; // Import icon
import PaymentModal from './PaymentModal';

export default function Cart() {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [userInfo] = useState({
        name: 'Nguyễn Văn A',
        phone: '0123456789',
        address: '485 Hương Lộ 3, Phường Bình Hưng Hòa, Quận Bình Tân, TP. Hồ Chí Minh'
    });

    const [products, setProducts] = useState([
        { id: 1, name: 'Coca chai 1L', unit: 'Chai', price: 15000, pricePromotion: 10000, quantity: 2, img: 'https://res.cloudinary.com/detikvnbw/image/upload/v1728208433/h5s4ci4bdqwbevsgieho.jpg' },
        { id: 2, name: 'Pepsi chai 390ml', unit: 'Chai', price: 8000, quantity: 1, img: 'https://res.cloudinary.com/detikvnbw/image/upload/v1728208434/bh7iwikjjhpnvam09epu.jpg' },
    ]);

    const handleIncrease = (id) => {
        setProducts(products.map(product =>
            product.id === id ? { ...product, quantity: product.quantity + 1 } : product
        ));
    };

    const handleDecrease = (id) => {
        setProducts(products.map(product =>
            product.id === id && product.quantity > 1 ? { ...product, quantity: product.quantity - 1 } : product
        ));
    };

    const handleDelete = (id) => {
        setProducts(products.filter(product => product.id !== id));
    };

    const handlePaymentMethodSelect = (method) => {
        console.log(method);
        setSelectedPaymentMethod(method);
    };

    return (
        <div className='cart-customer-container'>
            <header>
                <HeaderCustomer />
            </header>

            <main className='main'>
                <div className='main-header'>
                    <h3>Giỏ hàng</h3>
                </div>

                <div className='payment-info'>
                    <h5>Thông tin nhận hàng</h5>
                    <div className='content'>
                        {
                            userInfo ? (
                                <>
                                    <div className='info-text'>
                                        <p>{userInfo.address}</p>

                                        <div className='info-user'>
                                            <span>{userInfo.name}</span>
                                            <span>{userInfo.phone}</span>
                                        </div>
                                    </div>
                                    <MdChangeCircle size={35} color='#ff7b01' className="chevron-right" />

                                </>

                            ) : (
                                <>
                                    <div className="warning-text">
                                        <IoWarning size={25} color='#ff7b01' />
                                        <p>Nhập thông tin nhận hàng</p>
                                    </div>
                                    <FiChevronRight size={25} color='#ff7b01' className="chevron-right" />
                                </>
                            )
                        }
                    </div>
                </div>

                {/* Giỏ hàng */}
                <div className='cart-items'>
                    <h3>Giỏ hàng</h3>
                    <div className='items'>
                        {products.map(product => (
                            <div key={product.id} className='cart-item'>
                                {/* Nút xoá sản phẩm */}
                                <button className='delete-button' onClick={() => handleDelete(product.id)}>
                                    <AiFillCloseCircle size={30} color="#323C64" />
                                </button>
                                <img src={product.img} alt={product.name} />
                                <div className='item-details'>
                                    <div>
                                        <h4>{product.name}</h4>
                                        <span>{product.unit}</span>
                                    </div>

                                    <div className='item-price'>

                                        {product.pricePromotion ? (
                                            <>
                                                <p className='original-price'>{product.pricePromotion} đ</p>
                                                <p className='promotion-price'>{product.price} đ</p>
                                            </>
                                        ) : (
                                            <p className='original-price'>{product.price} đ</p>
                                        )}

                                        <div className='quantity-control'>
                                            <button onClick={() => handleDecrease(product.id)}>-</button>
                                            <input type='number' value={product.quantity} readOnly />
                                            <button onClick={() => handleIncrease(product.id)}>+</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer with Order Button */}
                <footer>
                    <div className='payment-method' onClick={() => setIsModalOpen(true)}>
                        <label htmlFor="payment">Phương thức thanh toán:</label>
                        {
                            selectedPaymentMethod.name ? (
                                <>
                                    <div className='detail'>
                                        <img src={selectedPaymentMethod.icon} alt={selectedPaymentMethod.name} className='payment-image' />
                                        <span>{selectedPaymentMethod.name}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='detail'>
                                        <span>Chọn phương thức thanh toán</span>
                                        <FiChevronRight size={25} color='#323C64' className="chevron-right" />
                                    </div>
                                </>
                            )
                        }
                    </div>


                    <button className='order-button'>Đặt hàng</button>
                </footer>

                {/* Payment Modal */}
                <PaymentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSelect={handlePaymentMethodSelect}
                    selectedPaymentMethod={selectedPaymentMethod}
                />

            </main>



        </div>
    );
}
