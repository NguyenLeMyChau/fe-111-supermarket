import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAccessToken, useAxiosJWT } from '../utils/axiosInstance';
import { useNavigate } from 'react-router';
import { getUnitById } from '../services/unitRequest';
import { addBillWarehouse } from '../services/warehouseRequest';

const useAddBill = () => {
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth?.login?.currentUser);
    const suppliers = useSelector((state) => state.supplier?.suppliers);
    const productList = useSelector((state) => state.product?.products);

    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const [quantities, setQuantities] = useState();
    const [prices, setPrices] = useState({});

    const [products, setProducts] = useState([]);
    const ordererName = useState(user.user.name);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const [billId, setBillId] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSupplier, setIsLoadingSupplier] = useState(false);

    const handleQuantityChange = (productId, value) => {
        setQuantities((prevQuantities) => {
            const newQuantities = {
                ...prevQuantities,
                [productId]: value < 1 ? 1 : value,
            };
            return newQuantities;
        });
    };

    const handlePriceChange = (productId, value) => {
        setPrices((prevPrices) => {
            const newPrices = {
                ...prevPrices,
                [productId]: value < 1 ? 1000 : value,
            };
            return newPrices;
        });
    };


    const handleRemoveProduct = (productId) => {
        setProducts(products.filter(product => product._id !== productId));
        setQuantities((prevQuantities) => {
            const newQuantities = { ...prevQuantities };
            delete newQuantities[productId];
            return newQuantities;
        });
    };

    const handleOrder = async () => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn nhập phiếu không?');
        if (!isConfirmed) {
            return;
        }

        setIsLoading(true);
        try {
            const orderData = {
                supplierId: selectedSupplier.value,
                accountId: user.id,
                billId: billId,
                productList: products.map(product => ({
                    product_id: product._id,
                    quantity: quantities[product._id],
                    price_order: prices[product._id],
                    unit_id: product.unit_id,
                    item_code: product.item_code,
                })),
            };

            console.log('orderData:', orderData);

            await addBillWarehouse(orderData, navigate, accessToken, axiosJWT);

            setIsLoading(false);

        } catch (error) {
            console.error('Nhập hàng thất bại:', error);
            alert(error.response ? error.response.data.message : error.message);
        } finally {
            setIsLoading(false); // Đặt isLoading thành false khi xử lý xong
        }
    };

    const handleSupplierSelect = async (selectedOption) => {
        setSelectedSupplier(selectedOption);
        setIsLoadingSupplier(true);
        try {
            const supplierId = selectedOption.value;
            const filteredProducts = productList.filter(item => item.supplier_id === supplierId);

            if (filteredProducts.length === 0) {
                setProducts([]);
                return;
            } else {
                // Lấy đơn vị tính cho từng sản phẩm
                const productsWithUnits = await Promise.all(
                    filteredProducts.map(async product => {
                        const unit = await getUnitById(product.unit_id, accessToken, axiosJWT);
                        return {
                            ...product,
                            unit_name: unit.description,
                        };
                    })
                );
                setProducts(productsWithUnits);

                const newQuantities = productsWithUnits.reduce((acc, product) => {
                    acc[product._id] = product.quantity || 1;
                    return acc;
                }, {});
                setQuantities(newQuantities);

                const newPrices = productsWithUnits.reduce((acc, product) => {
                    acc[product._id] = product.price_order || 1000;
                    return acc;
                }, {});

                setPrices(newPrices);
            }

        } catch (error) {
            console.error('Load dữ liệu nhà cung cấp thất bại:', error);
            alert(error.response ? error.response.data.message : error.message);
        } finally {
            setIsLoadingSupplier(false);
        }
    };

    // Sử dụng useMemo để tối ưu hóa việc tạo danh sách nhà cung cấp
    const supplierOptions = useMemo(() => {
        const filteredSuppliers = suppliers
            .map(supplier => ({
                value: supplier._id,
                label: supplier.name,
            }));
        return filteredSuppliers;

    }, [suppliers]);


    return {
        quantities,
        prices,
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
        isLoadingSupplier,
        handlePriceChange,
        billId,
        setBillId,
    };
};

export default useAddBill;
