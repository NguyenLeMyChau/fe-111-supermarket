import React, { useEffect } from 'react';
import './OrderCustomer.scss';
import HeaderCustomer from '../../components/headerCustomer/HeaderCustomer';
import { IoChevronBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import useUser from '../../hooks/useUser';
import { useSelector } from 'react-redux';
import { formatCurrency, formatDate } from '../../utils/fotmatDate';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

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

    const handleOrderClick = (order) => {
        navigate(`/customer/order-detail/${order._id}`, { state: { order } });
    };

    const sortedInvoiceCustomer = [...invoiceCustomer].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


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
                    {sortedInvoiceCustomer.map((order, index) => (
                        <div key={index} className='order-details' onClick={() => handleOrderClick(order)}>
                            <div className='order-info'>
                                <div className='order-customer-header'>
                                    <p className='order-id'><strong>Mã đơn hàng:</strong> {order._id}</p>
                                    <div className='order-date'>
                                        <p>{formatDate(order.createdAt)}</p>
                                        <p className='relative-time'>{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: vi })}</p>
                                    </div>
                                </div>
                                <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
                                <p><strong>Tổng tiền:</strong> {formatCurrency(order.paymentAmount)}</p>

                            </div>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
};

export default OrderCustomer;