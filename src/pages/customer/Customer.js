import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import Modal from '../../components/modal/Modal';
import { CiEdit } from "react-icons/ci";
import UpdateCustomer from './UpdateCustomer';
import AddCustomer from './AddCustomer';

export default function Customer() {
    const customers = useSelector((state) => state.customer?.customers) || [];
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedEmployee(null);
    };

    const employeeColumns = [
        { title: 'Mã khách hàng', dataIndex: 'customer_id', key: 'customer_id', width: '15%' },
        { title: 'Họ và tên', dataIndex: 'name', key: 'name', width: '15%', sortable: true },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', width: '10%' },
        { title: 'Email', dataIndex: 'email', key: 'email', width: '10%' },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: '25%',
            render: (address) => {
                if (!address) return '';
                const { street, ward, district, city } = address;
                return `${street}, ${ward}, ${district}, ${city}`;
            }
        },
        { title: 'Giới tính', dataIndex: 'gender', key: 'gender', width: '10%', render: (gender) => gender ? 'Nữ' : 'Nam', sortable: true },
        {
            title: 'Chỉnh sửa',
            key: 'edit',
            width: '10%',
            className: 'text-center',
            render: (text, record) => (
                <CiEdit
                    style={{ color: 'blue', cursor: 'pointer' }}
                    size={25}
                    onClick={() => handleEditClick(record)}
                />
            ),
        },
    ];

    return (
        <>
            <FrameData
                title="Danh sách khách hàng"
                buttonText="Thêm khách hàng"
                data={customers}
                columns={employeeColumns}
                renderModal={(onClose) => (
                    <AddCustomer
                        isOpen={true}
                        onClose={onClose}
                    />
                )}
            />

            {isEditModalOpen && (
                <Modal
                    title='Cập nhật khách hàng'
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    width={'30%'}
                >
                    <UpdateCustomer
                        customer={selectedEmployee}
                    />
                </Modal>
            )}
        </>


    );
}