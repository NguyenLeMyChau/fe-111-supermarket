import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import Modal from '../../components/modal/Modal';
import TableData from '../../containers/tableData/tableData';
import AddCategory from './AddCategory';
import { CiEdit } from 'react-icons/ci';
import UpdateCategory from './UpdateCategory';

export default function Category() {
    const categories = useSelector((state) => state.category?.categories) || [];
    const enhancedCategories = categories.map((category) => ({
        ...category,
        productCount: Array.isArray(category.products) ? category.products.length : 0,
    }));

    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenNewCategory, setIsOpenNewCategory] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleEditClick = (event, product) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click của hàng bảng
        setSelectedCategory(product);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedCategory(null);
    };


    const categoryColumn = [
        { title: 'Loại sản phẩm', dataIndex: 'name', key: 'name', width: '30%' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '40%' },
        { title: 'Số lượng sản phẩm', dataIndex: 'productCount', key: 'productCount', width: '20%', className: 'text-center' },
        {
            title: 'Chỉnh sửa',
            key: 'edit',
            width: '10%',
            className: 'text-center',
            render: (text, record) => (
                <CiEdit
                    style={{ color: 'blue', cursor: 'pointer' }}
                    size={25}
                    onClick={(event) => handleEditClick(event, record)}
                />
            ),
        },
    ];


    const productColumns = [
        {
            title: 'STT',
            key: 'index',
            width: '5%',
            className: 'text-center',
            render: (_, __, index) => index + 1
        },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', width: '35%' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '35%' },
        { title: 'Barcode', dataIndex: 'barcode', key: 'barcode', width: '20%', className: 'text-center' },
        { title: 'Mã hàng', dataIndex: 'item_code', key: 'item_code', width: '5%', className: 'text-center' },
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
                columns={categoryColumn}
                onRowClick={handleRowClick}
                onButtonClick={() => setIsOpenNewCategory(true)}
            />

            <Modal
                title={'Sản phẩm trong danh mục'}
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                {products.length > 0 ? (
                    <TableData
                        columns={productColumns}
                        data={products}
                    />
                ) : (
                    <p style={{ marginLeft: 30 }}>Không có sản phẩm nào trong danh mục này.</p>
                )}
            </Modal>

            {isOpenNewCategory && (
                <AddCategory
                    isOpen={isOpenNewCategory}
                    onClose={() => setIsOpenNewCategory(false)}
                />
            )}

            {isEditModalOpen && (
                <Modal
                    title='Cập nhật loại sản phẩm'
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    width={'30%'}
                >
                    <UpdateCategory
                        category={selectedCategory}
                    />
                </Modal>
            )}


        </div>
    );
}
