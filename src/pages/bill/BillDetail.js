import React from 'react';
import { formatDate } from '../../utils/fotmatDate';
import '../../containers/order/AddOrder.scss';

const BillDetail = ({ bill }) => {
    console.log('bill', bill);

    return (
        <div className="add-order-container">
            <h2>Phiếu nhập kho</h2>
            <div className="order-info">
                <div className='flex-row'>
                    <div className="info-group" style={{ width: 450, marginLeft: 50 }}>
                        <label>Mã phiếu nhập kho:</label>
                        <span>{bill.bill_id}</span>
                    </div>
                    <div className="info-group">
                        <label>Mô tả:</label>
                        <span>{bill?.description ? bill?.description : 'Không có mô tả'}</span>
                    </div>
                </div>

                <div className='flex-row'>
                    <div className="info-group" style={{ width: 450, marginLeft: 50 }}>
                        <label>Tên người nhập:</label>
                        <span>{bill.employee.name}</span>
                    </div>
                    <div className="info-group">
                        <label>Ngày nhập:</label>
                        <span>{formatDate(bill.createdAt)}</span>
                    </div>
                </div>

                {bill.status === false && (
                    <div className='flex-row'>
                        <div className="info-group" style={{ width: '100%', marginLeft: 50 }}>
                            <label>Lý do huỷ phiếu:</label>
                            <span className="cancel-reason">{bill.cancel_reason}</span>
                        </div>
                    </div>
                )}
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
                                <th style={{ textAlign: 'center' }}>Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bill.products.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.item_code}</td>
                                    <td>{product.name}</td>
                                    <td>{product?.unit_name?.description}</td>
                                    <td style={{ textAlign: 'center' }}>{product.quantity}</td>
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
