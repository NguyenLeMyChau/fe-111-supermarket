import React, { useEffect, useState } from 'react';
import './Statistical.scss';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { FaPrint } from 'react-icons/fa';
import FrameData from '../../containers/frameData/FrameData';
import { formatCurrency, formatDateDDMMYYYY } from '../../utils/fotmatDate';

export default function ReportCustomer() {
    const customers = useSelector((state) => state.customer?.customers) || [];
    const invoices = useSelector((state) => state.invoice?.invoices) || [];

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
                    result[customer_id] = {};
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
        setGroupedData(total);
        console.log('total:', total);
    }, [invoices, customers]);

    const invoiceColumns = [
        { title: 'Mã khách hàng', dataIndex: 'employeeId', key: 'employeeId', width: '15%' },
        { title: 'Tên khách hàng', dataIndex: 'employee_name', key: 'employee_name', width: '20%' },
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
                <h3>Lọc doanh số theo khách hàng</h3>
                <div className='filter-row'>
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
                <h1>Doanh số theo khách hàng</h1>
            </div>
        </div>
    )

}