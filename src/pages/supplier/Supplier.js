import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import ProductSupplier from './ProductSupplier';
import { useLocation, useNavigate } from 'react-router';

export default function Supplier() {
    const navigate = useNavigate();
    const location = useLocation();

    const suppliers = useSelector((state) => state.supplier?.suppliers) || [];
    const enhancedSuppliers = suppliers.map((supplier) => ({
        ...supplier,
        productCount: Array.isArray(supplier.products) ? supplier.products.length : 0,
    }));
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const supplierColumns = [
        { title: 'Nhà cung cấp', dataIndex: 'name', key: 'name', width: '40%' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', width: '20%' },
        { title: 'Email', dataIndex: 'email', key: 'email', width: '20%' },
        { title: 'Số lượng sản phẩm', dataIndex: 'productCount', key: 'productCount', width: '20%', className: 'text-center' },
    ];

    const productColumns = [
        {
            title: 'STT',
            key: 'index',
            width: '10%',
            className: 'text-center',
            render: (_, __, index) => index + 1
        },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', width: '25%' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '35%' },
        { title: 'Barcode', dataIndex: 'barcode', key: 'barcode', width: '20%', className: 'text-center' },
        { title: 'Mã hàng', dataIndex: 'item_code', key: 'item_code', width: '10%', className: 'text-center' },
    ];

    const handleRowClick = (supplier) => {
        const supplierProducts = Array.isArray(supplier.products) ? supplier.products : [];
        setProducts(supplierProducts);

        const pathPrev = location.pathname + location.search;
        sessionStorage.setItem('previousSupplierPath', pathPrev);

        navigate('/admin/supplier/' + supplier._id + '/product');
        setIsModalOpen(true);

    };

    const closeModal = () => {
        setIsModalOpen(false);

        const pathPrev = sessionStorage.getItem('previousSupplierPath');
        if (pathPrev) {
            navigate(pathPrev);
            sessionStorage.removeItem('previousSupplierPath');
        }
    };

    return (
        <div>
            <FrameData
                title="Nhà cung cấp"
                buttonText="Thêm nhà cung cấp"
                data={enhancedSuppliers}
                columns={supplierColumns}
                onRowClick={handleRowClick}
            />

            <ProductSupplier
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                products={products}
                productColumns={productColumns}
            />
        </div>
    );
}