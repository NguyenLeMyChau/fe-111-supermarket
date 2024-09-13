import React from 'react';
import './Orders.scss';
import Overall from '../../containers/overall/Overall';
import Order from '../../containers/order/Order';

export default function Orders() {
    return (
        <div className='orders-page'>
            <Overall />
            <Order />
        </div>
    );
}

