import React from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { getProductsDetail } from '../../services/productRequest';
import { useLocation, useNavigate } from 'react-router';
import ProductDetail from './ProductDetail'; // Import ProductDetail component

export default function Product() {
    const navigate = useNavigate();
    const location = useLocation();
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const products = useSelector((state) => state.product?.products) || [];
    const isProductDetail = location.pathname.includes('product-detail');

    const productColumns = [
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', width: '35%' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '35%' },
        { title: 'Barcode', dataIndex: 'barcode', key: 'barcode', width: '15%', className: 'text-center' },
        { title: 'Mã hàng', dataIndex: 'item_code', key: 'item_code', width: '15%', className: 'text-center' },
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
        </>
    );
}
