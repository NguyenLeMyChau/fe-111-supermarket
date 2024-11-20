import axios from "axios";
import { getCartFailed, getCartStart, getCartSuccess } from "../store/reducers/cartSlice";
import { clearCustomer, setCustomer } from "../store/reducers/productPaySlice";


const getCartById = async (dispatch, accessToken, axiosJWT, accountId) => {
    dispatch(getCartStart());
    try {
        const response = await axiosJWT.get(`/api/customer/get-cart-by-id?accountId=${accountId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(response.data)
        dispatch(getCartSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error('Get all carts failed:', error);
        dispatch(getCartFailed());
    }
};
const getPromotionByProductId = async (product_id, unit_id) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/get-promotion-by-product`, { product_id, unit_id });
      // Kiểm tra nếu response không có dữ liệu
      if (!response.data) {
        return null; // hoặc return {} hoặc [] tùy thuộc vào nhu cầu của bạn
      }
      return response.data; // Trả về dữ liệu khuyến mãi nếu có
    } catch (error) {
      console.error("Get get-promotion-by-product failed:", error);
      return null; // Trả về null trong trường hợp gặp lỗi
    }
  };
const getPromotions = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/get-promotions`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Get get-promotion-by-product failed:', error);
    }
}


const addProductToCart = async (accessToken, axiosJWT, accountId, productId, unitId, quantity, total) => {
    try {
        const response = await axiosJWT.post(`/api/auth/add-product-to-cart`, {
            accountId,
            productId,
            unitId,
            quantity,
            total,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Thêm sản phẩm vào giỏ hàng thành công');
        return response.data;
    } catch (error) {
        console.error('Add product to cart failed:', error);
        alert('Thêm sản phẩm vào giỏ hàng thất bại ', error);
    }
}
const checkPaymentStatus = async (axiosJWT,appTransId) => {
    try {
      const response = await axiosJWT.post(`/api/zalo-pay/order-status/${appTransId}`);
      console.log(response);
      return response.data;

    //   if (response.data.return_code === 1) {
    //     setPaymentStatus("Thanh toán thành công!");
    //   } else {
    //     setPaymentStatus("Thanh toán thất bại.");
    //   }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

const payZalo = async (accessToken, axiosJWT, amount,employee, customerId, products, paymentMethod, paymentInfo, paymentAmount,promotionOnInvoice,discountPayment,
    totalPayment) => {
    try {
      const response = await axiosJWT.post(`/api/zalo-pay/payment`, {
        amount
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      console.log(response.data);
      const paymentLink = response.data.order_url;
        const paymentData = {
            employee,
            customerId,
            products,
            paymentMethod,
            paymentInfo,
            paymentAmount,
            promotionOnInvoice,
            discountPayment,
            totalPayment
        };
        localStorage.setItem("paymentData", JSON.stringify(paymentData)); 
  
      // Chuyển hướng đến trang thanh toán của ZaloPay
      window.location.href = paymentLink;
  
      // Trả về dữ liệu phản hồi để xử lý sau khi thanh toán thành công
   
    } catch (error) {
      console.error('Pay cart failed:', error);
      return null; // Trả về null hoặc xử lý lỗi nếu có
    }
  };
  
const payCart = async ( accessToken, axiosJWT,employee, customerId, products, paymentMethod, paymentInfo, paymentAmount,promotionOnInvoice,discountPayment,
    totalPayment) => {
    try {
        console.log(employee,customerId, products, paymentMethod, paymentInfo, paymentAmount)
        const response = await axiosJWT.post(`/api/auth/pay-cart-web`, {
            employee,
            customerId,
            products,
            paymentMethod,
            paymentInfo,
            paymentAmount,
            promotionOnInvoice,
            discountPayment,
            totalPayment
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Pay cart failed:', error);
    }

}
const refundCart = async ( accessToken, axiosJWT,employee,invoiceCode,refundReason) => {
    try {
        console.log(employee,invoiceCode)
        const response = await axiosJWT.post(`/api/auth/refund-cart-web`, {
            employee,
            invoiceCode,
            refundReason
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Refund cart failed:', error);
    }

}
const getInvoiceById=async (accessToken, axiosJWT, invoiceId)=>{
    try {
        const response = await axiosJWT.get(`/api/auth/getInvoices/${invoiceId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Get getInvoiceById failed:', error);
    }
}
const getInvoiceRefundById=async (accessToken, axiosJWT, invoiceId)=>{
    try {
        const response = await axiosJWT.get(`/api/auth/getInvoicesRefund/${invoiceId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Get getInvoiceById failed:', error);
    }
}
const getInvoiceLast=async (accessToken, axiosJWT)=>{
    try {
        const response = await axiosJWT.get(`/api/auth/lastInvoice`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Get getInvoiceLast failed:', error);
    }
}
const updateCart = async (accountId, productList, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/customer/update-cart`, {
            accountId,
            productList,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Update cart failed:', error);
    }
}

const removeProductCart = async (accountId, productId, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/customer/remove-product-cart`, {
            accountId,
            productId,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Remove product cart failed:', error);
    }
}

const updateProductCart = async (accountId, productId, quantity, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.post(`/api/customer/update-product-cart`, {
            accountId,
            productId,
            quantity,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        alert('Cập nhật giỏ hàng thành công');
        return response.data;
    } catch (error) {
        console.error('Update product cart failed:', error);
    }
}

const checkStockQuantityInCart = async (item_code, quantity, accessToken, axiosJWT) => {
    try {
        // Gửi yêu cầu GET với item_code và quantity qua query params
        const response = await axiosJWT.get(`/api/customer/check-stock-quantity-in-cart`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: { // Thêm params ở đây
                item_code: item_code,
                quantity: quantity
            }
        });
        console.log('response.data', response.data)
        return response.data;
    } catch (error) {
        console.error('Check stock quantity failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}
const getProductsByBarcodeInUnitConvert = async (barcode, accessToken, axiosJWT) => {
    try {
        console.log(barcode)
        const response = await axiosJWT.post(`/api/auth/get-product-by-barcode`, { barcode }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Get product by barcode failed:', error);
        alert(error.response ? error.response.data.message : error.message);
    }
}
const getCustomerByPhone = async (phone, accessToken, axiosJWT) => {
    try {
        const response = await axiosJWT.get(`/api/auth/get-customer-by-phone/${phone}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error('Get customer failed:', error);
    }
};


export {
    getCartById,
    addProductToCart,
    payCart,
    updateCart,
    removeProductCart,
    updateProductCart,
    getPromotionByProductId,
    checkStockQuantityInCart,
    getPromotions,
    getProductsByBarcodeInUnitConvert,
    getCustomerByPhone,
    getInvoiceById,
    getInvoiceLast,
    refundCart,
    getInvoiceRefundById,
    payZalo,
    checkPaymentStatus
}