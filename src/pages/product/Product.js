import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import Orders from '../orders/Orders';

export default function Product() {
    const products = useSelector((state) => state.commonData?.dataManager?.products) || [];
    const [selectedComponent, setSelectedComponent] = useState(null);

    const productColumns = [
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', width: '30%' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '35%' },
        { title: 'Barcode', dataIndex: 'barcode', key: 'barcode', width: '20%', className: 'text-center' },
        { title: 'Mã hàng', dataIndex: 'item_code', key: 'item_code', width: '15%', className: 'text-center' },
    ];

    const handleRowClick = () => {
        setSelectedComponent(<Orders goBack={() => setSelectedComponent(null)} />);
    };

    return (
        <FrameData
            title="Danh sách sản phẩm"
            buttonText="Thêm sản phẩm"
            data={products}
            columns={productColumns}
            onRowClick={handleRowClick}
            component={selectedComponent}
        />
    );
}