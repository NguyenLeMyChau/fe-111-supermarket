import Modal from "../../components/modal/Modal";
import { formatCurrency, formatDate } from "../../utils/fotmatDate";


export default function ProductInvoice({ isModalOpen, closeModal, products, selectedInvoice }) {
    return (
        <Modal
            title={'Chi tiết đơn hàng khách hàng'}
            isOpen={isModalOpen}
            onClose={closeModal}
            width={'80%'}
            height={'80%'}
        >

            <div className="invoice-container">
                <div className="invoice-row">
                    <h3 style={{ marginBottom: -10, textAlign: 'center' }}>Thông tin đặt hàng</h3>

                    <div className="invoice-table">
                        <table>
                            <tbody>
                                <tr>
                                    <th>Mã đơn hàng:</th>
                                    <td>{selectedInvoice?._id}</td>
                                    <th>Khách hàng:</th>
                                    <td>{selectedInvoice?.customerName}</td>
                                </tr>
                                <tr>
                                    <th>Người nhận:</th>
                                    <td>{selectedInvoice?.paymentInfo?.name}</td>
                                    <th>Số điện thoại nhận:</th>
                                    <td>{selectedInvoice?.paymentInfo?.phone}</td>
                                </tr>
                                <tr>
                                    <th>Ngày đặt hàng:</th>
                                    <td>{formatDate(selectedInvoice?.createdAt)}</td>
                                    <th>Tổng tiền:</th>
                                    <td>{formatCurrency(selectedInvoice?.paymentAmount)}</td>
                                </tr>

                                <tr>
                                    <th>Địa chỉ giao hàng:</th>
                                    <td colSpan={3}>
                                        {[selectedInvoice?.paymentInfo?.address?.street,
                                        selectedInvoice?.paymentInfo?.address?.ward,
                                        selectedInvoice?.paymentInfo?.address?.district,
                                        selectedInvoice?.paymentInfo?.address?.city].filter(Boolean).join(', ')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="invoice-detail">
                    <h3 style={{ textAlign: 'center' }}>Sản phẩm đặt hàng</h3>

                    {products.length > 0 && (
                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '10%' }}>Hình ảnh</th>
                                    <th style={{ width: '10%' }}>Mã hàng</th>
                                    <th>Tên sản phẩm</th>
                                    <th style={{ width: '15%' }}>Đơn vị tính</th>
                                    <th style={{ textAlign: 'center', width: '10%' }}>Số lượng</th>
                                    <th style={{ textAlign: 'center', width: '10%' }}>Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td>
                                            <img src={product.productImg} alt={product.productName}/>
                                        </td>
                                        <td>{product.item_code}</td>
                                        <td>{product.productName}</td>
                                        <td>{product.unitName}</td>
                                        <td style={{ textAlign: 'center' }}>{product.quantity}</td>
                                        <td style={{ textAlign: 'right' }}>{formatCurrency(product.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

        </Modal>
    );
}
