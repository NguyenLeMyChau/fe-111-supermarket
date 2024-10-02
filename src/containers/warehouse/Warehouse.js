import React from 'react';
import './Warehouse.scss';
import { useSelector } from 'react-redux';
import FrameData from '../frameData/FrameData';

export default function Warehouse() {
    const warehouses = useSelector((state) => state.warehouse?.warehouse);
    console.log('Warehouses:', warehouses);

    const warehouseColumn = [
        { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName', width: '40%' },
        { title: 'Tồn kho', dataIndex: 'stock_quantity', key: 'stock_quantity', width: '20%', className: 'text-center' },
        { title: 'Ngưỡng giá trị', dataIndex: 'min_stock_threshold', key: 'min_stock_threshold', width: '20%', className: 'text-center' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            className: 'text-center',
            render: (status) => (
                <span className={status ? 'status-true' : 'status-false'}>
                    {status ? 'Còn hàng' : 'Hết hàng'}
                </span>
            )
        },];

    return (
        <div>
            <FrameData
                title="Kho"
                buttonText="Thêm loại sản phẩm"
                data={warehouses}
                columns={warehouseColumn}
                itemsPerPage={10}
            />
        </div>
    );
}

