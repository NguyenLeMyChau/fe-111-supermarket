import React from 'react';
import './Order.scss';
import FrameData from '../frameData/FrameData';
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/fotmatDate';
import { useNavigate } from 'react-router';

export default function Order() {
    const navigate = useNavigate();

    const orders = useSelector((state) => state.order?.orders);

    const orderColumn = [
        {
            title: 'Nhà cung cấp',
            dataIndex: 'supplierName',
            key: 'supplierName',
            width: '30%',
            render: (text, record) => record.supplier_id.name
        },
        {
            title: 'Người đặt',
            dataIndex: 'employeeName',
            key: 'employeeName',
            width: '30%',
            render: (text, record) => record.employee ? record.employee.name : 'Không xác định'
        },
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '20%',
            render: (date) => formatDate(date)
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
        },
    ];

    return (
        <FrameData
            title="Đặt hàng"
            buttonText="Thêm đơn hàng"
            data={orders}
            columns={orderColumn}
            onButtonClick={() => {
                navigate('/admin/order/add-order');
            }}
        />
    );
}

