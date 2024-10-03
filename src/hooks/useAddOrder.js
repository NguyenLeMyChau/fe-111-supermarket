// src/hooks/useAddOrder.js
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { orderProductFromSupplier } from '../services/warehouseRequest';
import { useAccessToken, useAxiosJWT } from '../utils/axiosInstance';
import { useNavigate } from 'react-router';

const useAddOrder = (selectedProducts, supplier) => {
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth?.login?.currentUser);
    const suppliers = useSelector((state) => state.commonData?.dataManager?.suppliers);

    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const [quantities, setQuantities] = useState(
        selectedProducts.reduce((acc, product) => {
            acc[product.product_id] = 1;
            return acc;
        }, {})
    );

    const [products, setProducts] = useState(selectedProducts);
    const [ordererName, setOrdererName] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Thêm state isLoading

    const handleQuantityChange = (productId, value) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: value < 1 ? 1 : value,
        }));
    };

    const handleRemoveProduct = (productId) => {
        setProducts(products.filter(product => product.product_id !== productId));
        setQuantities((prevQuantities) => {
            const newQuantities = { ...prevQuantities };
            delete newQuantities[productId];
            return newQuantities;
        });
    };

    const handleOrder = async () => {
        setIsLoading(true);
        try {
            const orderData = {
                supplierId: selectedSupplier.value,
                accountId: user.id,
                products: products.map(product => ({
                    product_id: product.product_id,
                    quantity: quantities[product.product_id],
                    price_order: 2000
                })),
            };

            const order = await orderProductFromSupplier(accessToken, axiosJWT, orderData);

            console.log('Kết quả đặt hàng:', order);
            alert('Đặt hàng thành công!');
            navigate('/admin/order');

        } catch (error) {
            console.error('Đặt hàng thất bại:', error);
            alert(error.response ? error.response.data.message : error.message);
        } finally {
            setIsLoading(false); // Đặt isLoading thành false khi xử lý xong
        }
    };

    const handleSupplierSelect = (selectedOption) => {
        setSelectedSupplier(selectedOption);
        console.log('Nhà cung cấp đã chọn:', selectedOption);
    };

    // Sử dụng useMemo để tối ưu hóa việc tạo danh sách nhà cung cấp
    const supplierOptions = useMemo(() => {
        return suppliers.map(supplier => ({
            value: supplier._id,
            label: supplier.name,
        }));
    }, [suppliers]);

    useEffect(() => {
        if (user) {
            setOrdererName(user.user.name);
            if (supplier) {
                setSelectedSupplier({ value: supplier._id, label: supplier.name });
            }
        }

    }, [user, supplier]);

    return {
        quantities,
        products,
        ordererName,
        selectedSupplier,
        setSelectedSupplier,
        handleQuantityChange,
        handleRemoveProduct,
        handleOrder,
        handleSupplierSelect,
        supplierOptions,
        isLoading,
    };
};

export default useAddOrder;
