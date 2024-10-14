import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { CiEdit } from 'react-icons/ci';

export default function Unit() {
    const units = useSelector((state) => state.unit?.units) || [];

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);

    const handleEditClick = (event, unit) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click của hàng bảng
        setSelectedUnit(unit);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUnit(null);
    };

    const unitColumn = [
        { title: 'Đơn vị tính', dataIndex: 'description', key: 'description' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', className: 'text-center' },
        {
            title: 'Chỉnh sửa',
            key: 'edit',
            width: '10%',
            className: 'text-center',
            render: (text, record) => (
                <CiEdit
                    style={{ color: 'blue', cursor: 'pointer' }}
                    size={25}
                    onClick={(event) => handleEditClick(event, record)}
                />
            ),
        },
    ];

    return (
        <div>
            <FrameData
                title="Đơn vị tính"
                buttonText="Thêm đơn vị tính"
                data={units}
                columns={unitColumn}
            />
        </div>
    );
}
