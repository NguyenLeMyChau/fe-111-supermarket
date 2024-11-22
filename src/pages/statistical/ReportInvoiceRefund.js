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
    const customers = useSelector((state) => state.customer?.customers) || [];
    const invoices = useSelector((state) => state.invoice?.invoiceRefund) || [];
    const invoicesSale = useSelector((state) => state.invoice?.invoices) || [];

    console.log('invoices', invoices);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [groupedData, setGroupedData] = useState([]); // state for grouped data

    const employeeOptions = customers.map((customer) => ({
        value: customer.account_id,
        label: customer.phone,
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

                    <button className="filter-button">
                        Lọc
                    </button>
                    <button className="reset-button">
                        Hủy Lọc
                    </button>
                    <button className="print-button">
                        <FaPrint className="print-icon" /> In
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