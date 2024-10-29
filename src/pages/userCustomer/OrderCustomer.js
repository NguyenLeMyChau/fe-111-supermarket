import React, { useEffect } from 'react';
import './OrderCustomer.scss';
import HeaderCustomer from '../../components/headerCustomer/HeaderCustomer';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import useUser from '../../hooks/useUser';
import { useSelector } from 'react-redux';

const OrderCustomer = () => {
    const navigate = useNavigate();
    const { getInvoice } = useUser();
    const invoiceCustomer = useSelector(state => state.invoiceCustomer?.invoicesCustomer);
    console.log('invoiceCustomer', invoiceCustomer);

    useEffect(() => {
        const fetchInvoice = async () => {
            await getInvoice();
        };

        fetchInvoice();
    }, []);

    // Mock orders data
    const orders = [
        {
            orderId: '123456789',
            orderDate: '2023-10-01',
            paymentMethod: 'Credit Card',
            totalAmount: 150000,
        },
        {
            orderId: '987654321',
            orderDate: '2023-09-25',
            paymentMethod: 'PayPal',
            totalAmount: 200000,
        },
    ];

    const handleOrderClick = (orderId) => {
        navigate(`/customer/order-detail/${orderId}`);
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
                        <h3>Đơn hàng của tôi</h3>
                    </div>
                </div>

                <div className='order-customer-container'>
                    {orders.map((order, index) => (
                        <div key={index} className='order-details' onClick={() => handleOrderClick(order.orderId)}>
                            <div className='order-info'>
                                <p><strong>Order ID:</strong> {order.orderId}</p>
                                <p><strong>Order Date:</strong> {order.orderDate}</p>
                                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                <p><strong>Total Amount:</strong> {order.totalAmount.toLocaleString()} VND</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default OrderCustomer;