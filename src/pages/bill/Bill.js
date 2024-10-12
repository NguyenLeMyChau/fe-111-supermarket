import React from 'react';
import { formatDate } from '../../utils/fotmatDate';
import FrameData from '../../containers/frameData/FrameData';
import { useLocation, useNavigate } from 'react-router';
import AddBill from './AddBill';
import { useSelector } from 'react-redux';

export default function Bill() {
    const navigate = useNavigate();
    const location = useLocation();
    const orders = useSelector((state) => state.order?.orders);
    const isAddBill = location.pathname.includes('add-bill');

    const orderColumn = [
        {
            title: 'Nhà cung cấp',
            dataIndex: 'supplierName',
            key: 'supplierName',
            width: '30%',
            render: (text, record) => record.supplier_id.name
        },
        {
            title: 'Người nhập phiếu',
            dataIndex: 'employeeName',
            key: 'employeeName',
            width: '20%',
            render: (text, record) => record.employee ? record.employee.name : 'Không xác định'
        },
        {
            title: 'Ngày nhập phiếu',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '20%',
            className: 'text-center',
            render: (date) => formatDate(date)
        }
    ];

    const handleRowClick = (order) => {

    };

    return (
        <div>
            {
                isAddBill ? (
                    <AddBill />
                ) : (
                    <FrameData
                        title="Phiếu nhập kho"
                        buttonText="Thêm phiếu nhập"
                        data={orders}
                        columns={orderColumn}
                        onRowClick={handleRowClick}
                        onButtonClick={() => {
                            navigate('/admin/bill/add-bill');
                        }}
                    />
                )
            }


        </div>

    );
}

