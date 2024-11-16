import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { formatCurrency, formatDate } from '../../utils/fotmatDate';
import { useLocation, useNavigate } from 'react-router';
import ProductInvoice from '../invoice/ProductInvoice';
import '../invoice/Invoice.scss';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Button from '../../components/button/Button';
import Select from 'react-select';
import Modal from '../../components/modal/Modal';
import { toast } from 'react-toastify';
import { updateStatusOrder } from '../../services/invoiceRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { BiSolidSkipNextCircle } from "react-icons/bi";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function OrderOnline() {
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();
    const navigate = useNavigate();
    const location = useLocation();

    const invoices = useSelector((state) => state.invoice?.invoices) || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [orderStatus, setOrderStatus] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0); // Track selected tab index

    console.log(invoices)
    // Lọc các hóa đơn để loại bỏ những hóa đơn có status là 'Tại quầy'
    const filteredInvoices = invoices.filter(invoice => invoice.status !== 'Tại quầy');

    // Tạo bản sao của mảng invoices trước khi sắp xếp
    const sortedInvoices = [...filteredInvoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const orderStatuses = [
        { value: 'Chờ xử lý', label: 'Chờ xử lý', color: '#FFA500' },
        { value: 'Chuẩn bị hàng', label: 'Chuẩn bị hàng', color: '#D2691E' },
        { value: 'Đang giao hàng', label: 'Đang giao hàng', color: '#0000FF' },
        { value: 'Đã nhận hàng', label: 'Đã nhận hàng', color: '#800080' },
        // { value: 'Bị từ chối', label: 'Bị từ chối', color: '#FF0000' },
        // { value: 'Đã hủy', label: 'Đã hủy', color: '#A9A9A9' },
    ];

    const getStatusColor = (status) => {
        const matchedStatus = orderStatuses.find(s => s.value === status);
        return matchedStatus ? matchedStatus.color : '#000000';
    };

    const getNextStatus = (currentStatus) => {
        const currentIndex = orderStatuses.findIndex((status) => status.value === currentStatus);
        if (currentIndex === -1 || currentIndex === orderStatuses.length - 1 || currentStatus === 'Đã nhận hàng') {
            return currentStatus; // Giữ nguyên trạng thái nếu không có trạng thái tiếp theo
        }
        return orderStatuses[currentIndex + 1].value;
    };

    const handleEditClick = async (event, invoice) => {
        event.stopPropagation();

        const nextStatus = getNextStatus(invoice.status);
        if (nextStatus === invoice.status) return; // Không cho phép chuyển trạng thái nếu đã là 'Đã nhận hàng'

        try {
            await updateStatusOrder(
                accessToken,
                axiosJWT,
                toast,
                navigate,
                invoice._id,
                nextStatus
            );
        } catch (error) {
            console.error('Cập nhật trạng thái thất bại:', error);
            toast.error('Cập nhật trạng thái thất bại');
        }
    };


    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedInvoice(null);
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    // Group invoices by status
    const invoicesByStatus = orderStatuses.reduce((acc, status) => {
        acc[status.value] = sortedInvoices.filter(invoice => invoice.status === status.value);
        return acc;
    }, {});

    const getInvoiceColumns = (status) => {
        const columns = [
            { title: 'Mã đơn hàng', dataIndex: 'invoiceCode', key: 'invoiceCode', width: '10%' },
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
                )
            },
            {
                title: 'Tổng tiền',
                dataIndex: 'paymentAmount',
                key: 'paymentAmount',
                width: '5%',
                className: 'text-right',
                render: (total) => formatCurrency(total)
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                key: 'status',
                width: '15%',
                className: 'text-center',
                render: (status) => (
                    <span style={{ color: getStatusColor(status), fontSize: 14, fontWeight: 500 }}>
                        {status}
                    </span>
                ),
            },
        ];

        if (status !== 'Đang giao hàng' && status !== 'Đã nhận hàng') {
            columns.push({
                title: 'Cập nhật',
                key: 'edit',
                width: '10%',
                className: 'text-center',
                render: (text, record) => (
                    <BiSolidSkipNextCircle
                        style={{ color: 'red', cursor: 'pointer' }}
                        size={30}
                        onClick={(event) => handleEditClick(event, record)}
                    />
                ),
            });
        }

        return columns;
    };

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

    const handleStatusSelect = (selectedOption) => {
        console.log('selectedOption:', selectedOption);
        setSelectedInvoice(prevInvoice => ({
            ...prevInvoice,
            status: selectedOption
        }));
    };

    const handleUpdateStatus = async () => {
        try {
            console.log('selectedInvoice:', selectedInvoice);
            await updateStatusOrder(accessToken, axiosJWT, toast, navigate, selectedInvoice._id, selectedInvoice.status.value);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Failed to update status:', error);
        }

    };


    return (
        <>
            <div className='product-detail-container'>
                <Tabs value={selectedTab} onChange={handleTabChange} aria-label="invoice status tabs" style={{ marginTop: 20, marginLeft: 30 }}>
                    {orderStatuses.map((status, index) => (
                        <Tab key={status.value} label={status.label} {...a11yProps(index)} />
                    ))}
                </Tabs>

                {orderStatuses.map((status, index) => (
                    <CustomTabPanel key={status.value} value={selectedTab} index={index}>
                        <FrameData
                            title={`Hoá đơn ${status.label}`}
                            data={invoicesByStatus[status.value]}
                            columns={getInvoiceColumns(status.value)}
                            onRowClick={handleRowClick}
                            itemsPerPage={5}
                        />
                    </CustomTabPanel>
                ))}


                {isModalOpen && (
                    <ProductInvoice
                        isModalOpen={isModalOpen}
                        closeModal={closeModal}
                        products={products}
                        productColumns={invoiceDetailColumn}
                        selectedInvoice={selectedInvoice}
                    />
                )}

                {isEditModalOpen && (
                    <Modal
                        title={'Cập nhật trạng thái đơn hàng'}
                        isOpen={isEditModalOpen}
                        onClose={handleCloseEditModal}
                        width={500}
                        height={210}
                    >
                        <div className='order-container-status' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 200 }}>
                            <div style={{ marginTop: 20, paddingLeft: 20 }}>
                                <Select
                                    value={selectedInvoice?.status}
                                    onChange={handleStatusSelect}
                                    options={orderStatuses}
                                    isDisabled={orderStatus}
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            width: '350px',
                                            zIndex: 7777,
                                        }),
                                    }}
                                />
                            </div>

                            <br />

                            {!orderStatus && (
                                <div>
                                    <Button
                                        text="Cập nhật trạng thái"
                                        backgroundColor="#1366D9"
                                        onClick={handleUpdateStatus}
                                    />
                                </div>
                            )}
                        </div>
                    </Modal>
                )}
            </div>
        </>

    );
}