import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { getProductsDetail } from '../../services/productRequest';
import { useLocation, useNavigate } from 'react-router';
import ProductDetail from './ProductDetail'; // Import ProductDetail component
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDelete } from "react-icons/md";
import Modal from '../../components/modal/Modal';
import UpdateProduct from './UpdateProduct';

export default function Product() {
    const navigate = useNavigate();
    const location = useLocation();
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const products = useSelector((state) => state.product?.products) || [];
    const isProductDetail = location.pathname.includes('product-detail');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleEditClick = (event, product) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click của hàng bảng
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    const productColumns = [
        { title: 'Mã hàng', dataIndex: 'item_code', key: 'item_code', width: '10%', className: 'text-center' },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', width: '30%' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '30%' },
        { title: 'Barcode', dataIndex: 'barcode', key: 'barcode', width: '15%', className: 'text-center' },
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
            title: 'Xoá',
            key: 'delete',
            width: '10%',
            className: 'text-center',
            render: (text, record) => (
                <MdOutlineDelete
                    style={{ color: 'red', cursor: 'pointer' }}
                    size={25}
                    onClick={(event) => handleEditClick(event, record)}
                />
            ),
        },
    ];

    const handleRowClick = async (product) => {
        const detail = await getProductsDetail(accessToken, axiosJWT, product._id);
        console.log('Product detail', detail);
        navigate(`/admin/product/${product._id}/product-detail`, { state: { detail } });
    };

    return (
        <>
            {isProductDetail ? (
                <ProductDetail />
            ) : (
                <FrameData
                    title="Danh sách sản phẩm"
                    buttonText="Thêm sản phẩm"
                    data={products}
                    columns={productColumns}
                    onRowClick={handleRowClick}
                />
            )}

            {isEditModalOpen && (
                <Modal
                    title='Cập nhật sản phẩm'
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    width={'30%'}
                >
                    <UpdateProduct
                        product={selectedProduct}
                    />
                </Modal>
            )}
        </>
    );
}
