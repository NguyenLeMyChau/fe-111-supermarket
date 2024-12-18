import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import AddEmployee from './AddEmployee';
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdDoNotDisturbAlt } from 'react-icons/md';
import UpdateEmployee from './UpdateEmployee';
import Modal from '../../components/modal/Modal';
import { CiEdit } from "react-icons/ci";

export default function Employee() {
    const employees = useSelector((state) => state.employee?.employees) || [];
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
        { title: 'Mã nhân viên', dataIndex: 'employee_id', key: 'employee_id', width: '20%' },
        { title: 'Họ và tên', dataIndex: 'name', key: 'name', width: '20%' },
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
        { title: 'Giới tính', dataIndex: 'gender', key: 'gender', width: '10%', render: (gender) => gender ? 'Nữ' : 'Nam' },
        {
            title: 'Hoạt động',
            dataIndex: 'active',
            key: 'active',
            width: '20%',
            className: 'text-center',
            render: (active) =>
                active
                    ? <IoIosCheckmarkCircleOutline style={{ color: 'green' }} size={20} />
                    : <MdDoNotDisturbAlt style={{ color: 'red' }} size={20} />
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
                    onClick={() => handleEditClick(record)}
                />
            ),
        },
    ];

    return (
        <>
            <FrameData
                title="Danh sách nhân viên"
                buttonText="Thêm nhân viên"
                data={employees}
                columns={employeeColumns}
                renderModal={(onClose) => (
                    <AddEmployee
                        isOpen={true}
                        onClose={onClose}
                    />
                )}
            />
            {isEditModalOpen && (
                <Modal
                    title='Cập nhật nhân viên'
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    width={'30%'}
                >
                    <UpdateEmployee
                        employee={selectedEmployee}
                    />
                </Modal>
            )}
        </>


    );
}