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
import Orders from "../pages/orders/Orders";

import ProductSupplier from "../pages/supplier/ProductSupplier";

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="*" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Frame />}>
                    <Route path="*" element={<Navigate to="/admin/user" />} />
                    <Route path="user" element={<User />} />
                    <Route path="category" element={<Category />} />
                    <Route path="product" element={<Product />} />
                    <Route path="employee" element={<Employee />} />
                    <Route path="promotion" element={<Promotion />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="supplier" element={<Supplier />}>
                        <Route path=":supplierId/product" element={<ProductSupplier />} />
                    </Route>
                    <Route path="order" element={<Orders />} />
                </Route>
                <Route path="/frame-staff" element={<FrameStaff />} />
                <Route path="/frame-staff/stall" element={<Stall />} />
                <Route path="/frame-staff/payment" element={<Payment />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
