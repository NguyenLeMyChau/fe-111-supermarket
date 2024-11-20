import React, { useEffect, useState } from 'react';
import './Statistical.scss';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { FaPrint } from 'react-icons/fa';
import FrameData from '../../containers/frameData/FrameData';
import { formatDateDDMMYYYY } from '../../utils/fotmatDate';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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

    const handleExportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('DoanhThuBanHang');

        // Thêm thông tin cửa hàng
        worksheet.mergeCells('A1:F1');
        worksheet.getCell('A1').value = 'Tên cửa hàng: Siêu thị CAPY SMART';
        worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A1').font = { bold: true, size: 12 };

        worksheet.mergeCells('A2:F2');
        worksheet.getCell('A2').value = 'Địa chỉ: 14 Nguyễn Văn Bảo, Phường 14, Quận Gò Vấp, TPHCM';
        worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

        worksheet.mergeCells('A3:F3');
        worksheet.getCell('A3').value = `Ngày in: ${formatDateDDMMYYYY(new Date().toLocaleDateString())}`;
        worksheet.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' };

        // Thêm tiêu đề chính
        worksheet.mergeCells('A5:F5');
        worksheet.getCell('A5').value = 'Doanh số bán hàng theo ngày';
        worksheet.getCell('A5').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A5').font = { bold: true, size: 14 };

        // Thêm thời gian lọc
        worksheet.mergeCells('A6:F6');
        worksheet.getCell('A6').value = `Từ ngày: ${formatDateDDMMYYYY(startDate) || '---'} - Đến ngày: ${formatDateDDMMYYYY(endDate) || '---'}`;
        worksheet.getCell('A6').alignment = { horizontal: 'center', vertical: 'middle' };

        // Thêm Header
        const headers = ['Mã nhân viên', 'Tên nhân viên', 'Ngày', 'Chiết khấu', 'Doanh số trước CK', 'Doanh số sau CK'];
        worksheet.addRow(headers).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' },
            };
        });

        // Thêm dữ liệu
        groupedData.forEach((item) => {
            worksheet.addRow([
                item.employeeId || '',
                item.employee_name || '',
                item.createdAt || '',
                item.totalDiscount || 0,
                item.totalRevenueBeforeDiscount || 0,
                item.totalRevenueAfterDiscount || 0,
            ]);
        });

        // Định dạng cột
        worksheet.columns = [
            { width: 15 }, // Mã nhân viên
            { width: 25 }, // Tên nhân viên
            { width: 15 }, // Ngày
            { width: 15 }, // Chiết khấu
            { width: 20 }, // Doanh số trước CK
            { width: 20 }, // Doanh số sau CK
        ];

        // Xuất file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `DoanhThuBanHang_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };


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
                    <button onClick={handleExportExcel} className="print-button">
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


