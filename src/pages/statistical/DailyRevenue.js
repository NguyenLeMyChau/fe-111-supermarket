import React, { useEffect, useState } from 'react';
import './Statistical.scss';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { FaPrint } from 'react-icons/fa';
import FrameData from '../../containers/frameData/FrameData';
import { formatCurrency, formatDateDDMMYYYY } from '../../utils/fotmatDate';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function DailyRevenue() {
    const employeeAndManager = useSelector((state) => state.employee?.employeeAndManager) || [];
    const invoices = useSelector((state) => state.invoice?.invoices) || [];
    console.log('invoices:', invoices);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [groupedData, setGroupedData] = useState([]); // state for grouped data

    const groupInvoices = (invoicesList) => {
        return invoicesList.reduce((groups, invoice) => {
            if (!invoice.employee_id || invoice.isRefund === true) return groups; // Skip if no employee_id or isRefund is true
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
                    invoices: [],
                };
            }
            groups[groupKey].totalDiscount += invoice.discountPayment || 0;
            groups[groupKey].totalRevenueBeforeDiscount += invoice.totalPayment || 0;
            groups[groupKey].totalRevenueAfterDiscount += invoice.paymentAmount || 0;
            groups[groupKey].invoices.push(invoice);
            return groups;
        }, {});
    };

    const groupInvoicesEmployee = (invoicesList) => {
        return invoicesList.reduce((groups, invoice) => {
            if (!invoice.employeeId) return groups;
            const groupKey = `${invoice.employeeId}`;
            if (!groups[groupKey]) {
                groups[groupKey] = {
                    employeeId: invoice.employeeId,
                    createdAt: formatDateDDMMYYYY(invoice.createdAt),
                    totalDiscount: 0,
                    totalRevenueBeforeDiscount: 0,
                    totalRevenueAfterDiscount: 0,
                    data: [],
                };
            }
            groups[groupKey].totalDiscount += invoice.discountPayment || 0;
            groups[groupKey].totalRevenueBeforeDiscount += invoice.totalPayment || 0;
            groups[groupKey].totalRevenueAfterDiscount += invoice.paymentAmount || 0;
            groups[groupKey].data.push(invoice);
            return groups;
        }, {});
    };


    // Group invoices by employeeId and createdAt by default
    useEffect(() => {
        const groupedInvoices = groupInvoices(invoices);
        // Sắp xếp dữ liệu đã nhóm theo khóa `${invoice.employee_id}-${formatDateDDMMYYYY(invoice.createdAt)}`
        // Sắp xếp dữ liệu đã nhóm
        const sortedGroupedData = Object.values(groupedInvoices).sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            const employeeCompare = a.employeeId.localeCompare(b.employeeId);

            return employeeCompare !== 0 ? employeeCompare : dateA - dateB;
        });

        setGroupedData(sortedGroupedData); // Set the grouped data by default
        console.log('groupedInvoices:', groupedInvoices);
        const groupedInvoicesEmployee = groupInvoicesEmployee(sortedGroupedData);
        console.log('groupedInvoicesEmployee:', groupedInvoicesEmployee);
    }, [invoices, employeeAndManager]);

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number); // Tách ngày, tháng, năm và chuyển thành số
        return new Date(year, month - 1, day); // Tạo đối tượng Date (lưu ý tháng bắt đầu từ 0)
    };

    const handleExportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('DoanhThuBanHang', { views: [{ showGridLines: false }] });

        // Xác định ngày sớm nhất và ngày hiện tại
        const currentDate = new Date();
        const earliestDate = groupedData.length
            ? new Date(Math.min(...groupedData.map(item => parseDate(item.createdAt).getTime())))
            : currentDate;

        const startDateToUse = startDate || earliestDate;
        const endDateToUse = endDate || currentDate;

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
        worksheet.getCell('A6').value = `Từ ngày: ${formatDateDDMMYYYY(startDateToUse)} - Đến ngày: ${formatDateDDMMYYYY(endDateToUse)}`;
        worksheet.getCell('A6').alignment = { horizontal: 'center', vertical: 'middle' };

        // Thêm Header
        const headers = ['Mã nhân viên', 'Tên nhân viên', 'Ngày', 'Doanh số trước CK', 'Chiết khấu', 'Doanh số sau CK'];
        worksheet.addRow(headers).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' },
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // Tính tổng
        let totalDiscount = 0;
        let totalRevenueBeforeDiscount = 0;
        let totalRevenueAfterDiscount = 0;

        // Thêm dữ liệu
        groupedData.forEach((item) => {
            const revenueBefore = item.totalRevenueBeforeDiscount || 0;
            const discount = item.totalDiscount || 0;
            const revenueAfter = item.totalRevenueAfterDiscount || 0;

            totalRevenueBeforeDiscount += revenueBefore;
            totalDiscount += discount;
            totalRevenueAfterDiscount += revenueAfter;

            const row = worksheet.addRow([
                item.employeeId || '',
                item.employee_name || '',
                item.createdAt || '',
                formatCurrency(revenueBefore),
                formatCurrency(discount),
                formatCurrency(revenueAfter),
            ]);

            // Căn phải cho các cột tiền
            row.getCell(4).alignment = { horizontal: 'right' };
            row.getCell(5).alignment = { horizontal: 'right' };
            row.getCell(6).alignment = { horizontal: 'right' };

            // Đóng viền cho các ô
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        });

        // Thêm dòng tổng cộng
        worksheet.addRow([]);
        const totalRow = worksheet.addRow([
            'Tổng cộng',
            '',
            '',
            formatCurrency(totalRevenueBeforeDiscount),
            formatCurrency(totalDiscount),
            formatCurrency(totalRevenueAfterDiscount),


        ]);

        totalRow.eachCell((cell, colNumber) => {
            if (colNumber > 3) {
                cell.font = { bold: true };
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFDDDDDD' },
                };
            }

            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // Định dạng cột
        worksheet.columns = [
            { width: 15 }, // Mã nhân viên
            { width: 25 }, // Tên nhân viên
            { width: 15 }, // Ngày
            { width: 20 }, // Doanh số trước CK
            { width: 15 }, // Chiết khấu
            { width: 20 }, // Doanh số sau CK
        ];

        // Xuất file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `DoanhThuBanHang_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };


    const parseDateFilter = (date, isEndDate = false) => {
        if (!date) return null;

        const parsedDate = new Date(date);
        if (isEndDate) {
            // Nếu là ngày kết thúc, đặt thời gian thành cuối ngày (23:59:59)
            parsedDate.setHours(23, 59, 59, 999);
        }
        return parsedDate;
    };


    const handleFilter = () => {
        console.log('Lọc với:', { selectedEmployee, startDate, endDate });

        // Chuyển đổi startDate và endDate
        const startDateParsed = parseDateFilter(startDate);
        const endDateParsed = parseDateFilter(endDate, true);

        // Lọc invoices
        const filteredInvoices = invoices.filter((invoice) => {
            const invoiceDate = new Date(invoice.createdAt);

            const isEmployeeMatch = selectedEmployee
                ? invoice.employee_id === selectedEmployee.value
                : true;

            const isStartDateMatch = startDateParsed
                ? invoiceDate >= startDateParsed
                : true;

            const isEndDateMatch = endDateParsed
                ? invoiceDate <= endDateParsed
                : true;

            console.log('Invoice Date:', invoiceDate);
            console.log('isStartDateMatch:', isStartDateMatch, 'isEndDateMatch:', isEndDateMatch);

            return isEmployeeMatch && isStartDateMatch && isEndDateMatch;
        });

        console.log('Filtered Invoices:', filteredInvoices);

        // Gộp dữ liệu
        const groupedInvoices = groupInvoices(filteredInvoices);

        // Sắp xếp dữ liệu đã nhóm
        const sortedGroupedData = Object.values(groupedInvoices).sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            const employeeCompare = a.employeeId.localeCompare(b.employeeId);

            return employeeCompare !== 0 ? employeeCompare : dateA - dateB;
        });

        // Cập nhật dữ liệu đã lọc và sắp xếp
        setGroupedData(sortedGroupedData);

        console.log('Grouped and Sorted Data:', sortedGroupedData);
    };



    const handleResetFilter = () => {
        setSelectedEmployee(null);
        setStartDate('');
        setEndDate('');
        console.log('Đã hủy lọc');
        setGroupedData([]); // Reset grouped data if needed

        const groupedInvoices = groupInvoices(invoices);

        // Sắp xếp dữ liệu đã nhóm theo khóa `${invoice.employee_id}-${formatDateDDMMYYYY(invoice.createdAt)}`
        // Sắp xếp dữ liệu đã nhóm
        const sortedGroupedData = Object.values(groupedInvoices).sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            const employeeCompare = a.employeeId.localeCompare(b.employeeId);

            return employeeCompare !== 0 ? employeeCompare : dateA - dateB;
        });

        setGroupedData(sortedGroupedData); // Restore original grouped data
    };

    const employeeOptions = employeeAndManager.map((employee) => ({
        value: employee._id,
        label: employee.name,
    }));

    const invoiceColumns = [
        { title: 'Mã nhân viên', dataIndex: 'employeeId', key: 'employeeId', width: '15%' },
        { title: 'Tên nhân viên', dataIndex: 'employee_name', key: 'employee_name', width: '20%' },
        { title: 'Ngày', dataIndex: 'createdAt', key: 'createdAt', width: '15%' },
        {
            title: 'Doanh số trước CK',
            dataIndex: 'totalRevenueBeforeDiscount',
            key: 'totalRevenueBeforeDiscount',
            width: '15%',
            className: 'text-right',
            render: (value) => formatCurrency(value)
        },
        {
            title: 'Chiết khấu', className: 'text-right',
            dataIndex: 'totalDiscount', key: 'totalDiscount', width: '10%', render: (value) => formatCurrency(value)
        },
        {
            title: 'Doanh số sau CK', className: 'text-right',
            dataIndex: 'totalRevenueAfterDiscount', key: 'totalRevenueAfterDiscount', width: '15%', render: (value) => formatCurrency(value)
        },
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
                                menuPortal: base => ({ ...base, zIndex: 1000, width: 200 }),
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
                        Hủy
                    </button>
                    <button onClick={handleExportExcel} className="print-button">
                        <FaPrint className="print-icon" /> Excel
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


