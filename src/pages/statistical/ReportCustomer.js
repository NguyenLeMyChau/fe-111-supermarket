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

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [groupedData, setGroupedData] = useState([]); // state for grouped data


    const groupInvoices = (invoicesList) => {
        return invoicesList.reduce((groups, invoice) => {
            if (!invoice.customer_id) return groups;
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
            invoice.invoices.forEach(({ customer_id, details, discountPayment }) => {
                // Nếu chưa có dữ liệu cho khách hàng này, khởi tạo
                if (!result[customer_id]) {
                    result[customer_id] = {
                        customerInfo: customer_id
                    };
                }

                // // Tính tổng giá trị trước chiết khấu của hóa đơn con
                // const totalBeforeDiscount = details.reduce(
                //     (sum, { price, quantity }) => sum + price * quantity,
                //     0
                // );

                // Duyệt qua từng sản phẩm trong `details`
                details.forEach(({ item_code, price, total, quantity }) => {
                    // Nếu chưa có dữ liệu cho item_code này, khởi tạo
                    if (!result[customer_id][item_code]) {
                        result[customer_id][item_code] = {
                            totalQuantity: 0,
                            totalBeforePrice: 0,
                            totalAfterPrice: 0,
                            totalDiscount: 0
                        };
                    }

                    // Cộng dồn số lượng và tổng giá trị
                    result[customer_id][item_code].totalQuantity += quantity;
                    result[customer_id][item_code].totalBeforePrice += price * quantity;
                    result[customer_id][item_code].totalAfterPrice += total;
                    result[customer_id][item_code].totalDiscount += price * quantity - total;

                    // // Tính tỷ lệ chiết khấu và cộng dồn vào tổng chiết khấu
                    // if (totalBeforeDiscount > 0) {
                    //     const itemProportion = (price * quantity) / totalBeforeDiscount;
                    //     const itemDiscount = itemProportion * discountPayment;
                    //     result[customer_id][item_code].totalDiscount += itemDiscount;
                    // }
                });
            });

            return result;
        }, {});
    };

    const transformTotalToArray = (total) => {
        const { customerInfo, ...items } = total; // Tách customerInfo và các sản phẩm
        return Object.entries(items).map(([itemCode, values]) => ({
            customerInfo,
            itemCode,
            ...values,
        }));
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
        const transformedData = Object.values(total).flatMap(transformTotalToArray); // Chuyển đổi thành mảng
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
        const transformedData = Object.values(total).flatMap(transformTotalToArray); // Chuyển đổi thành mảng
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
        const transformedData = Object.values(total).flatMap(transformTotalToArray); // Chuyển đổi thành mảng
        setGroupedData(transformedData); // Cập nhật groupedData
    };

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number); // Tách ngày, tháng, năm và chuyển thành số
        return new Date(year, month - 1, day); // Tạo đối tượng Date (lưu ý tháng bắt đầu từ 0)
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
        worksheet.getCell('A5').value = 'Doanh số theo khách hàng';
        worksheet.getCell('A5').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A5').font = { bold: true, size: 14 };

        // Thêm thời gian lọc
        worksheet.mergeCells('A6:F6');
        worksheet.getCell('A6').value = `Từ ngày: ${formatDateDDMMYYYY(startDateToUse)} - Đến ngày: ${formatDateDDMMYYYY(endDateToUse)}`;
        worksheet.getCell('A6').alignment = { horizontal: 'center', vertical: 'middle' };

        // Thêm Header
        const headers = ['Mã khách hàng', 'Tên khách hàng', 'Địa chỉ', 'Phường/Xã', 'Quận/Huyện', 'Tỉnh/Thành', 'Mã hàng', 'Doanh số trước CK', 'Chiết khấu', 'Doanh số sau CK'];
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
            const customer = customers.find((cus) => cus.account_id === item.customerInfo);

            const revenueBefore = item.totalBeforePrice || 0;
            const discount = item.totalDiscount || 0;
            const revenueAfter = item.totalAfterPrice || 0;

            const row = worksheet.addRow([
                customer.phone || '',
                customer.name || '',
                customer.address.street || '',
                customer.address.ward || '',
                customer.address.district || '',
                customer.address.city || '',
                item.itemCode || '',
                formatCurrency(revenueBefore),
                formatCurrency(discount),
                formatCurrency(revenueAfter),
            ]);

            // Căn phải cho các cột tiền
            row.getCell(7).alignment = { horizontal: 'right' };
            row.getCell(8).alignment = { horizontal: 'right' };
            row.getCell(9).alignment = { horizontal: 'right' };

        });


        // Định dạng cột
        worksheet.columns = [
            { width: 15 }, // Mã nhân viên
            { width: 25 }, // Tên nhân viên
            { width: 20 }, // Ngày
            { width: 20 }, // Ngày
            { width: 20 }, // Ngày
            { width: 20 }, // Ngày
            { width: 20 }, // Doanh số trước CK
            { width: 15 }, // Chiết khấu
            { width: 20 }, // Doanh số sau CK
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
            dataIndex: 'itemCode',
            key: 'itemCode',
            width: '10%'
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