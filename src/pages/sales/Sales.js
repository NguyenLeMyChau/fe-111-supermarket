import React, { useEffect, useState } from "react";
import "./Sales.scss";
import { useLocation, useNavigate } from "react-router-dom";
import PriceCheckModal from "./CheckPrice/PriceCheckModal.js"; // Import the modal
import QuantityModal from "./Quantity/QuantityModal.js";
import { getProductsByBarcodeInUnitConvert } from "../../services/cartRequest.js";
import { useDispatch, useSelector } from "react-redux";
import { useAccessToken, useAxiosJWT } from "../../utils/axiosInstance.js";
import { clearCustomer, clearProductPay, setProductPay } from "../../store/reducers/productPaySlice.js";
import CustomerInfoModal from "./CustomerInfoModal/CustomerInfoModal.js";

const Sales = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const [product, setProduct] = useState();
  const [barcode, setBarcode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantityModalOpen, setQuantityModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(); // Initial total based on sample product
  const productList = useSelector((state) => state.productPay.productPay);
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  const [customerInfoModalOpen, setCustomerInfoModalOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState( useSelector((state) => state.productPay.customer));
console.log(customerInfo)
  useEffect(() => {
    console.log(productList)
    if (productList && productList.length > 0) {
      setCart(productList);
      setTotal(productList.reduce((sum, item) => sum + item.total, 0));
    }
  }, [productList]);

  const handleKeyPress = (value) => {
    if (!value) {
      setBarcode(''); // Set barcode to an empty string if value is empty
    } else {
      setBarcode((prev) => `${prev}${value}`); // Otherwise, append value to barcode
    }
  };
  const handleClear = () => {
    setBarcode(''); // Clear the barcode
  };

  // Handle logout
  const handleLogout = () => {
    if(currentUser.role ==="manager") {
    navigate('/admin/user');
    }else if(currentUser.role ==="staff") {
    navigate('/frame-staff');
    }
  };

  const handleCustomerInfoSubmit = (info) => {
    setCustomerInfo(info);
    console.log("Customer Info Submitted: ", info);
  };

  // Handle selecting a product
  const handleRowClick = (product) => {
    console.log(product)
    setSelectedProduct(product);
  };

  // Open quantity modal
  const openQuantityModal = () => {

    if (selectedProduct) {
      setQuantityModalOpen(true);
    }
  };

  const handleUpdateQuantity = (productId,unit_id, newQuantity) => {
    console.log(unit_id)
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId &&item.price.unit._id=== unit_id
          ? { ...item, quantity: newQuantity, total: item.price.price * newQuantity }
          : item
      )
    );
  
    // Update the total cost based on the price difference due to quantity change
    setTotal((prevTotal) => {
      const item = cart.find((item) => item._id === productId && item.price.unit._id=== unit_id);
      if (item) {
        const priceDifference = item.price.price * (newQuantity - item.quantity);
        return prevTotal + priceDifference;
      }
      return prevTotal;
    });
  };
  
  const handleDelete = () => {
    setBarcode((prevBarcode) => {
      const newBarcode = prevBarcode.slice(0, -1); // Remove the last character
      return newBarcode; // Return the updated barcode as a string
    });
  };
  
  const addProduct = async () => {
    if (barcode) {
        console.log(barcode);
        const product = await getProductsByBarcodeInUnitConvert(barcode, accessToken, axiosJWT);
        console.log(product);
        if (product && !product.message) {
          const price = getPriceByBarcode(product, barcode); // Lấy giá theo barcode
            setCart((prevCart) => {
                console.log(prevCart);
                const existingProduct = prevCart.find((item) => item._id === product._id && item.unit._id === product.unit_id._id);

                if (existingProduct) {
                    // Cập nhật số lượng nếu sản phẩm đã có trong giỏ
                    return prevCart.map((item) => {
                        return item._id === product._id && item.unit._id === product.unit_id._id
                            ? { ...item, unit:price.unit,quantity: item.quantity + 1,price:price, total: price.price*(item.quantity + 1) }
                            : item;
                    });
                } else {
                    // Thêm sản phẩm mới vào giỏ hàng
                    return [
                        ...prevCart,
                        { ...product,unit:price.unit,price:price, quantity: 1, total:  price.price },
                    ];
                }
            });

            // Cập nhật tổng số tiền trong giỏ hàng
            setTotal((prevTotal) => prevTotal + (price.price || 0)); // Sử dụng giá hoặc 0 nếu không tìm thấy
            setBarcode(''); // Xóa dữ liệu trong ô nhập barcode sau khi thêm sản phẩm
        } else {
            alert(product.message);
            setBarcode('');
        }
    }
};

