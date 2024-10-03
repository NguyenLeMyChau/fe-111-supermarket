import React, { useState } from 'react';
import './Warehouse.scss';
import { useDispatch, useSelector } from 'react-redux';
import FrameData from '../frameData/FrameData';
import { useLocation, useNavigate } from 'react-router';
import ProductWarehouse from './ProductWarehouse';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { getProductsByWarehouseId } from '../../services/warehouseRequest';

export default function Warehouse() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();

    const warehouses = useSelector((state) => state.warehouse?.warehouse);

    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const warehouseColumn = [
        { title: 'Tên sản phẩm', dataIndex: 'product_name', key: 'product_name', width: '40%' },
        { title: 'Tồn kho', dataIndex: 'stock_quantity', key: 'stock_quantity', width: '20%', className: 'text-center' },
        { title: 'Ngưỡng giá trị', dataIndex: 'min_stock_threshold', key: 'min_stock_threshold', width: '20%', className: 'text-center' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            className: 'text-center',
            render: (status) => (
                <span className={status ? 'status-true' : 'status-false'}>
                    {status ? 'Còn hàng' : 'Hết hàng'}
                </span>
            )
        },];

    const productColumns = [
        { title: 'Tên sản phẩm', dataIndex: 'product_name', key: 'product_name', width: '30%' },
        { title: 'Tồn kho', dataIndex: 'stock_quantity', key: 'stock_quantity', width: '15%', className: 'text-center' },
        { title: 'Ngưỡng giá trị', dataIndex: 'min_stock_threshold', key: 'min_stock_threshold', width: '15%', className: 'text-center' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '15%',
            className: 'text-center',
            render: (status) => (
                <span className={status ? 'status-true' : 'status-false'}>
                    {status ? 'Còn hàng' : 'Hết hàng'}
                </span>
            )
        }
    ];

    const handleRowClick = async (warehouse) => {

        const pathPrev = location.pathname + location.search;
        sessionStorage.setItem('previousWarehousePath', pathPrev);

        const warehouseProduct = await getProductsByWarehouseId(accessToken, axiosJWT, dispatch, warehouse._id);
        setProducts(warehouseProduct);

        navigate('/admin/inventory/' + warehouse._id + '/product');
        setIsModalOpen(true);

    };

    const closeModal = () => {
        setIsModalOpen(false);

        const pathPrev = sessionStorage.getItem('previousWarehousePath');
        if (pathPrev) {
            navigate(pathPrev);
            sessionStorage.removeItem('previousWarehousePath');
        }
    };


    return (
        <div>
            <FrameData
                title="Kho"
                buttonText="Cập nhật kho"
                data={warehouses}
                columns={warehouseColumn}
                itemsPerPage={10}
                onRowClick={handleRowClick}
            />

            <ProductWarehouse
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                products={products}
                productColumns={productColumns}
            />
        </div>
    );
}

