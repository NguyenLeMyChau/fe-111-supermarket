import React, { useEffect, useState } from 'react';
import './Statistical.scss';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { FaPrint } from 'react-icons/fa';
import FrameData from '../../containers/frameData/FrameData';
import { formatCurrency, formatDateDDMMYYYY } from '../../utils/fotmatDate';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function ReportInvoiceRefund() {
    const invoices = useSelector((state) => state.invoice?.invoiceRefund) || [];
    const invoicesSale = useSelector((state) => state.invoice?.invoices) || [];

    console.log('invoices', invoices);

    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [selectedInvoiceSale, setSelectedInvoiceSale] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [groupedData, setGroupedData] = useState([]); // state for grouped data

    const invoiceOptions = invoices.map((invoice) => ({
        value: invoice.invoiceCode,
        label: invoice.invoiceCode,
    }));

    const invoiceSaleOptions = invoices.map((invoice) => ({
        value: invoice.invoiceCodeSale,
        label: invoice.invoiceCodeSale,
    }));

    const transformInvoicesToDetailsArray = (invoices) => {
        return invoices.flatMap(({ invoiceCode, invoiceCodeSale, createdAt, details }) =>
            details.map(detail => ({
                invoiceCode,
                invoiceCodeSale,
                createdAt,
                ...detail,
            }))
        );
    };

    // Group invoices by employeeId and createdAt by default
    useEffect(() => {
        const transformedData = transformInvoicesToDetailsArray(invoices);
        setGroupedData(transformedData); // Cập nhật groupedData
        console.log('transformedData:', transformedData);
    }, [invoices]);

    const handleFilter = () => {
        console.log('Lọc với:', { selectedInvoice, selectedInvoiceSale, startDate, endDate });

        // Filter invoices based on selected employee and date range
        const filteredInvoices = invoices
            .filter((invoice) => {
                const isInvoiceMatch = selectedInvoice ? invoice.invoiceCode === selectedInvoice.value : true;
                const isInvoiceSaleMatch = selectedInvoiceSale ? invoice.invoiceCodeSale === selectedInvoiceSale.value : true;
                const isStartDateMatch = startDate ? formatDateDDMMYYYY(invoice.createdAt) >= formatDateDDMMYYYY(startDate) : true;
                const isEndDateMatch = endDate ? formatDateDDMMYYYY(invoice.createdAt) <= formatDateDDMMYYYY(endDate) : true;
                return isInvoiceMatch && isInvoiceSaleMatch && isStartDateMatch && isEndDateMatch;
            });
        console.log('filteredInvoices:', filteredInvoices);

        const transformedData = transformInvoicesToDetailsArray(filteredInvoices);
        setGroupedData(transformedData); // Cập nhật groupedData
    };

    const handleResetFilter = () => {
        setSelectedInvoice(null);
        setSelectedInvoiceSale(null);
        setStartDate('');
        setEndDate('');
        console.log('Đã hủy lọc');
        setGroupedData([]); // Reset grouped data if needed

        const transformedData = transformInvoicesToDetailsArray(invoices);
        setGroupedData(transformedData); // Cập nhật groupedData
    };

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number); // Tách ngày, tháng, năm và chuyển thành số
        return new Date(year, month - 1, day); // Tạo đối tượng Date (lưu ý tháng bắt đầu từ 0)
    };

    const handleExportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('BangKeChiTietHangHoaDonTraHang', { views: [{ showGridLines: false }] });

        // Xác định ngày sớm nhất và ngày hiện tại
        const currentDate = new Date();
        const earliestDate = groupedData.length
            ? new Date(Math.min(...groupedData.map(item => parseDate(formatDateDDMMYYYY(item.createdAt)).getTime())))
            : currentDate;
        const startDateToUse = startDate || earliestDate;
        const endDateToUse = endDate || currentDate;

        // Thêm thông tin cửa hàng
        worksheet.mergeCells('A1:I1');
        worksheet.getCell('A1').value = 'Tên cửa hàng: Siêu thị CAPY SMART';
        worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A1').font = { bold: true, size: 12 };

        worksheet.mergeCells('A2:I2');
        worksheet.getCell('A2').value = 'Địa chỉ: 14 Nguyễn Văn Bảo, Phường 14, Quận Gò Vấp, TPHCM';
        worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

        worksheet.mergeCells('A3:I3');
        worksheet.getCell('A3').value = `Ngày in: ${formatDateDDMMYYYY(new Date().toLocaleDateString())}`;
        worksheet.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' };

        // Thêm tiêu đề chính
        worksheet.mergeCells('A5:I5');
        worksheet.getCell('A5').value = 'Bảng kê chi tiết hàng hoá đơn trả hàng';
        worksheet.getCell('A5').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A5').font = { bold: true, size: 14 };

        // Thêm thời gian lọc
        worksheet.mergeCells('A6:I6');
        worksheet.getCell('A6').value = `Từ ngày: ${formatDateDDMMYYYY(startDateToUse)} - Đến ngày: ${formatDateDDMMYYYY(endDateToUse)}`;
        worksheet.getCell('A6').alignment = { horizontal: 'center', vertical: 'middle' };

        // Thêm Header
        const headers = [
            'Hoá đơn mua',
            'Ngày đơn hàng mua',
            'Hoá đơn trả',
            'Ngày đơn hàng trả',
            'Mã hàng',
            'Tên sản phẩm',
            'Đơn vị tính',
            'Số lượng',
            'Doanh thu'
        ];
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
        let total = 0;

        // Thêm dữ liệu
        groupedData.forEach((item) => {
            const invoice = invoicesSale.find((inv) => inv.invoiceCode === item.invoiceCodeSale);

            total += item.total;

            const row = worksheet.addRow([
                item.invoiceCodeSale || '',
                invoice ? formatDateDDMMYYYY(invoice.createdAt) : '',
                item.invoiceCode || '',
                formatDateDDMMYYYY(item.createdAt),
                item.item_code || '',
                item.productName || '',
                item.unit ? item.unit.description : '',
                item.quantity || 0,
                formatCurrency(item.total),
            ]);

            // Căn phải cho các cột tiền
            row.getCell(8).alignment = { horizontal: 'center' };
            row.getCell(9).alignment = { horizontal: 'right' };

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
            '',
            '',
            '',
            '',
            '',
            formatCurrency(total),
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
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // Định dạng cột
        worksheet.columns = [
            { width: 15 }, // Hoá đơn mua
            { width: 15 }, // Ngày đơn hàng mua
            { width: 15 }, // Hoá đơn trả
            { width: 15 }, // Ngày đơn hàng trả
            { width: 15 }, // Mã hàng
            { width: 25 }, // Tên sản phẩm
            { width: 15 }, // Đơn vị tính
            { width: 15 }, // Số lượng
            { width: 20 }, // Doanh thu
        ];

        // Xuất file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `BangKeChiTietHangHoaDonTraHang_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    const invoiceColumns = [
        {
            title: 'Hoá đơn mua', dataIndex: 'invoiceCodeSale', key: 'invoiceCodeSale', width: '15%'
        },
        {
            title: 'Ngày đơn hàng mua', dataIndex: 'createdAtSale', key: 'createdAtSale', width: '10%',
            render: (text, record) => {
                const invoice = invoicesSale.find((inv) => inv.invoiceCode === record.invoiceCodeSale);
                return invoice ? formatDateDDMMYYYY(invoice.createdAt) : '';
            }
        },
        {
            title: 'Hoá đơn trả', dataIndex: 'invoiceCode', key: 'invoiceCode', width: '15%',
        },
        {
            title: 'Ngày đơn hàng trả', dataIndex: 'createdAt', key: 'createdAt', width: '10%',
            render: (text, record) => {
                return record ? formatDateDDMMYYYY(record.createdAt) : '';
            }
        },
        {
            title: 'Mã hàng',
            dataIndex: 'item_code',
            key: 'item_code',
            width: '10%'
        },
        {
            title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName', width: '20%',
        },
        {
            title: 'Đơn vị tính', dataIndex: 'unit', key: 'unit', width: '10%',
            render: (text, record) => {
                return record ? record.unit.description : '';
            }
        },
        {
            title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: '10%', className: 'text-center',
        },
        {
            title: 'Doanh thu', dataIndex: 'total', key: 'total', width: '10%',
            className: 'text-right',
            render: (text, record) => {
                return formatCurrency(record.total);
            }
        },
    ];


    return (
        <div className='statistical-page'>
            <div className='filter-statistical'>
                <h3>Lọc hoá đơn trả hàng</h3>

                <div className='filter-row'>
                    <div className='filter-item'>
                        <label htmlFor="customer">Mã hoá đơn bán:</label>
                        <Select
                            id="customer"
                            options={invoiceSaleOptions}
                            value={selectedInvoiceSale}
                            onChange={setSelectedInvoiceSale}
                            placeholder="Chọn"
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
                        <label htmlFor="customer">Mã hoá đơn trả:</label>
                        <Select
                            id="customer"
                            options={invoiceOptions}
                            value={selectedInvoice}
                            onChange={setSelectedInvoice}
                            placeholder="Chọn"
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
                        <label htmlFor="start-date">Ngày bắt đầu trả:</label>
                        <input
                            type="date"
                            id="start-date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className='filter-item'>
                        <label htmlFor="end-date">Ngày kết thúc trả:</label>
                        <input
                            type="date"
                            id="end-date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <button className="filter-button" style={{ marginLeft: -20, fontSize: 14 }}
                        onClick={handleFilter}
                    >
                        Lọc
                    </button>
                    <button className="reset-button" style={{ fontSize: 14 }}
                        onClick={handleResetFilter}
                    >
                        Hủy
                    </button>
                    <button className="print-button" style={{ fontSize: 14 }}
                        onClick={handleExportExcel}
                    >
                        <FaPrint className="print-icon" /> Excel
                    </button>
                </div>
            </div>

            <div>
                <FrameData
                    title="Bảng kê chi tiết hàng hoá đơn trả hàng"
                    data={groupedData}
                    columns={invoiceColumns}
                />
            </div>
        </div>
    )


}