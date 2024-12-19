import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { formatCurrency, formatDate } from '../../utils/fotmatDate';
import { useLocation, useNavigate } from 'react-router';
import ProductInvoice from './ProductInvoiceRefund';
import './Invoice.scss';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Select from 'react-select';
import Button from '../../components/button/Button';

export default function InvoiceRefund() {
    const navigate = useNavigate();
    const location = useLocation();

    const invoices = useSelector((state) => state.invoice?.invoiceRefund) || [];
    const customers = useSelector((state) => state.customer?.customers) || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [filters, setFilters] = useState({
        invoiceCode: [],
        invoiceCodeSale: [],
        phone: [],
        startDate: '',
        endDate: '',
    });

    const [sortedInvoices, setSortedInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);

    useEffect(() => {
        const sorted = [...invoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSortedInvoices(sorted);
        setFilteredInvoices(sorted);
    }, [invoices]);

    useEffect(() => {
        if (sortedInvoices.length > 0) {
            applyFilters();
        }
    }, [filters, sortedInvoices]);

    const getStatusColor = (status) => {
        const matchedStatus = orderStatuses.find(s => s.value === status);
        return matchedStatus ? matchedStatus.color : '#000000';
    };

    const orderStatuses = [
        { value: 'Chờ xử lý', label: 'Chờ xử lý', color: '#FFA500' },
        { value: 'Chuẩn bị hàng', label: 'Chuẩn bị hàng', color: '#D2691E' },
        { value: 'Đang giao hàng', label: 'Đang giao hàng', color: '#0000FF' },
        { value: 'Đã nhận hàng', label: 'Đã nhận hàng', color: '#800080' },
        // { value: 'Bị từ chối', label: 'Bị từ chối', color: '#FF0000' },
        // { value: 'Đã hủy', label: 'Đã hủy', color: '#A9A9A9' },
    ];

    const invoiceColumn = [
        { title: 'Mã hóa đơn trả', dataIndex: 'invoiceCode', key: 'invoiceCode', width: '10%' },
        { title: 'Mã hóa đơn bán', dataIndex: 'invoiceCodeSale', key: 'invoiceCodeSale', width: '10%' },
        {
            title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName', width: '10%',
            render: (customerName) => customerName ? customerName : 'Không cập nhật'
        },
        {
            title: 'Ngày trả hàng',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '15%',
            render: (date) => (
                <div>
                    <div>{formatDate(date)}</div>
                    <div style={{ fontSize: '12px', color: 'gray' }}>
                        {formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi })}
                    </div>
                </div>
            ), sortable: true
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'paymentAmount',
            key: 'paymentAmount', // Sử dụng một khóa duy nhất
            width: '5%',
            className: 'text-right',
            render: (total) => formatCurrency(total)
        },
    ];

    const invoiceDetailColumn = [
        { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName', width: '30%' },
        { title: 'Đơn vị tính', dataIndex: 'unitName', key: 'unitName', width: '10%' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: '10%', className: 'text-center' },
        {
            title: 'Giá', dataIndex: 'price', key: 'price', width: '10%', className: 'text-right',
            render: (price) => formatCurrency(price)
        },
    ];

    const handleRowClick = (invoice) => {
        const invoiceProducts = Array.isArray(invoice.details) ? invoice.details : [];
        setProducts(invoiceProducts);
        setSelectedInvoice(invoice);

        const pathPrev = location.pathname + location.search;
        sessionStorage.setItem('previousInvoicePath', pathPrev);

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);

        const pathPrev = sessionStorage.getItem('previousInvoicePath');
        if (pathPrev) {
            navigate(pathPrev);
            sessionStorage.removeItem('previousInvoicePath');
        }
    }

    const applyFilters = () => {
        let filteredData = sortedInvoices;

        if (filters.invoiceCode.length > 0) {
            filteredData = filteredData.filter(transaction => filters.invoiceCode.includes(transaction.invoiceCode));
        }

        if (filters.invoiceCodeSale.length > 0) {
            filteredData = filteredData.filter(transaction => filters.invoiceCodeSale.includes(transaction.invoiceCodeSale));
        }

        if (filters.phone.length > 0) {
            filteredData = filteredData.filter(transaction => filters.phone.includes(transaction.customer_id));
        }

        if (filters.startDate) {
            filteredData = filteredData.filter(transaction => new Date(transaction.createdAt) >= new Date(filters.startDate));
        }

        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999); // Đặt thời gian của ngày kết thúc đến cuối ngày
            filteredData = filteredData.filter(transaction => new Date(transaction.createdAt) <= endDate);
        }

        setFilteredInvoices(filteredData);
    };

    const resetFilters = () => {
        setFilters({
            invoiceCode: [],
            invoiceCodeSale: [],
            phone: [],
            startDate: '',
            endDate: '',
        });
        setFilteredInvoices(sortedInvoices);
    };

    const handleSelectChange = (selectedOption, field) => {
        setFilters(prevState => ({
            ...prevState,
            [field]: selectedOption ? selectedOption.map(option => option.value) : []
        }));
    };

    // Các tùy chọn cho Select
    const invoiceCodeOptions = invoices.map(invoice => ({ value: invoice.invoiceCode, label: invoice.invoiceCode }));
    const invoiceCodeSaleOptions = invoices.map(invoice => ({ value: invoice.invoiceCodeSale, label: invoice.invoiceCodeSale }));
    const phoneOptions = customers.map(customer => ({ value: customer.account_id, label: customer.phone }));

    return (
        <>
            <div className="filter-statistical">
                <div className='filter-row'>
                    <div className="filter-item" style={{ marginRight: -20 }}>
                        <label>Mã hóa đơn trả</label>
                        <Select
                            isMulti
                            value={invoiceCodeOptions.filter(option => filters.invoiceCode.includes(option.value))}
                            options={invoiceCodeOptions}
                            onChange={(selected) => handleSelectChange(selected, 'invoiceCode')}
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    width: '200px',
                                    zIndex: 1000,
                                }),
                            }}
                        />
                    </div>

                    <div className="filter-item" style={{ marginRight: -20 }}>
                        <label>Mã hóa đơn bán</label>
                        <Select
                            isMulti
                            value={invoiceCodeSaleOptions.filter(option => filters.invoiceCodeSale.includes(option.value))}
                            options={invoiceCodeSaleOptions}
                            onChange={(selected) => handleSelectChange(selected, 'invoiceCodeSale')}
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    width: '200px',
                                    zIndex: 1000,
                                }),
                            }}
                        />
                    </div>

                    <div className="filter-item" style={{ marginRight: -20 }}>
                        <label>SĐT khách</label>
                        <Select
                            isMulti
                            value={phoneOptions.filter(option => filters.phone.includes(option.value))}
                            options={phoneOptions}
                            onChange={(selected) => handleSelectChange(selected, 'phone')}
                            placeholder="Chọn số điện thoại"
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    width: '200px',
                                    zIndex: 1000,
                                }),
                            }}
                        />
                    </div>
                    <div className="filter-item" style={{ marginRight: -20 }}>
                        <label>Ngày bắt đầu</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => handleSelectChange([{ value: e.target.value }], 'startDate')}
                            placeholder="Chọn ngày bắt đầu"
                        />
                    </div>
                    <div className="filter-item" style={{ marginRight: -20 }}>
                        <label>Ngày kết thúc</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => handleSelectChange([{ value: e.target.value }], 'endDate')}
                            placeholder="Chọn ngày kết thúc"
                        />
                    </div>

                    <div className='button-filter' style={{ marginLeft: 20, marginTop: 20 }}>
                        <Button
                            text='Huỷ lọc'
                            backgroundColor='#FF0000'
                            color='white'
                            width='100'
                            onClick={resetFilters}
                        />
                    </div>
                </div>
            </div>

            <FrameData
                title="Danh sách hoá đơn trả"
                data={filteredInvoices}
                columns={invoiceColumn}
                onRowClick={handleRowClick}
                itemsPerPage={5}
            />

            {
                isModalOpen && (
                    <ProductInvoice
                        isModalOpen={isModalOpen}
                        closeModal={closeModal}
                        products={products}
                        productColumns={invoiceDetailColumn}
                        selectedInvoice={selectedInvoice}
                    />
                )
            }
        </>
    );
}