import React from 'react';
import HeaderCustomer from '../../components/headerCustomer/HeaderCustomer';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router';
import './OrderCustomer.scss';

const OrderDetailCustomer = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    console.log(orderId);

    // Mock data cho order chi tiết
    const orderDetails = {
        orderId,
        orderDate: '2023-10-01',
        paymentMethod: 'Credit Card',
        totalAmount: 150000,
        customerInfo: {
            name: 'Nguyen Van A',
            phone: '0987654321',
            address: '123 Nguyen Trai, Thanh Xuan, Ha Noi',
        },
        products: [
            { id: 1, name: 'Product 1', quantity: 2, price: 50000 },
            { id: 2, name: 'Product 2', quantity: 1, price: 50000 },
        ],
    };

    return (
        <div className='cart-customer-container'>
            <header>
                <HeaderCustomer />
            </header>

            <main className='main'>
                <div className='main-header'>
                    <div className='product-customer-header-content'>
                        <IoChevronBackOutline size={25} onClick={() => navigate(-1)} />
                        <h3>Chi tiết đơn hàng {orderId}</h3>
                    </div>
                </div>

                <div className='order-detail-container'>
                    <section className='order-section'>
                        <h4>Thông tin nhận hàng</h4>
                        <p><strong>Tên:</strong> {orderDetails.customerInfo.name}</p>
                        <p><strong>Số điện thoại:</strong> {orderDetails.customerInfo.phone}</p>
                        <p><strong>Địa chỉ:</strong> {orderDetails.customerInfo.address}</p>
                    </section>

                    <section className='order-section'>
                        <h4>Thông tin thanh toán</h4>
                        <p><strong>Phương thức thanh toán:</strong> {orderDetails.paymentMethod}</p>
                        <p><strong>Ngày đặt hàng:</strong> {orderDetails.orderDate}</p>
                        <p><strong>Tổng tiền:</strong> {orderDetails.totalAmount.toLocaleString()} VND</p>
                    </section>

                    <section className='order-section'>
                        <h4>Danh sách sản phẩm</h4>
                        <ul>
                            {orderDetails.products.map((product) => (
                                <li key={product.id}>
                                    <p><strong>Tên sản phẩm:</strong> {product.name}</p>
                                    <p><strong>Số lượng:</strong> {product.quantity}</p>
                                    <p><strong>Giá:</strong> {product.price.toLocaleString()} VND</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

            </main>
        </div>
    );
};

export default OrderDetailCustomer;
