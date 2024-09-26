import React from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import AddEmployee from './AddEmployee';

export default function Employee() {
    const employees = useSelector((state) => state.commonData?.dataManager?.employees) || [];

    const columns = [
        { title: 'Họ và tên', dataIndex: 'name', key: 'name', width: '45%' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', width: '30%' },
        { title: 'Email', dataIndex: 'email', key: 'email', width: '35%' },
    ];
    const handleAddEmployee = (employeeData) => {
        console.log('New Employee Data:', employeeData);
        // Add your logic to store the employee data (e.g., sending to an API or updating state)
    };
    return (
        <FrameData
            title="Danh sách nhân viên"
            buttonText="Thêm nhân viên"
            data={employees}
            columns={columns}
            renderModal={(onClose) => (
                <AddEmployee
                    isOpen={true}
                    onClose={onClose}
                    onAdd={handleAddEmployee}
                />
            )} />


    );
}