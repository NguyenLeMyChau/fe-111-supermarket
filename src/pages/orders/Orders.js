import React from 'react';
import './Orders.scss';
import Overall from '../../containers/overall/Overall';
import Order from '../../containers/order/Order';
import AddOrder from '../../containers/order/AddOrder';

export default function Orders({ goBack }) {
    return (
        <div className='orders-page'>
            <button onClick={goBack}>Quay lại</button>
            <Overall />
            <AddOrder />
        </div>
    );
}

