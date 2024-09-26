import React from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';

export default function Category() {
    const categories = useSelector((state) => state.commonData?.dataManager?.categories) || [];

    const columns = [
        { title: 'Loại sản phẩm', dataIndex: 'name', key: 'name', width: '50%' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '50%' },
    ];

    return (
        <FrameData
            title="Loại sản phẩm"
            buttonText="Thêm loại sản phẩm"
            data={categories}
            columns={columns}
        />
    );
}