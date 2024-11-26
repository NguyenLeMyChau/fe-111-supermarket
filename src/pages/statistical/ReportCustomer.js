import React, { useEffect, useState } from 'react';
import './Statistical.scss';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { FaPrint } from 'react-icons/fa';
import FrameData from '../../containers/frameData/FrameData';
import { formatCurrency, formatDateDDMMYYYY } from '../../utils/fotmatDate';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function ReportCustomer() {
    const customers = useSelector((state) => state.customer?.customers) || [];
    const invoices = useSelector((state) => state.invoice?.invoices) || [];
    console.log('invoicesCustomer:', invoices);
    const units = useSelector((state) => state.unit?.units) || [];

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [groupedData, setGroupedData] = useState([]); // state for grouped data


    const groupInvoices = (invoicesList) => {
        return invoicesList.reduce((groups, invoice) => {
            if (!invoice.customer_id || invoice.isRefund === true) return groups;
            const customer = customers.find((cus) => cus.account_id === invoice.customer_id);
            const groupKey = `${invoice.customer_id}-${formatDateDDMMYYYY(invoice.createdAt)}`;
            if (!groups[groupKey]) {
                groups[groupKey] = {
                    customerId: invoice.customer_id,
                    customerName: customer?.name,
                    customerPhone: customer?.phone,
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


    const calculateTotal = (data) => {
        return data.reduce((result, invoice) => {
            // Duyệt qua từng phần tử trong mảng `invoices` của hóa đơn
            invoice.invoices.forEach(({ customer_id, details, discountPayment, totalPayment }) => {
                // Nếu chưa có dữ liệu cho khách hàng này, khởi tạo
                if (!result[customer_id]) {
                    result[customer_id] = {
                        customerInfo: customer_id,
                        items: [] // Danh sách các item
                    };
                }


                // Duyệt qua từng sản phẩm trong `details`
                details.forEach(({ item_code, unit_id, price, total, quantity }) => {

                    // Tìm item trong danh sách nếu đã tồn tại
                    const existingItem = result[customer_id].items.find(
                        (item) => item.item_code === item_code && item.unit_id === unit_id
                    );

                    // Tính giá trị chiết khấu nếu discountPayment > 0
                    let discountValue = 0;
                    if (discountPayment > 0 && totalPayment > 0) {
                        discountValue = discountPayment * (total / totalPayment);
                    }

                    if (existingItem) {
                        // Cập nhật nếu đã tồn tại
                        existingItem.totalQuantity += quantity;
                        existingItem.totalBeforePrice += price * quantity;
                        existingItem.totalDiscount += price * quantity - total + discountValue;
                        existingItem.totalAfterPrice += total - discountValue;
                    } else {
                        // Thêm mới nếu chưa tồn tại
                        result[customer_id].items.push({
                            item_code,
                            unit_id,
                            totalQuantity: quantity,
                            totalBeforePrice: price * quantity,
                            totalDiscount: price * quantity - total + discountValue,
                            totalAfterPrice: total - discountValue,
                        });
                    }
                });
            });

            return result;
        }, {});
    };


    const transformTotalToArray = (total) => {
        console.log('total transformTotalToArray:', total);
        return Object.values(total).flatMap(({ customerInfo, items }) =>
            (items || []).map(({ item_code, unit_id, totalQuantity, totalBeforePrice, totalAfterPrice, totalDiscount }) => ({
                customerInfo,
                item_code,
                unit_id,
                totalQuantity,
                totalBeforePrice,
                totalAfterPrice,
                totalDiscount,
            }))
        );
    };

    // Group invoices by employeeId and createdAt by default
    useEffect(() => {
        const groupedInvoices = groupInvoices(invoices);
        // Sắp xếp dữ liệu đã nhóm theo khóa `${invoice.employee_id}-${formatDateDDMMYYYY(invoice.createdAt)}`
        const sortedGroupedData = Object.values(groupedInvoices).sort((a, b) => {
            const keyA = `${a.employeeId}-${a.createdAt}`;
            const keyB = `${b.employeeId}-${b.createdAt}`;
            return keyA.localeCompare(keyB);
        });

        console.log('groupedInvoices:', groupedInvoices);

        const total = calculateTotal(sortedGroupedData);
        console.log('total:', total);
        const transformedData = transformTotalToArray(total); // Chuyển đổi thành mảng
        setGroupedData(transformedData); // Cập nhật groupedData
        console.log('transformedData:', transformedData);
    }, [invoices, customers]);

    const handleFilter = () => {
        console.log('Lọc với:', { selectedEmployee, startDate, endDate });

        // Filter invoices based on selected employee and date range
        const filteredInvoices = invoices
            .filter((invoice) => {
                const isEmployeeMatch = selectedEmployee ? invoice.customer_id === selectedEmployee.value : true;
                const isStartDateMatch = startDate ? formatDateDDMMYYYY(invoice.createdAt) >= formatDateDDMMYYYY(startDate) : true;
                const isEndDateMatch = endDate ? formatDateDDMMYYYY(invoice.createdAt) <= formatDateDDMMYYYY(endDate) : true;
                return isEmployeeMatch && isStartDateMatch && isEndDateMatch;
            });
        console.log('filteredInvoices:', filteredInvoices);

        const groupedInvoices = groupInvoices(filteredInvoices);

        // Sắp xếp dữ liệu đã nhóm theo khóa `${invoice.employee_id}-${formatDateDDMMYYYY(invoice.createdAt)}`
        const sortedGroupedData = Object.values(groupedInvoices).sort((a, b) => {
            const keyA = `${a.employeeId}-${a.createdAt}`;
            const keyB = `${b.employeeId}-${b.createdAt}`;
            return keyA.localeCompare(keyB);
        });

        const total = calculateTotal(sortedGroupedData);
        console.log('total:', total);
        const transformedData = transformTotalToArray(total); // Chuyển đổi thành mảng
        setGroupedData(transformedData); // Cập nhật groupedData
    };

    const handleResetFilter = () => {
        setSelectedEmployee(null);
        setStartDate('');
        setEndDate('');
        console.log('Đã hủy lọc');
        setGroupedData([]); // Reset grouped data if needed

        const groupedInvoices = groupInvoices(invoices);

        // Sắp xếp dữ liệu đã nhóm theo khóa `${invoice.employee_id}-${formatDateDDMMYYYY(invoice.createdAt)}`
        const sortedGroupedData = Object.values(groupedInvoices).sort((a, b) => {
            const keyA = `${a.employeeId}-${a.createdAt}`;
            const keyB = `${b.employeeId}-${b.createdAt}`;
            return keyA.localeCompare(keyB);
        });

        const total = calculateTotal(sortedGroupedData);
        console.log('total:', total);
        const transformedData = transformTotalToArray(total); // Chuyển đổi thành mảng
        setGroupedData(transformedData); // Cập nhật groupedData
    };

    const handleExportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('DoanhThuBanHangKhachHang');

        // Xác định ngày sớm nhất và ngày hiện tại
        const currentDate = new Date();
        // const earliestDate = groupedData.length
        //     ? new Date(Math.min(...groupedData.map(item => parseDate(item.createdAt).getTime())))
        //     : currentDate;

        const startDateToUse = startDate || currentDate;
        const endDateToUse = endDate || currentDate;

        // Thêm thông tin cửa hàng
        worksheet.mergeCells('A1:K1');
        worksheet.getCell('A1').value = 'Tên cửa hàng: Siêu thị CAPY SMART';
        worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A1').font = { bold: true, size: 12 };

        worksheet.mergeCells('A2:K2');
        worksheet.getCell('A2').value = 'Địa chỉ: 14 Nguyễn Văn Bảo, Phường 14, Quận Gò Vấp, TPHCM';
        worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

        worksheet.mergeCells('A3:K3');
        worksheet.getCell('A3').value = `Ngày in: ${formatDateDDMMYYYY(new Date().toLocaleDateString())}`;
        worksheet.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' };

        // Thêm tiêu đề chính
        worksheet.mergeCells('A5:K5');
        worksheet.getCell('A5').value = 'Doanh số theo khách hàng';
        worksheet.getCell('A5').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A5').font = { bold: true, size: 14 };

        // Thêm thời gian lọc
        worksheet.mergeCells('A6:K6');
        worksheet.getCell('A6').value = `Từ ngày: ${formatDateDDMMYYYY(startDateToUse)} - Đến ngày: ${formatDateDDMMYYYY(endDateToUse)}`;
        worksheet.getCell('A6').alignment = { horizontal: 'center', vertical: 'middle' };

        // Thêm Header
        const headers = ['Mã khách hàng', 'Tên khách hàng', 'Địa chỉ', 'Phường/Xã', 'Quận/Huyện', 'Tỉnh/Thành', 'Mã hàng', 'Đơn vị tính', 'Doanh số trước CK', 'Chiết khấu', 'Doanh số sau CK'];
        worksheet.addRow(headers).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' },
            };
        });

        // Tính tổng
        let totalDiscount = 0;
        let totalRevenueBeforeDiscount = 0;
        let totalRevenueAfterDiscount = 0;

        // Thêm dữ liệu
        groupedData.forEach((item) => {
            const customer = customers.find((cus) => cus.account_id === item.customerInfo);
            const unit = units.find((unit) => unit._id === item.unit_id);

            const revenueBefore = item.totalBeforePrice || 0;
            const discount = item.totalDiscount || 0;
            const revenueAfter = item.totalAfterPrice || 0;

            totalRevenueBeforeDiscount += revenueBefore;
            totalDiscount += discount;
            totalRevenueAfterDiscount += revenueAfter;

            const row = worksheet.addRow([
                customer.customer_id || '',
                customer.name || '',
                customer.address.street || '',
                customer.address.ward || '',
                customer.address.district || '',
                customer.address.city || '',
                item.item_code || '',
                unit.description || '',
                formatCurrency(revenueBefore),
                formatCurrency(discount),
                formatCurrency(revenueAfter),
            ]);

            // Căn phải cho các cột tiền
            row.getCell(9).alignment = { horizontal: 'right' };
            row.getCell(10).alignment = { horizontal: 'right' };
            row.getCell(11).alignment = { horizontal: 'right' };

        });

        // Thêm dòng tổng cộng
        worksheet.addRow([]);
        const totalRow = worksheet.addRow([
            'Tổng cộng',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            formatCurrency(totalRevenueBeforeDiscount),
            formatCurrency(totalDiscount),
            formatCurrency(totalRevenueAfterDiscount),

        ]);

        totalRow.eachCell((cell, colNumber) => {
            if (colNumber > 8) {
                cell.font = { bold: true };
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFDDDDDD' },
                };
            }
        });

        // Định dạng cột
        worksheet.columns = [
            { width: 15 }, // Mã nhân viên
            { width: 25 }, // Tên nhân viên
            { width: 20 }, // Ngày
            { width: 20 }, // Ngày
            { width: 20 }, // Ngày
            { width: 20 }, // Ngày
            { width: 25 }, // Doanh số trước CK
            { width: 20 }, // Chiết khấu
            { width: 25 }, // Doanh số sau CK
        ];

        // Xuất file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `DoanhThuBanHangKhachHang_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    const invoiceColumns = [
        {
            title: 'Mã khách hàng', dataIndex: 'employeeId', key: 'employeeId', width: '10%',
            render: (text, record) => {
                const customer = customers.find((cus) => cus.account_id === record.customerInfo);
                return customer ? customer.customer_id : '';
            }
        },
        {
            title: 'Tên khách hàng', dataIndex: 'employee_name', key: 'employee_name', width: '15%',
            render: (text, record) => {
                const customer = customers.find((cus) => cus.account_id === record.customerInfo);
                return customer ? customer.name : '';
            }
        },
        {
            title: 'Địa chỉ', dataIndex: 'street', key: 'street', width: '20%',
            render: (text, record) => {
                const customer = customers.find((cus) => cus.account_id === record.customerInfo);
                return customer ? customer.address.street : '';
            }
        },
        {
            title: 'Phường/Xã', dataIndex: 'ward', key: 'ward', width: '15%',
            render: (text, record) => {
                const customer = customers.find((cus) => cus.account_id === record.customerInfo);
                return customer ? customer.address.ward : '';
            }
        },
        {
            title: 'Quận/Huyện', dataIndex: 'district', key: 'district', width: '15%',
            render: (text, record) => {
                const customer = customers.find((cus) => cus.account_id === record.customerInfo);
                return customer ? customer.address.district : '';
            }
        },
        {
            title: 'Tỉnh/Thành', dataIndex: 'city', key: 'city', width: '15%',
            render: (text, record) => {
                const customer = customers.find((cus) => cus.account_id === record.customerInfo);
                return customer ? customer.address.city : '';
            }
        },
        {
            title: 'Mã hàng',
            dataIndex: 'item_code',
            key: 'item_code',
            width: '10%'
        },
        {
            title: 'Đơn vị tính', dataIndex: 'unit', key: 'unit', width: '15%',
            render: (text, record) => {
                const unit = units.find((unit) => unit._id === record.unit_id);
                return unit ? unit.description : '';
            }
        },
        {
            title: 'Doanh số trước CK',
            dataIndex: 'totalBeforePrice',
            key: 'totalBeforePrice',
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
            dataIndex: 'totalAfterPrice', key: 'totalAfterPrice', width: '15%', render: (value) => formatCurrency(value)
        },
    ];

    const employeeOptions = customers.map((customer) => ({
        value: customer.account_id,
        label: customer.customer_id,
    }));

    return (
        <div className='statistical-page'>
            <div className='filter-statistical'>
                <h3>Lọc doanh số theo khách hàng</h3>

                <div className='filter-row'>
                    <div className='filter-item'>
                        <label htmlFor="customer">Mã khách hàng:</label>
                        <Select
                            id="customer"
                            options={employeeOptions}
                            value={selectedEmployee}
                            onChange={setSelectedEmployee}
                            placeholder="Chọn khách hàng"
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

                    <button className="filter-button" onClick={handleFilter}>
                        Lọc
                    </button>
                    <button className="reset-button" onClick={handleResetFilter}>
                        Hủy
                    </button>
                    <button className="print-button" onClick={handleExportExcel}>
                        <FaPrint className="print-icon" /> In
                    </button>
                </div>
            </div>

            <div>
                <FrameData
                    title="Thống kê doanh thu theo khách hàng"
                    data={groupedData}
                    columns={invoiceColumns}
                />
            </div>
        </div>
    )

}