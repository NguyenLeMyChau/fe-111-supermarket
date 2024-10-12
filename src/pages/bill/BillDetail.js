import React from 'react';
import { formatCurrency, formatDate } from '../../utils/fotmatDate';
import '../../containers/order/AddOrder.scss';

const BillDetail = ({ bill }) => {


    return (
        <div className="add-order-container">
            <h2>Phiếu nhập kho</h2>
            <div className="order-info">
                <div className="info-group">
                    <label>Tên người nhập:</label>
                    <span>{bill.employee.name}</span>
                </div>

                <div className="info-group">
                    <label>Ngày nhập:</label>
                    <span>{formatDate(bill.createdAt)}</span>
                </div>

                <div className="info-group">
                    <label>Nhà cung cấp:</label>
                    <span>{bill.supplier_id.name}</span>
                </div>
            </div>

            <div className="product-list">
                <h4>Thông tin nhập:</h4>

                {bill.products.length > 0 && (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Mã sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Đơn vị tính</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bill.products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product.item_code}</td>
                                    <td>{product.name}</td>
                                    <td>{product.unit_name}</td>
                                    <td>{product.quantity}</td>
                                    <td>{formatCurrency(product.price)}</td>
                                    <td>{formatCurrency(product.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default BillDetail;
