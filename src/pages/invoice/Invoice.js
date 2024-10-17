import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { formatCurrency, formatDate } from '../../utils/fotmatDate';
import { useLocation, useNavigate } from 'react-router';
import ProductInvoice from './ProductInvoice';

export default function Invoice() {
    const navigate = useNavigate();
    const location = useLocation();

    const invoices = useSelector((state) => state.invoice?.invoices) || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);

    const invoiceColumn = [
        { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName', width: '20%' },
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '20%',
            className: 'text-center',
            render: (date) => formatDate(date)
        },
    ];

    const invoiceDetailColumn = [
        { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName', width: '30%' },
        { title: 'Đơn vị tính', dataIndex: 'unit', key: 'unit', width: '10%' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: '10%', className: 'text-center' },
        {
            title: 'Giá', dataIndex: 'price', key: 'price', width: '10%', className: 'text-right',
            render: (price) => formatCurrency(price)
        },
    ];

    const handleRowClick = (invoice) => {
        const invoiceProducts = Array.isArray(invoice.details) ? invoice.details : [];
        setProducts(invoiceProducts);

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
                data={invoices}
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
                    />
                )
            }

        </>


    );
}