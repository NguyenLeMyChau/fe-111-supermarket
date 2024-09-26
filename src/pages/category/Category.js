import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import TableData from '../../containers/tableData/tableData';
import Modal from '../../components/modal/Modal';

export default function Category() {
    const categories = useSelector((state) => state.commonData?.dataManager?.categories) || [];
    const enhancedCategories = categories.map((category) => ({
        ...category,
        productCount: Array.isArray(category.products) ? category.products.length : 0,
    }));

    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        { title: 'Loại sản phẩm', dataIndex: 'name', key: 'name', width: '30%' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '50%' },
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
                title="Loại sản phẩm"
                buttonText="Thêm loại sản phẩm"
                data={enhancedCategories}
                columns={columns}
                onRowClick={handleRowClick}
            />

            <Modal title={'Sản phẩm trong danh mục'} isOpen={isModalOpen} onClose={closeModal}>
                {products.length > 0 ? (
                    <TableData
                        columns={productColumns}
                        data={products}
                    />
                ) : (
                    <p style={{ marginLeft: 30 }}>Không có sản phẩm nào trong danh mục này.</p>
                )}
            </Modal>
        </div>
    );
}
