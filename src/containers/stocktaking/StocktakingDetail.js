import React from 'react';
import { formatDate } from '../../utils/fotmatDate';
import '../../containers/order/AddOrder.scss';

const StocktakingDetail = ({ bill }) => {
    console.log('bill', bill);

    return (
        <div className="add-order-container">
            <h2>Phiếu kiểm kê</h2>
            <div className="order-info">
                <div className='flex-row'>
                    <div className="info-group" style={{ width: 450, marginLeft: 50 }}>
                        <label>Mã phiếu kiểm kê:</label>
                        <span>{bill.stocktakingHeader.stocktaking_id}</span>
                    </div>
                    <div className="info-group">
                        <label>Lý do:</label>
                        <span>{bill.stocktakingHeader.reason}</span>
                    </div>
                </div>

                <div className='flex-row'>
                    <div className="info-group" style={{ width: 450, marginLeft: 50 }}>
                        <label>Người kiểm kê:</label>
                        <span>{bill.employee.name}</span>
                    </div>
                    <div className="info-group">
                        <label>Ngày kiểm kê:</label>
                        <span>{formatDate(bill.stocktakingHeader.createdAt)}</span>
                    </div>
                </div>
            </div>

            <div className="product-list">
                <h4>Thông tin kiểm kê:</h4>

                {bill.details.length > 0 && (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Mã sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Đơn vị tính</th>
                                <th style={{ textAlign: 'center' }}>Số lượng tồn kho</th>
                                <th style={{ textAlign: 'center' }}>Số lượng thực tế</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bill.details.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.item_code}</td>
                                    <td>{product.name}</td>
                                    <td>{product?.unit_name}</td>
                                    <td style={{ textAlign: 'center' }}>{product.quantity_stock}</td>
                                    <td style={{ textAlign: 'center' }}>{product.quantity_actual}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StocktakingDetail;
