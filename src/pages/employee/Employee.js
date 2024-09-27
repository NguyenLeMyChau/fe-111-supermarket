import React from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import AddEmployee from './AddEmployee';
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdDoNotDisturbAlt } from 'react-icons/md';

export default function Employee() {
    const employees = useSelector((state) => state.commonData?.dataManager?.employees) || [];
    console.log(employees);

    const columns = [
        { title: 'Họ và tên', dataIndex: 'name', key: 'name', width: '30%' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', width: '20%' },
        { title: 'Email', dataIndex: 'email', key: 'email', width: '20%' },
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
        },];

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
                />
            )} />


    );
}