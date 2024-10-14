import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { getProductsDetail } from '../../services/productRequest';
import { useLocation, useNavigate } from 'react-router';
import ProductDetail from './ProductDetail'; // Import ProductDetail component
import { CiEdit } from 'react-icons/ci';
import Modal from '../../components/modal/Modal';
import UpdateProduct from './UpdateProduct';
import AddProduct from './AddProduct';

export default function Product() {
    const navigate = useNavigate();
    const location = useLocation();
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const products = useSelector((state) => state.product?.products) || [];
    const isProductDetail = location.pathname.includes('product-detail');
    const [isOpenNewProduct, setIsOpenNewProduct] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleEditClick = (event, product) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click của hàng bảng
        setSelectedProduct(product);
        setIsEditModalOpen(true);
        console.log('Selected product', product);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    const productColumns = [
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
        }
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
                    onButtonClick={() => setIsOpenNewProduct(true)}
                />
            )}

            {isOpenNewProduct && (
                <AddProduct
                    isOpen={isOpenNewProduct}
                    onClose={() => setIsOpenNewProduct(false)}
                />
            )}

            {isEditModalOpen && (
                <Modal
                    title='Cập nhật sản phẩm'
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    width={'70%'}
                >
                    <UpdateProduct
                        product={selectedProduct}
                    />
                </Modal>
            )}
        </>
    );
}
