import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAccessToken, useAxiosJWT } from '../utils/axiosInstance';
import { useNavigate } from 'react-router';
import { addBillWarehouse } from '../services/warehouseRequest';
import { toast } from 'react-toastify';

const useAddBill = () => {
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth?.login?.currentUser);
    const productList = useSelector((state) => state.product?.products);
    const unitList = useSelector((state) => state.unit?.units);

    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState(Array(products.length).fill(1)); // Khởi tạo mảng số lượng
    const [units, setUnits] = useState(Array(products.length).fill(null)); // Khởi tạo mảng với giá trị null cho mỗi sản phẩm
    const [ordererName] = useState(user?.user?.name); // Correctly use only the first element of useState
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [billId, setBillId] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getUnitDescription = (unitId) => {
        const unitProduct = unitList.find(unit => unit._id === unitId);
        return unitProduct ? unitProduct?.description : '';
    };

    const getItemCodeProduct = (product_id) => {
        const product = productList.find(product => product._id === product_id);
        return product ? product.item_code : '';
    };

    const getNameProduct = (product_id) => {
        const product = productList.find(product => product._id === product_id);
        return product ? product.name : '';
    };


    const handleQuantityChange = (index, value) => {
        setQuantities((prevQuantities) => {
            const newQuantities = [...prevQuantities];
            newQuantities[index] = value < 1 ? 1 : value; // Đảm bảo số lượng tối thiểu là 1
            return newQuantities;
        });
    };


    const handleRemoveProduct = (index) => {
        setProducts((prevProducts) => {
            const newProducts = [...prevProducts];
            newProducts.splice(index, 1); // Xóa sản phẩm tại index
            return newProducts;
        });

        // Cập nhật số lượng
        setQuantities((prevQuantities) => {
            const newQuantities = [...prevQuantities];
            newQuantities.splice(index, 1); // Xóa số lượng tương ứng
            return newQuantities;
        });

        // Cập nhật đơn vị
        setUnits((prevUnits) => {
            const newUnits = [...prevUnits];
            newUnits.splice(index, 1); // Xóa đơn vị tương ứng
            return newUnits;
        });
    };

    const handleAddProduct = () => {
        setProducts((prevProducts) => {
            // Thêm sản phẩm mới vào danh sách sản phẩm
            return [...prevProducts, { item_code: '', name: '', unit_id: null }];
        });

        // Thêm số lượng mới cho sản phẩm mới
        setQuantities((prevQuantities) => {
            return [...prevQuantities, 1]; // Mặc định số lượng là 1
        });

        // Thêm đơn vị mới cho sản phẩm mới
        setUnits((prevUnits) => {
            return [...prevUnits, null]; // Mặc định đơn vị là null
        });
    };



    const handleProductSelect = (index, selectedOption) => {
        const selected = productList.find(product => product.item_code === selectedOption.value);
        if (selected) {
            setProducts((prevProducts) => {
                const newProducts = [...prevProducts];
                newProducts[index] = selected; // Cập nhật sản phẩm tại index
                return newProducts;
            });
        }
    };


    const handleUnitSelect = (index, selectedOption) => {
        setUnits((prevUnits) => {
            const newUnits = [...prevUnits];
            newUnits[index] = selectedOption.value; // Lưu đơn vị tương ứng với index
            return newUnits;
        });

    };


    const handleSupplierSelect = async (selectedOption) => {
        setSelectedSupplier(selectedOption);
    };

    const productOptions = useMemo(() => {
        return productList
            .map(product => ({
                value: product.item_code,
                label: product.item_code,
            }));
    }, [productList]);

    const unitOptions = (product) => {
        console.log('product', product);
        // Lọc các đơn vị có status là true
        const filteredUnits = product?.unit_convert?.filter(unitProduct => unitProduct.status === true);
        console.log('filteredUnits', filteredUnits);

        // Truy xuất unitProduct từ các đơn vị đã được lọc
        const unitOptions = filteredUnits?.map(unitProduct => ({
            value: unitProduct?.unit._id,
            label: unitProduct?.unit.description,
        }));

        return unitOptions;
    };


    const handleOrder = async () => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn nhập phiếu không?');
        if (!isConfirmed) return;

        if (billId === '') {
            toast.warning('Vui lòng nhập mã phiếu nhập kho');
            return;
        }

        if (description === '') {
            toast.warning('Vui lòng nhập mô tả cho phiếu nhập');
            return;
        }

        // Check if all units are selected before proceeding
        for (let i = 0; i < products.length; i++) {
            if (!units[i]) {
                toast.warning(`Vui lòng chọn đơn vị tính cho sản phẩm: ${products[i].item_code}`);
                return; // Stop the process if any unit is missing
            }
        }

        setIsLoading(true);
        try {
            const orderData = {
                accountId: user?.id,
                billId: billId,
                description: description,
                productList: products.map((product, index) => ({
                    product_id: product._id,
                    item_code: product.item_code,
                    quantity: quantities[index] || 1,
                    unit_id: units[index],
                })),
            };


            await addBillWarehouse(orderData, navigate, accessToken, axiosJWT);
        } catch (error) {
            console.error('Nhập hàng thất bại:', error);
            toast.error(error.response ? error.response.data.message : error.message);
        } finally {
            setIsLoading(false);
        }
    };

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
        productOptions,
        handleProductSelect,
        isLoading,
        billId,
        setBillId,
        handleUnitSelect,
        units,
        unitOptions,
        getUnitDescription,
        handleAddProduct,
        getNameProduct,
        getItemCodeProduct,
        setDescription,
        description,
        setUnits
    };
};


export default useAddBill;
