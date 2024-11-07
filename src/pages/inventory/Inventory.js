import React from 'react';
import './Inventory.scss';
import Overall from '../../containers/overall/Overall';
import Warehouse from '../../containers/warehouse/Warehouse';

export default function Inventory() {
    return (
        <div className='inventory-container'>
            {/* <Overall /> */}
            <Warehouse />
        </div>
    );
}

