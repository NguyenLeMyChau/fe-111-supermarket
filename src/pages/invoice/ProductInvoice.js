import Modal from "../../components/modal/Modal";
import { formatCurrency, formatDate } from "../../utils/fotmatDate";
import ShowPromotion from "./ShowPromotion";

export default function ProductInvoice({ isModalOpen, closeModal, products, selectedInvoice }) {
    return (
        <Modal
            title={'Chi tiết đơn hàng khách hàng'}
            isOpen={isModalOpen}
            onClose={closeModal}
            width={'100%'}
            height={'80%'}
        >

            <div className="invoice-container">
                <div className="invoice-row">
                    <h3 style={{ marginBottom: -10, textAlign: 'center' }}>Thông tin đặt hàng</h3>

                    <div className="invoice-table">
                        <table>
                            <tbody>
                                {selectedInvoice?.invoiceCode && (
                                    <tr>
                                        <th>Mã đơn hàng:</th>
                                        <td>{selectedInvoice.invoiceCode}</td>
                                        <th>Khách hàng:</th>
                                        <td>{selectedInvoice.customerName}</td>
                                    </tr>
                                )}
                                {selectedInvoice?.paymentInfo?.name && (
                                    <tr>
                                        <th>Người nhận:</th>
                                        <td>{selectedInvoice.paymentInfo.name}</td>
                                        <th>Số điện thoại nhận:</th>
                                        <td>{selectedInvoice.paymentInfo.phone}</td>
                                    </tr>
                                )}
                                {selectedInvoice?.createdAt && (
                                    <tr>
                                        <th>Ngày đặt hàng:</th>
                                        <td>{formatDate(selectedInvoice.createdAt)}</td>
                                        <th>Tổng tiền:</th>
                                        <td>{formatCurrency(selectedInvoice.paymentAmount)}</td>
                                    </tr>
                                )}
                                {selectedInvoice?.paymentInfo?.address && (
                                    <tr>
                                        <th>Địa chỉ giao hàng:</th>
                                        <td colSpan={3}>
                                            {[selectedInvoice.paymentInfo.address.street,
                                            selectedInvoice.paymentInfo.address.ward,
                                            selectedInvoice.paymentInfo.address.district,
                                            selectedInvoice.paymentInfo.address.city].filter(Boolean).join(', ')}
                                        </td>
                                    </tr>
                                )}
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
                                    <th style={{ width: '15%' }}>Tên sản phẩm</th>
                                    <th style={{ width: '10%' }}>Đơn vị</th>
                                    <th style={{ textAlign: 'center', width: '10%' }}>Số lượng</th>
                                    <th style={{ textAlign: 'center', width: '10%' }}>Giá gốc</th>
                                    <th style={{ textAlign: 'center', width: '10%' }}>Giá tổng</th>
                                    <th style={{ textAlign: 'center', width: '70%' }}>Khuyến mãi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        {product.productImg && (
                                            <td>
                                                <img src={product.productImg} alt={product.productName} />
                                            </td>
                                        )}
                                        {product.item_code && <td>{product.item_code}</td>}
                                        {product.productName && <td>{product.productName}</td>}
                                        {product.unitName && <td>{product.unitName}</td>}
                                        {product.quantity && <td style={{ textAlign: 'center' }}>{product.quantity}</td>}
                                        {product.price && <td style={{ textAlign: 'right' }}>{formatCurrency(product.price)}</td>}
                                        {product.total && <td style={{ textAlign: 'right' }}>{formatCurrency(product.total)}</td>}
                                        <td> <ShowPromotion promotion={product.promotion} /></td>
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