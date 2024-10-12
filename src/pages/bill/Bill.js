import React, { useState } from 'react';
import { formatDate } from '../../utils/fotmatDate';
import FrameData from '../../containers/frameData/FrameData';
import { useLocation, useNavigate } from 'react-router';
import AddBill from './AddBill';
import { useSelector } from 'react-redux';
import BillDetail from './BillDetail';
import Modal from '../../components/modal/Modal';

export default function Bill() {
    const navigate = useNavigate();
    const location = useLocation();

    const orders = useSelector((state) => state.order?.orders);
    const isAddBill = location.pathname.includes('add-bill');
    const [isBillDetail, setIsBillDetail] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

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

    const handleRowClick = async (order) => {
        setSelectedOrder(order);
        setIsBillDetail(true);
    };

    return (
        <div>
            {
                isAddBill ? (
                    <AddBill />
                ) : isBillDetail ? (
                    <Modal
                        title={'Thông tin phiếu nhập'}
                        isOpen={isBillDetail}
                        onClose={() => setIsBillDetail(false)}
                    >
                        <BillDetail bill={selectedOrder} />
                    </Modal>
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

