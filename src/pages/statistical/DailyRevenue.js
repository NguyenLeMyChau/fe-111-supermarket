import React, { useState } from 'react';
import './Statistical.scss';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { FaPrint } from 'react-icons/fa';
import FrameData from '../../containers/frameData/FrameData';
import { formatDate, formatDateDDMMYYYY } from '../../utils/fotmatDate';

export default function DailyRevenue() {
    const employeeAndManager = useSelector((state) => state.employee?.employeeAndManager) || [];
    const invoices = useSelector((state) => state.invoice?.invoices) || [];
    console.log('invoices:', invoices);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleFilter = () => {
        console.log('Lọc với:', { selectedEmployee, startDate, endDate });
    };

    const handleResetFilter = () => {
        setSelectedEmployee(null);
        setStartDate('');
        setEndDate('');
        console.log('Đã hủy lọc');
    };

    const employeeOptions = employeeAndManager.map((employee) => ({
        value: employee._id,
        label: employee.name,
    }));

    // Lọc và hiển thị dữ liệu invoices có employee_id
    const filteredInvoices = invoices
        .filter((invoice) => invoice.employee_id)
        .map((invoice, index) => {
            const employee = employeeAndManager.find((emp) => emp._id === invoice.employee_id);
            return {
                stt: index + 1,
                ...invoice,
                employeeId: employee?.employee_id,
                employee_name: employee?.name,
            };
        });

    console.log('filteredInvoices:', filteredInvoices);

    // Group invoices by employee_id and formatted createdAt (dd/MM/yyyy)
    const groupedInvoices = filteredInvoices.reduce((acc, invoice) => {
        // Format the createdAt to dd/MM/yyyy
        const formattedDate = formatDateDDMMYYYY(invoice.createdAt); // Assuming formatDate gives 'dd/MM/yyyy'

        const groupKey = `${invoice.employeeId}-${formattedDate}`; // Combine employeeId and formatted createdAt to form a unique key

        // If the groupKey does not exist, create an empty array for it
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }

        // Add the invoice to the correct group
        acc[groupKey].push(invoice);

        return acc;
    }, {});

    // Flatten the grouped invoices for easier display
    const groupedAndFlattenedInvoices = Object.values(groupedInvoices).map((group, index) => {
        // The first invoice in the group can be used for displaying the grouped info (like employee name)
        const { employee_name, employeeId, createdAt } = group[0];
        return group.map((invoice, i) => ({
            stt: index * group.length + i + 1, // Adjust the STT (index) for each row
            ...invoice,
            employee_name,
            employeeId,
            createdAt: formatDateDDMMYYYY(createdAt), // Format createdAt to display in dd/MM/yyyy format
        }));
    }).flat();

    console.log('Grouped and flattened invoices:', groupedAndFlattenedInvoices);

    // Cấu hình các cột cho bảng FrameData
    const invoiceColumns = [
        { title: 'STT', dataIndex: 'stt', key: 'stt', width: '10%' },
        { title: 'Mã nhân viên', dataIndex: 'employeeId', key: 'employeeId', width: '15%' },
        { title: 'Tên nhân viên', dataIndex: 'employee_name', key: 'employee_name', width: '20%' },
        {
            title: 'Ngày', dataIndex: 'createdAt', key: 'createdAt', width: '15%',
            render: (date) => (
                <div>{formatDate(date)}</div>
            )
        },
        { title: 'Chiết khấu', dataIndex: 'discount', key: 'discount', width: '10%' },
        { title: 'Doanh số trước CK', dataIndex: 'revenue_before_discount', key: 'revenue_before_discount', width: '15%' },
        { title: 'Doanh số sau CK', dataIndex: 'revenue_after_discount', key: 'revenue_after_discount', width: '15%' }
    ];

    return (
        <div className='statistical-page'>
            <div className='filter-statistical'>
                <h3>Lọc doanh số bán hàng theo ngày</h3>
                <div className='filter-row'>
                    <div className='filter-item'>
                        <label htmlFor="employee">Tên nhân viên:</label>
                        <Select
                            id="employee"
                            options={employeeOptions}
                            value={selectedEmployee}
                            onChange={setSelectedEmployee}
                            placeholder="Chọn nhân viên"
                            menuPortalTarget={document.body}
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    minWidth: '200px',
                                }),
                                menuPortal: base => ({ ...base, zIndex: 9999, width: 200 }),
                            }}
                        />
                    </div>
                    <div className='filter-item'>
                        <label htmlFor="start-date">Ngày bắt đầu:</label>
                        <input
                            type="date"
                            id="start-date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className='filter-item'>
                        <label htmlFor="end-date">Ngày kết thúc:</label>
                        <input
                            type="date"
                            id="end-date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <button onClick={handleFilter} className="filter-button">
                        Lọc
                    </button>
                    <button onClick={handleResetFilter} className="reset-button">
                        Hủy Lọc
                    </button>
                    <button onClick={handleFilter} className="print-button">
                        <FaPrint className="print-icon" /> In
                    </button>
                </div>
            </div>

            <div>
                <FrameData
                    title="Thống kê doanh thu bán hàng theo ngày"
                    data={filteredInvoices}
                    columns={invoiceColumns}
                />

            </div>
        </div>
    );
}
