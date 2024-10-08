import React from 'react';
import './Orders.scss';
import Overall from '../../containers/overall/Overall';
import Order from '../../containers/order/Order';
import { useLocation } from 'react-router-dom'; // Import useLocation
import AddOrder from '../../containers/order/AddOrder';

export default function Orders() {
    const location = useLocation();
    const isAddingOrder = location.pathname.includes('add-order');

    return (
        <div className='orders-page'>
            {isAddingOrder ? (
                <AddOrder />
            ) : (
                <>
                    <Overall />
                    <Order />
                </>
            )}
        </div>
    );
}