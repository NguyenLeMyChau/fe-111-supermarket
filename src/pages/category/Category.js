import React, { useState } from 'react';
import './Category.scss';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import TableData from '../../containers/tableData/tableData';
import Modal from '../../components/modal/Modal';

Modal.setAppElement('#root');

export default function Category() {
    const categories = useSelector((state) => state.commonData?.dataManager?.categories) || [];
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        { title: 'Loại sản phẩm', dataIndex: 'name', key: 'name', width: '50%' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '50%' },
    ];

    const productColumns = [
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', width: '25%' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '25%' },
        { title: 'Barcode', dataIndex: 'barcode', key: 'barcode', width: '25%' },
        { title: 'Mã hàng', dataIndex: 'item_code', key: 'item_code', width: '25%' },
    ];

    const handleRowClick = (category) => {
        const categoryProducts = category.products || [];
        setProducts(categoryProducts);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false); // Đóng modal
    };

    return (
        <div>
            <FrameData
                title="Loại sản phẩm"
                buttonText="Thêm loại sản phẩm"
                data={categories}
                columns={columns}
                onRowClick={handleRowClick}
            />

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <button onClick={closeModal}>Đóng</button>
                <h2>Sản phẩm trong danh mục</h2>
                {products.length > 0 ? (
                    <TableData
                        columns={productColumns}
                        data={products}
                    />
                ) : (
                    <p>Không có sản phẩm nào trong danh mục này.</p>
                )}
            </Modal>
        </div>
    );
}
