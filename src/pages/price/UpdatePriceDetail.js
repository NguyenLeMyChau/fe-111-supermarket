import React, { useCallback, useEffect, useState } from "react";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { useAxiosJWT, useAccessToken } from "../../utils/axiosInstance";
import { validatePriceDetailData } from "../../utils/validation";
import { updateProductPriceDetail } from "../../services/priceRequest"; // Update this to your actual service path
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../services/productRequest";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

export default function UpdatePriceDetail({
  priceDetail,
  priceDetailid,
  onClose,
  updateProductPriceHeader,
  updateProductPriceDe,
}) {
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const units = useSelector((state) => state.unit?.units) || [];
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productPriceData, setProductPriceData] = useState({
    name: priceDetail.product.name || "",
    item_code: priceDetail.item_code || "",
    unit_id: priceDetail.unit_id._id,
    price: priceDetail.price || "",
    productPriceHeader_id: priceDetail.productPriceHeader_id || "",
  });
  console.log(priceDetail, priceDetailid);
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
    fetchProducts();
  }, []);

  useEffect(() => {
    // Set the product price data when the priceDetail prop changes
    if (priceDetail) {
      setProductPriceData({
        name: priceDetail.product.name,
        item_code: priceDetail.item_code,
        unit_id: priceDetail.unit_id._id,
        price: priceDetail.price,
        productPriceHeader_id: priceDetail.productPriceHeader_id,
      });
    }
  }, [priceDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductPriceData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateProductPrice = async (e) => {
    e.preventDefault();
    setLoading(true)
    const validationErrors = validatePriceDetailData(productPriceData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.success(JSON.stringify(validationErrors)); // Displaying the validation errors properly
      setLoading(false)
      return;
    }
    try {
      const updatedPrice = await updateProductPriceDetail(
        accessToken,
        axiosJWT,
        dispatch,
        productPriceData,
        priceDetailid
      ); // Use your updated service
      if (updatedPrice) {
        setProductPriceData({
          name: "",
          item_code: "",
          unit_id: "",
          price: "",
          productPriceHeader_id: priceDetail.productPriceHeader_id,
        });
        setErrors({});
        setLoading(false)
        toast.success(updatedPrice.message);
        const updatedProductPriceHeader = updatedPrice.data.find(
          (item) => item._id === productPriceData.productPriceHeader_id
        );

        if (updatedProductPriceHeader) {
          const productDetail = updatedProductPriceHeader.productPrices || [];
          console.log("Product Price Header:", updatedProductPriceHeader);
          console.log("Product Detail:", productDetail);
          updateProductPriceHeader(updatedProductPriceHeader);
          updateProductPriceDe(productDetail);
          setLoading(false)
          onClose();
        }
      }
    } catch (error) {
      console.error("Failed to update product price:", error);
      setLoading(false)
      toast.error(error);
    }
  };

  return (
    <div className="flex-column-center">
      <form onSubmit={handleUpdateProductPrice}>
        <Input
          label="Mã sản phẩm"
          placeholder="Nhập mã sản phẩm"
          name="price"
          value={productPriceData.item_code}
          onChange={handleChange}
          error={errors.price}
          type="text"
          disabled="true"
        />
        <Input
          label="Sản phẩm"
          placeholder="Nhập tên sản phẩm"
          name="price"
          value={productPriceData.name}
          onChange={handleChange}
          error={errors.price}
          type="text"
          disabled="true"
        />
        <Input
          label="Đơn vị tính"
          placeholder="Nhập đơn vị tính"
          name="price"
          value={
            units.find((unit) => unit._id === productPriceData.unit_id)
              .description
          }
          onChange={handleChange}
          error={errors.price}
          type="text"
          disabled="true"
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
              <Button type="submit" text="Cập nhật" />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
