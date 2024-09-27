import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import Modal from '../../components/modal/Modal';

export default function Supplier() {
    const suppliers = useSelector((state) => state.commonData?.dataManager?.suppliers) || [];
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

    const handleRowClick = (category) => {
        const categoryProducts = Array.isArray(category.products) ? category.products : [];
        setProducts(categoryProducts);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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

            <Modal
                title={'Sản phẩm trong danh mục'}
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                {
                    products.length > 0 ? (
                        <FrameData
                            data={products}
                            columns={productColumns}
                        />
                    ) : (
                        <p style={{ marginLeft: 30 }}>Không có sản phẩm nào trong danh mục này.</p>
                    )
                }
            </Modal>
        </div>
    );
}