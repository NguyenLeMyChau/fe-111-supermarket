import React from 'react';
import './Supplier.scss';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';

export default function Supplier() {
    const suppliers = useSelector((state) => state.commonData?.dataManager?.suppliers) || [];

    const columns = [
        { title: 'Nhà cung cấp', dataIndex: 'name', key: 'name', width: '50%' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', width: '30%' },
        { title: 'Email', dataIndex: 'email', key: 'email', width: '30%' },
    ];

    return (
        <FrameData
            title="Nhà cung cấp"
            buttonText="Thêm nhà cung cấp"
            data={suppliers}
            columns={columns}
        />
    );
}