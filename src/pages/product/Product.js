import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { getProductsDetail } from '../../services/productRequest';
import { useLocation, useNavigate } from 'react-router';
import ProductDetail from './ProductDetail';
import { CiEdit } from 'react-icons/ci';
import Modal from '../../components/modal/Modal';
import UpdateProduct from './UpdateProduct';
import AddProduct from './AddProduct';
import Button from '../../components/button/Button';
import Select from 'react-select'; // Import react-select

export default function Product() {
    const navigate = useNavigate();
    const location = useLocation();
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const products = useSelector((state) => state.product?.products) || [];
    const categories = useSelector((state) => state.category?.categories) || [];
    console.log('Products', products);
    console.log('Categories', categories);
    const isProductDetail = location.pathname.includes('product-detail');
    const [isOpenNewProduct, setIsOpenNewProduct] = useState(false);

    // Gom các bộ lọc vào object
    const [filters, setFilters] = useState({
        productName: [],
        item_code: [],
        barcode: [],
        category_id: [], // Thêm category_id vào state filters
    });

    const [filteredProducts, setFilteredProducts] = useState(products);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        applyFilters();
    }, [products]);

    const handleEditClick = (event, product) => {
        event.stopPropagation();
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
        { title: 'Mã hàng', dataIndex: 'item_code', key: 'item_code', width: '10%', className: 'text-center', sortable: true },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', width: '20%', sortable: true },
        { title: 'Đơn vị tính', dataIndex: 'unit_id', key: 'unit_id', width: '10%', render: (unit) => unit.description },
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

    const applyFilters = () => {
        let filteredData = products;

        if (filters.productName.length > 0) {
            filteredData = filteredData.filter(product =>
                filters.productName.includes(product.name));
        }

        if (filters.item_code.length > 0) {
            filteredData = filteredData.filter(product =>
                filters.item_code.includes(product.item_code));
        }

        if (filters.barcode.length > 0) {
            filteredData = filteredData.filter(product =>
                filters.barcode.includes(product.barcode));
        }

        if (filters.category_id.length > 0) {
            filteredData = filteredData.filter(product =>
                filters.category_id.includes(product.category_id));
        }

        setFilteredProducts(filteredData);
    };

    // Hàm đặt lại bộ lọc
    const resetFilters = () => {
        setFilters({
            productName: [],
            item_code: [],
            barcode: [],
            category_id: [], // Đặt lại category_id
        });
        setFilteredProducts(products);
    };

    // Options cho react-select
    // Lọc các giá trị không trùng nhau cho productOptions
    const uniqueProductOptions = Array.from(new Set(products.map(product => product.name)))
        .map(name => ({
            value: name,
            label: name
        }));

    // Lọc các giá trị không trùng nhau cho itemCodeOptions
    const uniqueItemCodeOptions = Array.from(new Set(products.map(product => product.item_code)))
        .map(item_code => ({
            value: item_code,
            label: item_code
        }));

    // Lọc các giá trị không trùng nhau cho barcodeOptions
    const uniqueBarcodeOptions = Array.from(new Set(products.map(product => product.barcode)))
        .map(barcode => ({
            value: barcode,
            label: barcode
        }));

    // Tạo danh sách các tùy chọn cho category_id từ categories
    const uniqueCategoryOptions = categories.map(category => ({
        value: category._id,
        label: category.name
    }));

    return (
        <>
            {isProductDetail ? (
                <ProductDetail />
            ) : (
                <>
                    <div className='filter-statistical'>
                        <div className='filter-row'>

                            <div className="filter-item">
                                <label>Mã hàng</label>
                                <Select
                                    isMulti
                                    value={uniqueItemCodeOptions.filter(option => filters.item_code.includes(option.value))}
                                    options={uniqueItemCodeOptions}
                                    onChange={(selectedOptions) => setFilters({ ...filters, item_code: selectedOptions.map(option => option.value) })}
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            width: '200px',
                                            zIndex: 1000,
                                        }),
                                    }}
                                />
                            </div>
                            <div className="filter-item">
                                <label>Tên sản phẩm</label>
                                <Select
                                    isMulti
                                    value={uniqueProductOptions.filter(option => filters.productName.includes(option.value))}
                                    options={uniqueProductOptions}
                                    onChange={(selectedOptions) => setFilters({ ...filters, productName: selectedOptions.map(option => option.value) })}
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            width: '200px',
                                            zIndex: 1000,
                                        }),
                                    }}
                                />
                            </div>
                            <div className="filter-item">
                                <label>Barcode</label>
                                <Select
                                    isMulti
                                    value={uniqueBarcodeOptions.filter(option => filters.barcode.includes(option.value))}
                                    options={uniqueBarcodeOptions}
                                    onChange={(selectedOptions) => setFilters({ ...filters, barcode: selectedOptions.map(option => option.value) })}
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            width: '200px',
                                            zIndex: 1000,
                                        }),
                                    }}
                                />
                            </div>
                            <div className="filter-item">
                                <label>Loại sản phẩm</label>
                                <Select
                                    isMulti
                                    value={uniqueCategoryOptions.filter(option => filters.category_id.includes(option.value))}
                                    options={uniqueCategoryOptions}
                                    onChange={(selectedOptions) => setFilters({ ...filters, category_id: selectedOptions.map(option => option.value) })}
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            width: '200px',
                                            zIndex: 1000,
                                        }),
                                    }}
                                />
                            </div>
                            <div className='button-filter'>
                                <Button
                                    text='Lọc'
                                    backgroundColor='#1366D9'
                                    color='white'
                                    width='100'
                                    onClick={applyFilters}
                                />
                                <Button
                                    text='Huỷ lọc'
                                    backgroundColor='#FF0000'
                                    color='white'
                                    width='100'
                                    onClick={resetFilters}
                                />
                            </div>
                        </div>
                    </div>

                    <FrameData
                        title="Danh sách sản phẩm"
                        buttonText="Thêm sản phẩm"
                        data={filteredProducts}
                        columns={productColumns}
                        onRowClick={handleRowClick}
                        onButtonClick={() => setIsOpenNewProduct(true)}
                    />

                </>
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