// Hàm lấy giá theo barcode
const getPriceByBarcode = (product, barcode) => {
    const unit = product.unit_converts.find(unit => unit.barcode === barcode);
    console.log(unit)
    return unit?unit:null; // Trả về giá hoặc null nếu không tìm thấy
};


  // Delete selected product
  const handleDeleteProduct = () => {
    if (selectedProduct) {
      console.log(selectedProduct);
      
      // Filter out the item if both id and unit match
      setCart(cart.filter((item) => !(item.id === selectedProduct.id && item.unit === selectedProduct.unit)));
      
      // Adjust the total by subtracting the total of the selected product
      setTotal(total - selectedProduct.total);
      
      // Clear the selected product
      setSelectedProduct(null);
    }
  };
  

  // Delete all products
  const handleDeleteAll = () => {
    const confirmDeleteAll = window.confirm("Bạn có chắc muốn xóa hết tất cả sản phẩm không?");
    if (confirmDeleteAll) {
      setCart([]);
      setTotal(0);
      dispatch(clearProductPay());
      dispatch(clearCustomer());
      setSelectedProduct(null);
    }
  };

  // Handle cancel button to reset the screen
  const handleCancel = () => {
    const confirmCancel = window.confirm("Bạn có chắc muốn hủy toàn bộ và đặt lại màn hình không?");
    if (confirmCancel) {
      setCart([]);
      setTotal(0);
      setSelectedProduct(null);
      setQuantityModalOpen(false);
    }
  };

  const handlePay = () => {
    dispatch(clearProductPay()); 
    dispatch(setProductPay({ productPay: cart, totalAmount: total }));
    navigate('/frame-staff/payment');
  };
  
  const checkPriceByBarcode = async (barcode) => {
    const product = await getProductsByBarcodeInUnitConvert(barcode, accessToken, axiosJWT);
    if (product && !product.message) {
        const priceDetails = getPriceByBarcode(product, barcode);
        return { price: priceDetails, product }; // Return an object with price and product details
    }
    return null; // Return null if the product is not found
};

  return (
    <div className="sales-container">
      <div className="row-top">
        <div className="cart-section">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>Đơn vị</th>
                <th>Giá bán</th>
                <th>Số lượng</th>
                {/* <th>Giảm giá</th> */}
                <th>Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr
                  key={item._id}
                  onClick={() => handleRowClick(item)}
                  className={`clickable-row ${selectedProduct?._id === item._id && selectedProduct?.unit===item.unit? 'selected' : ''}`}
                >
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.unit.description}</td>
                  <td>{item.price.price}</td>
                  <td>{item.quantity}</td>
                  {/* <td>{item.discount || 0}</td> */}
                  <td>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-amount">
            <strong>Tổng cộng: {total}đ</strong>
          </div>
        </div>

        <div className="buttons-right">
          <button onClick={handlePay}>Thanh toán</button>
          <button onClick={openQuantityModal} disabled={!selectedProduct}>Số lượng</button>
          <button onClick={handleDeleteProduct} disabled={!selectedProduct}>Xóa</button>
          <button onClick={handleDeleteAll}>Xóa hết</button>
          {/* <button onClick={handleCancel}>Cancel</button> */}
        </div>
      </div>

      <div className="row-bottom">
        <div className="function-section">
          <button onClick={handleLogout}>Thoát</button>
          <button onClick={() => setCustomerInfoModalOpen(true)}>Nhập thông tin khách hàng</button>
          {/* <button>Bán</button>
          <button>Trả hàng</button>
          <button>In lại hóa đơn</button> */}
          <button onClick={() => setIsModalOpen(true)}>Kiểm tra giá</button>
          {/* <button>Cash</button> */}
        </div>

        <div className="keypad-section">
          <div className="input-section">
            <input
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              type="text"
              className="keypad-input"
              placeholder="Nhập barcode"
            />
            <button onClick={addProduct} className="submit-btn">
              Nhập
            </button>
          </div>

          <div className="keypad">
            <button onClick={() => handleKeyPress(1)}>1</button>
            <button onClick={() => handleKeyPress(2)}>2</button>
            <button onClick={() => handleKeyPress(3)}>3</button>
            <button onClick={() => handleKeyPress(4)}>4</button>
            <button onClick={() => handleKeyPress(5)}>5</button>
            <button onClick={() => handleKeyPress(6)}>6</button>
            <button onClick={() => handleKeyPress(7)}>7</button>
            <button onClick={() => handleKeyPress(8)}>8</button>
            <button onClick={() => handleKeyPress(9)}>9</button>
            <button onClick={() => handleKeyPress(0)}>0</button>
            <button onClick={handleDelete}>Xóa</button>
            <button onClick={handleClear}>Xóa hết</button>
          </div>
        </div>
      </div>

      <PriceCheckModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        checkPriceByBarcode={checkPriceByBarcode}
      />
      <QuantityModal
        isOpen={quantityModalOpen}
        onRequestClose={() => setQuantityModalOpen(false)}
        product={selectedProduct}
        onUpdateQuantity={handleUpdateQuantity}
      />
       <CustomerInfoModal
        isOpen={customerInfoModalOpen}
        onRequestClose={() => setCustomerInfoModalOpen(false)}
        onSubmit={handleCustomerInfoSubmit}
      />
    </div>
  );
};

export default Sales;
