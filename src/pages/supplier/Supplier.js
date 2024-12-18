import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import ProductSupplier from './ProductSupplier';
import { useLocation, useNavigate } from 'react-router';
import { CiEdit } from 'react-icons/ci';
import Modal from '../../components/modal/Modal';
import UpdateSupplier from './UpdateSupplier';
import AddSuplier from './AddSupplier';
import { MdDelete } from 'react-icons/md';
import { deleteSupplier } from '../../services/supplierRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

export default function Supplier() {
    const navigate = useNavigate();
    const location = useLocation();
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();

    const suppliers = useSelector((state) => state.supplier?.suppliers) || [];
    const enhancedSuppliers = suppliers.map((supplier) => ({
        ...supplier,
        productCount: Array.isArray(supplier.products) ? supplier.products.length : 0,
    }));
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenNewSupplier, setIsOpenNewSupplier] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);


    const handleEditClick = (event, product) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click của hàng bảng
        setSelectedSupplier(product);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedSupplier(null);
    };

    const handleDeleteClick = async (event, supplier) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click của hàng bảng
        if (supplier.productCount > 0) {
            console.log('Không thể xóa nhà cung cấp có sản phẩm.');
            toast.warning('Không thể xóa nhà cung cấp khi vẫn còn sản phẩm');
            return;
        }
        if (window.confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp "${supplier.name}"?`)) {
            try {
                console.log('Đang xóa danh mục:', supplier);
                await deleteSupplier(supplier._id, accessToken, axiosJWT, navigate);
            } catch (error) {
                console.error('Failed to delete category:', error);
                toast.error('Có lỗi xảy ra khi xóa nhà cung cấp.');
            }
        }
    }

    const supplierColumns = [
        { title: 'Nhà cung cấp', dataIndex: 'name', key: 'name', width: '20%' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', width: '5%' },
        { title: 'Email', dataIndex: 'email', key: 'email', width: '5%' },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: '30%',
            render: (address) => {
                if (!address) return '';
                const { street, ward, district, city } = address;
                return `${street}, ${ward}, ${district}, ${city}`;
            }
        },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '20%' },
        { title: 'Số lượng sản phẩm', dataIndex: 'productCount', key: 'productCount', width: '10%', className: 'text-center' },
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
            width: '10%',
            className: 'text-center',
            render: (_, __, index) => index + 1
        },
        { title: 'Mã hàng', dataIndex: 'item_code', key: 'item_code', width: '10%', className: 'text-center' },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', width: '25%' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '35%' },
        { title: 'Barcode', dataIndex: 'barcode', key: 'barcode', width: '20%', className: 'text-center' },
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
                onButtonClick={() => setIsOpenNewSupplier(true)}
            />

            <ProductSupplier
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                products={products}
                productColumns={productColumns}
            />

            {isOpenNewSupplier && (
                <AddSuplier
                    isOpen={isOpenNewSupplier}
                    onClose={() => setIsOpenNewSupplier(false)}
                />
            )}


            {isEditModalOpen && (
                <Modal
                    title='Cập nhật nhà cung cấp'
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    width={'30%'}
                >
                    <UpdateSupplier
                        supplier={selectedSupplier}
                    />
                </Modal>
            )}
        </div>
    );
}