import React from 'react';
import './Inventory.scss';
import Overall from '../../containers/overall/Overall';
import Product from '../../containers/product/Product';

export default function Inventory() {
    return (
        <div className='inventory-container'>
            <Overall />
            <Product />
        </div>
    );
}

