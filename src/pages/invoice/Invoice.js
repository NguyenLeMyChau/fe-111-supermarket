import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { formatCurrency, formatDate } from '../../utils/fotmatDate';
import { useLocation, useNavigate } from 'react-router';
import ProductInvoice from './ProductInvoice';
import './Invoice.scss';


export default function Invoice() {
    const navigate = useNavigate();
    const location = useLocation();

    const invoices = useSelector((state) => state.invoice?.invoices) || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // Tạo bản sao của mảng invoices trước khi sắp xếp
    const sortedInvoices = [...invoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const invoiceColumn = [
        { title: 'Mã đơn hàng', dataIndex: '_id', key: '_id', width: '10%' },
        { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName', width: '10%' },
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'createdAt',
            key: 'createdAt', // Sử dụng một khóa duy nhất
            width: '15%',
            className: 'text-center',
            render: (date) => formatDate(date)
        },
        {
            title: 'Người nhận',
            dataIndex: 'paymentInfo',
            key: 'paymentInfo_name', // Sử dụng một khóa duy nhất
            width: '10%',
            render: (paymentInfo) => paymentInfo.name
        },
        {
            title: 'Số điện thoại nhận',
            dataIndex: 'paymentInfo',
            key: 'paymentInfo_phone', // Sử dụng một khóa duy nhất
            width: '15%',
            render: (paymentInfo) => paymentInfo.phone
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


    return (
        <>
            <FrameData
                title="Danh sách hoá đơn"
                data={sortedInvoices}
                columns={invoiceColumn}
                onRowClick={handleRowClick}
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