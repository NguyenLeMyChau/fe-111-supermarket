import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Frame from '../containers/frame/Frame.js';
import Login from '../pages/login/Login.js';
import FrameStaff from '../containers/frame_staff/FrameStaff.js';
import Stall from '../containers/stall/Stall.js';
import Payment from '../pages/payment/Payment.js';
import User from '../containers/user/User.js';
import Category from '../pages/category/Category.js';
import Product from '../pages/product/Product.js';
import Employee from '../pages/employee/Employee';
import Promotion from '../pages/promotion/Promotion';
import Supplier from "../pages/supplier/Supplier";
import Inventory from "../pages/inventory/Inventory";
import Price from "../pages/price/Price.js"

import ProductSupplier from "../pages/supplier/ProductSupplier";
import ProductWarehouse from "../containers/warehouse/ProductWarehouse";
import ProductDetail from '../pages/product/ProductDetail.js';
import Bill from '../pages/bill/Bill.js';
import AddBill from '../pages/bill/AddBill.js';
import Unit from '../pages/unit/Unit.js';
import Invoice from '../pages/invoice/Invoice.js';
import Home from '../pages/home/Home.js';
import Cart from '../pages/cart/Cart.js';
import { PaymentModalProvider } from '../context/PaymentModalProvider.js';
import PaymentInfo from '../pages/cart/PaymentInfo.js';
import PriceDetail from '../pages/price/PriceDetail.js'
import Customer from '../pages/customer/Customer.js';
import Transaction from '../pages/transaction/Transaction.js';
import ProductCustomer from '../pages/home/ProductCustomer.js';
import OrderCustomer from '../pages/userCustomer/OrderCustomer.js';
import OrderDetailCustomer from '../pages/userCustomer/OrderDetailCustomer.js';
import ProductDetailCustomer from '../pages/home/ProductDetailCustomer.js';
import AddStocktaking from '../containers/stocktaking/AddStocktaking.js';
import Stocktaking from '../containers/stocktaking/Stocktaking.js';
import OrderOnline from '../pages/orderOnline/OrderOnline.js';
import Refund from '../pages/payment/Refund.js';
import InvoiceRefund from '../pages/invoiceRefund/InvoiceRefund.js';

function AppRoutes() {
    return (
        <Router>
            <PaymentModalProvider>

                <Routes>
                    <Route path="*" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<Frame />}>
                        <Route path="*" element={<Navigate to="/admin/user" />} />
                        <Route path="user" element={<User />} />
                        <Route path="category" element={<Category />} />
                        <Route path="product" element={<Product />}>
                            <Route path=':productId/product-detail' element={<ProductDetail />} />
                        </Route>
                        <Route path="employee" element={<Employee />} />
                        <Route path="customer" element={<Customer />} />
                        <Route path="promotion" element={<Promotion />} />
                        <Route path="transaction" element={<Transaction />} />
                        <Route path="price" element={<Price />}>
                            <Route path="price-detail" element={<PriceDetail />} />
                        </Route>
                        <Route path="inventory" element={<Inventory />} >
                            <Route path=":inventoryId/product" element={<ProductWarehouse />} />
                        </Route>
                        <Route path="supplier" element={<Supplier />}>
                            <Route path=":supplierId/product" element={<ProductSupplier />} />
                        </Route>
                        <Route path="stall" element={<Stall />}>
                            <Route path=":stall/payment" element={<Payment />} />
                            <Route path=":stall/refund" element={<Refund />} />
                        </Route>
                        {/* <Route path="order" element={<Orders />} >
                        <Route path="add-order" element={<AddOrder />} />
                    </Route> */}

                        <Route path="bill" element={<Bill />} >
                            <Route path="add-bill" element={<AddBill />} />
                        </Route>
                        <Route path="stocktaking" element={<Stocktaking />}>
                            <Route path="add-stocktaking" element={<AddStocktaking />} />
                        </Route>

                        <Route path="unit" element={<Unit />} />
                        <Route path="invoice" element={<Invoice />} />
                        <Route path="refund-invoice" element={<InvoiceRefund />} />
                        <Route path="order-online" element={<OrderOnline />} />
                    </Route>

                    <Route path="/frame-staff" element={<FrameStaff />} />
                    <Route path="/frame-staff/stall" element={<Stall />} />
                    <Route path="/frame-staff/payment" element={<Payment />} />
                    <Route path="/frame-staff/refund" element={<Refund />} />
                    <Route path="/home" element={<Home />} />

                    <Route path="/customer">
                        <Route path="*" element={<Navigate to="/home" />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="payment-info" element={<PaymentInfo />} />
                        <Route path="product" element={<ProductCustomer />} />
                        <Route path="order" element={<OrderCustomer />} />
                        <Route path="order-detail/:orderId" element={<OrderDetailCustomer />} />
                        <Route path="product-detail" element={<ProductDetailCustomer />} />
                    </Route>
                </Routes>
            </PaymentModalProvider>

        </Router>
    );
}

export default AppRoutes;
