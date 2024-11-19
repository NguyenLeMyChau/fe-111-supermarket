import React, { useEffect, useState } from 'react';
import './Statistical.scss';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { FaPrint } from 'react-icons/fa';
import FrameData from '../../containers/frameData/FrameData';
import { formatDateDDMMYYYY } from '../../utils/fotmatDate';

export default function DailyRevenue() {
    const employeeAndManager = useSelector((state) => state.employee?.employeeAndManager) || [];
    const invoices = useSelector((state) => state.invoice?.invoices) || [];

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [groupedData, setGroupedData] = useState([]); // state for grouped data

    // Group invoices by employeeId and createdAt by default
    useEffect(() => {
        const groupedInvoices = invoices.reduce((groups, invoice) => {
            if (!invoice.employee_id) return groups;  // Loại bỏ hóa đơn không có employee_id

            const employee = employeeAndManager.find((emp) => emp._id === invoice.employee_id);
            const groupKey = `${invoice.employee_id}-${formatDateDDMMYYYY(invoice.createdAt)}`;

            if (!groups[groupKey]) {
                groups[groupKey] = {
                    employeeId: employee?.employee_id,
                    employee_name: employee?.name,
                    createdAt: formatDateDDMMYYYY(invoice.createdAt),
                    totalDiscount: 0,
                    totalRevenueBeforeDiscount: 0,
                    totalRevenueAfterDiscount: 0,
                    invoices: []
                };
            }

            groups[groupKey].totalDiscount += invoice.discount || 0;
            groups[groupKey].totalRevenueBeforeDiscount += invoice.revenue_before_discount || 0;
            groups[groupKey].totalRevenueAfterDiscount += invoice.revenue_after_discount || 0;
            groups[groupKey].invoices.push(invoice);

            return groups;
        }, {});

        setGroupedData(Object.values(groupedInvoices)); // Set the grouped data by default
        console.log('groupedInvoices:', groupedInvoices);
    }, [invoices, employeeAndManager]);

    const handleFilter = () => {
        console.log('Lọc với:', { selectedEmployee, startDate, endDate });

        // Filter invoices based on selected employee and date range
        const filteredInvoices = invoices
            .filter((invoice) => {
                const isEmployeeMatch = selectedEmployee ? invoice.employee_id === selectedEmployee.value : true;
                const isStartDateMatch = startDate ? formatDateDDMMYYYY(invoice.createdAt) >= formatDateDDMMYYYY(startDate) : true;
                const isEndDateMatch = endDate ? formatDateDDMMYYYY(invoice.createdAt) <= formatDateDDMMYYYY(endDate) : true;
                return isEmployeeMatch && isStartDateMatch && isEndDateMatch;
            });
        console.log('filteredInvoices:', filteredInvoices);
        // Group filtered invoices by employeeId and createdAt
        const groupedInvoices = filteredInvoices.reduce((groups, invoice) => {
            if (!invoice.employee_id) return groups;  // Loại bỏ hóa đơn không có employee_id
            const employee = employeeAndManager.find((emp) => emp._id === invoice.employee_id);
            const groupKey = `${invoice.employee_id}-${formatDateDDMMYYYY(invoice.createdAt)}`;

            if (!groups[groupKey]) {
                groups[groupKey] = {
                    employeeId: employee?.employee_id,
                    employee_name: employee?.name,
                    createdAt: formatDateDDMMYYYY(invoice.createdAt),
                    totalDiscount: 0,
                    totalRevenueBeforeDiscount: 0,
                    totalRevenueAfterDiscount: 0,
                    invoices: []
                };
            }

            groups[groupKey].totalDiscount += invoice.discount || 0;
            groups[groupKey].totalRevenueBeforeDiscount += invoice.revenue_before_discount || 0;
            groups[groupKey].totalRevenueAfterDiscount += invoice.revenue_after_discount || 0;
            groups[groupKey].invoices.push(invoice);

            return groups;
        }, {});

        setGroupedData(Object.values(groupedInvoices)); // Update grouped data based on filter
        console.log('groupedInvoices after filter:', groupedInvoices);
    };

    const handleResetFilter = () => {
        setSelectedEmployee(null);
        setStartDate('');
        setEndDate('');
        console.log('Đã hủy lọc');
        setGroupedData([]); // Reset grouped data if needed

        // Reset to original data (unfiltered)
        const groupedInvoices = invoices.reduce((groups, invoice) => {
            if (!invoice.employee_id) return groups;

            const employee = employeeAndManager.find((emp) => emp._id === invoice.employee_id);
            const groupKey = `${invoice.employee_id}-${formatDateDDMMYYYY(invoice.createdAt)}`;

            if (!groups[groupKey]) {
                groups[groupKey] = {
                    employeeId: employee?.employee_id,
                    employee_name: employee?.name,
                    createdAt: formatDateDDMMYYYY(invoice.createdAt),
                    totalDiscount: 0,
                    totalRevenueBeforeDiscount: 0,
                    totalRevenueAfterDiscount: 0,
                    invoices: []
                };
            }

            groups[groupKey].totalDiscount += invoice.discount || 0;
            groups[groupKey].totalRevenueBeforeDiscount += invoice.revenue_before_discount || 0;
            groups[groupKey].totalRevenueAfterDiscount += invoice.revenue_after_discount || 0;
            groups[groupKey].invoices.push(invoice);

            return groups;
        }, {});

        setGroupedData(Object.values(groupedInvoices)); // Restore original grouped data
    };

    const employeeOptions = employeeAndManager.map((employee) => ({
        value: employee._id,
        label: employee.name,
    }));

    const invoiceColumns = [
        { title: 'Mã nhân viên', dataIndex: 'employeeId', key: 'employeeId', width: '15%' },
        { title: 'Tên nhân viên', dataIndex: 'employee_name', key: 'employee_name', width: '20%' },
        { title: 'Ngày', dataIndex: 'createdAt', key: 'createdAt', width: '15%' },
        { title: 'Chiết khấu', dataIndex: 'totalDiscount', key: 'totalDiscount', width: '10%' },
        { title: 'Doanh số trước CK', dataIndex: 'totalRevenueBeforeDiscount', key: 'totalRevenueBeforeDiscount', width: '15%' },
        { title: 'Doanh số sau CK', dataIndex: 'totalRevenueAfterDiscount', key: 'totalRevenueAfterDiscount', width: '15%' },
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
                    data={groupedData}
                    columns={invoiceColumns}
                />
            </div>
        </div>
    );
}


