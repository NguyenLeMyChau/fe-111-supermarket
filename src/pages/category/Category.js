import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import Modal from '../../components/modal/Modal';
import TableData from '../../containers/tableData/tableData';
import AddCategory from './AddCategory';
import { CiEdit } from 'react-icons/ci';
import UpdateCategory from './UpdateCategory';
import { MdDelete } from 'react-icons/md';

export default function Category() {
    const categories = useSelector((state) => state.category?.categories) || [];
    const enhancedCategories = categories.map((category) => ({
        ...category,
        productCount: Array.isArray(category.products) ? category.products.length : 0,
    }));

    console.log('enhancedCategories', enhancedCategories);

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

    const handleDeleteClick = (event, category) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click của hàng bảng
        if (category.productCount > 0) {
            console.log('Không thể xóa danh mục có sản phẩm.');
            alert('Không thể xóa danh mục khi vẫn còn sản phẩm');
            return;
        }
        // Thực hiện logic xóa, ví dụ: dispatch action để xóa danh mục
        console.log('Đang xóa danh mục:', category);
    };

    const categoryColumn = [
        {
            title: 'Hình ảnh', dataIndex: 'img', key: 'img', width: '20%', className: 'text-center',
            render: (text, record) => (
                <img
                    src={record.img}
                    alt={record.name}
                    style={{ width: 70, height: 70 }}
                />
            )
        },
        { title: 'Loại sản phẩm', dataIndex: 'name', key: 'name', width: '20%' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '30%' },
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
        {
            title: 'Xóa',
            key: 'delete',
            width: '10%',
            className: 'text-center',
            render: (text, record) => (
                record.productCount === 0 ? (
                    <MdDelete
                        style={{ color: 'red', cursor: 'pointer' }}
                        size={25}
                        onClick={(event) => handleDeleteClick(event, record)}
                    />
                ) : (
                    <MdDelete
                        style={{ color: 'grey', cursor: 'not-allowed' }}
                        size={25}
                        title="Không thể xóa danh mục có sản phẩm"
                    />
                )
            ),
        }
    ];


    const productColumns = [
        {
            title: 'STT',
            key: 'index',
            width: '5%',
            className: 'text-center',
            render: (_, __, index) => index + 1
        },
        { title: 'Mã hàng', dataIndex: 'item_code', key: 'item_code', width: '5%', className: 'text-center' },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', width: '35%' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '35%' },
        { title: 'Barcode', dataIndex: 'barcode', key: 'barcode', width: '20%', className: 'text-center' },
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
