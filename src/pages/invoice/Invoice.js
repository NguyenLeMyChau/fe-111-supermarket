import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { formatCurrency, formatDate } from '../../utils/fotmatDate';
import { useLocation, useNavigate } from 'react-router';
import ProductInvoice from './ProductInvoice';
import './Invoice.scss';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSocket } from '../../context/SocketContext';
import { updateInvoiceStatus } from '../../store/reducers/invoiceSlice';
import { getInvoicesByInvoiceCode } from '../../services/invoiceRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import Select from 'react-select';
import Button from '../../components/button/Button';

export default function Invoice() {
    const navigate = useNavigate();
    const location = useLocation();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();
    const dispatch = useDispatch();
    const invoices = useSelector((state) => state.invoice?.invoices) || [];
    const customers = useSelector((state) => state.customer?.customers) || [];

    console.log(invoices)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const { emitSocketEvent, onSocketEvent } = useSocket();

    const [filters, setFilters] = useState({
        invoiceCode: [],
        phone: [],
        startDate: '',
        endDate: '',
        status: [],
    });

    const [sortedTransactions, setSortedTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    useEffect(() => {
        const sorted = [...invoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSortedTransactions(sorted);
        setFilteredTransactions(sorted);
    }, [invoices]);

    useEffect(() => {
        if (sortedTransactions.length > 0) {
            applyFilters();
        }
    }, [filters, sortedTransactions]);

    useEffect(() => {
        const handleNewInvoice = async (data) => {
            const { invoice } = data;
            console.log(invoice);

            try {
                // Fetch the full invoice data by invoiceCode
                await getInvoicesByInvoiceCode(accessToken, axiosJWT, dispatch, invoice);
            } catch (error) {
                console.error('Error fetching invoice:', error);
                toast.error('Không thể thêm mới đơn hàng.');
            }
        };

        const handleUpdateStatus = async (data) => {
            const { invoiceCode, status } = data;
            console.log('Status Update:', invoiceCode, status);

            try {
                // Dispatch action to update the invoice status in Redux store
                dispatch(updateInvoiceStatus({ invoiceCode: invoiceCode, status: status }))
            } catch (error) {
                console.error('Error updating invoice status:', error);
                toast.error('Không thể cập nhật trạng thái hóa đơn.');
            }
        };

        // Subscribe to 'newInvoice' and 'updateStatus' events
        onSocketEvent('newInvoice', handleNewInvoice);
        onSocketEvent('updateStatus', handleUpdateStatus);

    }, [onSocketEvent, accessToken, axiosJWT, dispatch]);

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
        { title: 'Mã hoá đơn bán', dataIndex: 'invoiceCode', key: 'invoiceCode', width: '10%' },
        {
            title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName', width: '10%',
            render: (customerName) => customerName ? customerName : 'Không cập nhật'
        },
        {
            title: 'Ngày đặt hàng',
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
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status', // Sử dụng một khóa duy nhất
            width: '15%',
            className: 'text-center',
            render: (status) => (
                <span style={{ color: getStatusColor(status), fontSize: 14, fontWeight: 500 }}>
                    {status}
                </span>
            ),
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
        console.log('invoice', invoice);
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
        let filteredData = sortedTransactions;

        if (filters.invoiceCode.length > 0) {
            filteredData = filteredData.filter(transaction => filters.invoiceCode.includes(transaction.invoiceCode));
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

        if (filters.status.length > 0) {
            filteredData = filteredData.filter(transaction => filters.status.includes(transaction.status));
        }

        setFilteredTransactions(filteredData);
    };

    const resetFilters = () => {
        setFilters({
            invoiceCode: [],
            phone: [],
            startDate: '',
            endDate: '',
            status: [],
        });
        setFilteredTransactions(sortedTransactions);
    };

    const handleSelectChange = (selectedOption, field) => {
        setFilters(prevState => ({
            ...prevState,
            [field]: selectedOption ? selectedOption.map(option => option.value) : []
        }));
    };

    // Các tùy chọn cho Select
    const invoiceCodeOptions = invoices.map(invoice => ({ value: invoice.invoiceCode, label: invoice.invoiceCode }));
    const phoneOptions = customers.map(customer => ({ value: customer.account_id, label: customer.phone }));
    console.log('phoneOptions', phoneOptions);
    console.log('customers', customers);
    const statusOptions = [
        { value: 'Tại quầy', label: 'Tại quầy' },
        { value: 'Chờ xử lý', label: 'Chờ xử lý' },
        { value: 'Chuẩn bị hàng', label: 'Chuẩn bị hàng' },
        { value: 'Đang giao hàng', label: 'Đang giao hàng' },
        { value: 'Đã nhận hàng', label: 'Đã nhận hàng' },
    ];

    return (
        <>
            <div className="filter-statistical">
                <div className='filter-row'>
                    <div className="filter-item" style={{ marginRight: -20 }}>
                        <label>Mã hóa đơn</label>
                        <Select
                            isMulti
                            value={invoiceCodeOptions.filter(option => filters.invoiceCode.includes(option.value))}
                            options={invoiceCodeOptions}
                            onChange={(selected) => handleSelectChange(selected, 'invoiceCode')}
                            placeholder="Chọn mã hoá đơn"
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
                    <div className="filter-item" style={{ marginRight: -20 }}>
                        <label>Trạng thái</label>
                        <Select
                            isMulti
                            value={statusOptions.filter(option => filters.status.includes(option.value))}
                            options={statusOptions}
                            onChange={(selected) => handleSelectChange(selected, 'status')}
                            placeholder="Chọn trạng thái"
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    width: '200px',
                                    zIndex: 1000,
                                }),
                            }}
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
                title="Danh sách hoá đơn bán"
                data={filteredTransactions}
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