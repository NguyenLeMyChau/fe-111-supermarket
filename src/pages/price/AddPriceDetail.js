import React, { useEffect, useState } from "react";
import Modal from "../../components/modal/Modal";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { useAxiosJWT, useAccessToken } from "../../utils/axiosInstance";
import { validatePriceDetailData } from "../../utils/validation";
import {
  addProductPriceDetail,
  getProductNoPrice,
} from "../../services/priceRequest";
import Dropdownpicker from "../../components/dropdownpicker/dropdownpicker";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../services/productRequest";
import { useNavigate } from "react-router";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

export default function AddProductPriceDetail({
  isOpen,
  onClose,
  productPriceHeader,
  updateProductPriceDetail,
  updateProductPriceHeader
}) {
  
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const dispatch = useDispatch();
  const units = useSelector((state) => state.unit?.units) || [];
  const [unitItem, setUnitItem] = useState(units);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productPriceData, setProductPriceData] = useState({
    name:"",
    item_code: "",
    unit_id: "",
    price: "",
    productPriceHeader_id: productPriceHeader._id,
  });

  const [errors, setErrors] = useState({});
  const fetchProducts = async () => {
    try {
      const productsData = await getAllProducts(
        accessToken,
        axiosJWT,
        dispatch
      );
  
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductPriceData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleDropdownChange = (name, value) => {
    setProductPriceData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleDropdownChangeProduct = (name, value) => {
    if (name === "unit_id") {
      setProductPriceData((prevData) => ({ ...prevData, unit_id: value ,price:""}));
      const productPrice = productPriceHeader.productPrices?.find(
        (product) =>
          product.item_code === productPriceData.item_code &&
          product.unit_id._id === value
      );
      console.log(productPrice);

      if (productPrice)
        setProductPriceData((prevData) => ({
          ...prevData,
          price: productPrice.price,
        }));
       else   setProductPriceData((prevData) => ({
        ...prevData,
        price: "",
      }));
    }
    if (name === "item_code" || name === "name") {
      const selectedProduct = products?.find(
        (product) => product.name === value || product.item_code === value
      );
      console.log(selectedProduct);
      if (selectedProduct) {
        // Get the unit IDs for the selected product
        const unitIds = products
        .filter((product) => product.item_code === selectedProduct.item_code) // Lọc sản phẩm theo item_code
        .flatMap((product) => 
          product.unit_convert
            .filter((unit) => unit.status === true) // Lọc chỉ các đơn vị có unit.status === true
            .map((unit) => unit.unit) // Lấy giá trị của unit
        );
      
      console.log(unitIds);
      
        if (unitIds) {
          setUnitItem(unitIds);
        }

        setProductPriceData((prevData) => ({
          ...prevData,
          name: selectedProduct.name,
          item_code: selectedProduct.item_code,
          unit_id: "",
        }));
      }
    }
      const productPrice = productPriceHeader.productPrices?.find(
        (product) =>
          product.item_code === productPriceData.item_code &&
          product.unit_id._id === productPriceData.unit_id
      );
      console.log(productPrice);

      if (productPrice)
        setProductPriceData((prevData) => ({
          ...prevData,
          price: productPrice.price,
        }));
    
  };
  const handleAddProductPrice = async (e) => {
    e.preventDefault();
setLoading(true)
    const validationErrors = validatePriceDetailData(productPriceData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(JSON.stringify(validationErrors)); // Displaying the validation errors properly
      setLoading(false)
      return;
    }

    try {
      const addedPrice = await addProductPriceDetail(
        accessToken,
        axiosJWT,
        dispatch,
        productPriceData
      ); // Use your updated service

      if (addedPrice) {
        console.log("Product price added:", addedPrice.data);
        setProductPriceData({
          item_code:"",
          unit_id:"",
          price: "",
          productPriceHeader_id: productPriceHeader._id,
        });
        setErrors({});
        setLoading(false)
        toast.success(addedPrice.message);
        const updatedProductPriceHeader = addedPrice.data?.find(
          (item) => item._id === productPriceData.productPriceHeader_id
        );
  
        if (updatedProductPriceHeader) {
          const productDetail = updatedProductPriceHeader.productPrices || [];
          console.log("Product Price Header:", updatedProductPriceHeader);
          console.log("Product Detail:", productDetail);
          updateProductPriceHeader(updatedProductPriceHeader)
          updateProductPriceDetail(productDetail)
          setLoading(false)
          onClose();
        }
      }
    } catch (error) {
      console.error("Failed to add product price:", error);
      setLoading(false)
      toast.error(error);
    }
  };

  return (
    <Modal
      title="Thêm giá sản phẩm"
      isOpen={isOpen}
      onClose={onClose}
      width={"30%"}
    >
      <div className="flex-column-center">
        <form onSubmit={handleAddProductPrice}>
          <Dropdownpicker
            className="promotion-dropdown"
            label="Mã hàng"
            options={products.map((product) => ({
              value: product.item_code,
              label: product.item_code,
            }))}
            value={productPriceData.item_code}
            onChange={(value) =>
              handleDropdownChangeProduct("item_code", value)
            }
            error={errors.item_code}
          />
          <Dropdownpicker
            className="promotion-dropdown"
            label="Sản phẩm"
            options={products.map((product) => ({
              value: product.name,
              label: product.name,
            }))}
            value={productPriceData.name}
            onChange={(value) => handleDropdownChangeProduct("name", value)}
            error={errors.product_id}
          />
          <Dropdownpicker
            className="promotion-dropdown"
            label="Đơn vị"
            options={unitItem.map((unit) => ({
              value: unit._id,
              label: unit.description,
            }))}
            value={productPriceData.unit_id}
            onChange={(value) => handleDropdownChangeProduct("unit_id", value)}
          />
          <Input
            label="Giá"
            placeholder="Nhập giá sản phẩm"
            name="price"
            value={productPriceData.price}
            onChange={handleChange}
            error={errors.price}
            type="number"
          />

          <div className="flex-row-center">
          {loading ? (
            <ClipLoader size={30} color="#2392D0" loading={loading} />
          ) : (
            <div className="login-button" style={{ width: 200 }}>
            <Button type="submit" text="Thêm" />
            </div>
          )}
          </div>
        </form>
      </div>
    </Modal>
  );
}
