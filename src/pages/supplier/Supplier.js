import React from 'react';
import './Supplier.scss';
import Button from '../../components/button/Button';
import { IoFilterOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';

export default function Supplier() {
    const suppliers = useSelector((state) => state.commonData?.dataManager?.suppliers);

    return (
        <div className='supplier-container'>
            <header className='flex-row-space-between'>
                <h3>Suppliers</h3>
                <div className='flex-row-align-center'>
                    <Button
                        text='Add Supplier'
                        backgroundColor='#1366D9'
                        className='text-sm font-weight-medium'
                    />

                    <Button
                        text='Filters'
                        className='text-sm font-weight-medium text-black'
                        border='1px solid #D0D3D9'
                        icon={<IoFilterOutline size={20} />}
                    />
                </div>
            </header>

            <main>
                {suppliers && suppliers.map((supplier) => (
                    <div key={supplier.id} className='supplier-card'>
                        <div className='flex-row-space-between'>
                            <h4>{supplier.name}</h4>
                            <Button
                                text='Edit'
                                className='text-sm font-weight-medium'
                            />
                        </div>
                        <p>{supplier.phone}</p>
                        <p>{supplier.email}</p>
                    </div>
                ))}
            </main>
        </div>
    );
}

