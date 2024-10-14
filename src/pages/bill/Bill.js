import React, { useState } from 'react';
import { formatDate } from '../../utils/fotmatDate';
import FrameData from '../../containers/frameData/FrameData';
import { useLocation, useNavigate } from 'react-router';
import AddBill from './AddBill';
import { useSelector } from 'react-redux';
import BillDetail from './BillDetail';
import Modal from '../../components/modal/Modal';
import { CiEdit } from 'react-icons/ci';
import UpdateBill from './UpdateBill';

export default function Bill() {
    const navigate = useNavigate();
    const location = useLocation();

    const orders = useSelector((state) => state.order?.orders);
    const isAddBill = location.pathname.includes('add-bill');
    const [isBillDetail, setIsBillDetail] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);



    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    const handleEditClick = (event, product) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click của hàng bảng
        setSelectedBill(product);
        setIsEditModalOpen(true);
        console.log('product', product);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedBill(null);
    };

    const orderColumn = [
        {
            title: 'Mã phiếu nhập kho',
            dataIndex: 'bill_id',
            key: 'bill_id',
            width: '15%',
        },
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
        },
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

    const handleRowClick = async (order) => {
        setSelectedOrder(order);
        setIsBillDetail(true);
        console.log('order', order);
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
                        width={'60%'}
                    >
                        <BillDetail bill={selectedOrder} />
                    </Modal>
                ) : (
                    <>
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

                        {isEditModalOpen && (
                            <Modal
                                title='Cập nhật phiếu nhập kho'
                                isOpen={isEditModalOpen}
                                onClose={handleCloseEditModal}
                                width={'70%'}
                            >
                                <UpdateBill
                                    bill={selectedBill}
                                />
                            </Modal>
                        )}
                    </>
                )
            }


        </div>

    );
}

