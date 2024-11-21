import { useSelector } from "react-redux";
import Modal from "../../components/modal/Modal";
import { formatCurrency, formatDate } from "../../utils/fotmatDate";
import ShowPromotion from "./ShowPromotion";

export default function ProductInvoiceRefund({ isModalOpen, closeModal, products, selectedInvoice }) {
    console.log('selectedInvoice', selectedInvoice)
    const user = useSelector((state) => state.auth?.login?.currentUser?.user);
    const employees = useSelector((state) => state.employee?.employees) || [];

    // Lọc thông tin nhân viên dựa vào employee_id
    let employee = employees.find(emp => emp._id === selectedInvoice?.employee_id);
    const productList = useSelector((state) => state.product?.products) || [];


    // Nếu không tìm thấy employee trong employees, kiểm tra user
    console.log('user', user);
    if (!employee && user?._id === selectedInvoice?.employee_id) {
        employee = user;
    }

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
                    <h3 style={{ marginBottom: -10, textAlign: 'center' }}>Thông tin đơn hàng</h3>

                    <div className="invoice-table">
                        <table>
                            <tbody>
                                {selectedInvoice?.invoiceCode && (
                                    <tr>
                                        <th>Mã hoá đơn trả:</th>
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
                                {/* {selectedInvoice?.createdAt && (
                                    <tr>
                                        <th>Ngày đặt hàng:</th>
                                        <td>{formatDate(selectedInvoice.createdAt)}</td>

                                    </tr>
                                )} */}

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
                                {employee && (
                                    <tr>
                                        <th>Mã nhân viên:</th>
                                        <td>{employee.employee_id}</td>
                                        <th>Tên nhân viên:</th>
                                        <td>{employee.name}</td>
                                    </tr>
                                )}

                                <tr>
                                    <th>Phương thức thanh toán:</th>
                                    <td>{selectedInvoice.paymentMethod}</td>
                                    <th>Tổng tiền:</th>
                                    <td>{formatCurrency(selectedInvoice.paymentAmount)}</td>
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
                                    <th>Hình ảnh</th>
                                    <th>Mã hàng</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Đơn vị</th>
                                    <th style={{ textAlign: 'center' }}>Số lượng</th>
                                    <th style={{ textAlign: 'center' }}>Giá gốc</th>
                                    <th style={{ textAlign: 'center' }}>Giá tổng</th>
                                    <th style={{ textAlign: 'center' }}>Khuyến mãi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => {
                                    // Find the product in the productList based on item_code
                                    const productFind = productList.find(p => p.item_code === product.item_code);
                                    // If productFind exists, search for the unit in unit_convert based on unit._id
                                    const unitImage = productFind?.unit_convert?.find(u => u.unit._id === product.unit._id)?.img || null;

                                    return (
                                        <tr key={product._id}>
                                            <td>
                                                {unitImage ? (
                                                    <img src={unitImage ? unitImage : product.productImg} alt={product.productName} />
                                                ) : (
                                                    <img src={product.productImg} alt={product.productName} /> // Fallback if no unit image is found
                                                )}
                                            </td>
                                            {product.item_code && <td>{product.item_code}</td>}
                                            {product.productName && <td>{product.productName}</td>}
                                            {product.unit.description && <td>{product.unit.description}</td>}
                                            {product.quantity && <td style={{ textAlign: 'center' }}>{product.quantity}</td>}
                                            {product.price && <td style={{ textAlign: 'right' }}>{formatCurrency(product.price)}</td>}
                                            {product.total && <td style={{ textAlign: 'right' }}>{formatCurrency(product.total)}</td>}
                                            <td> <ShowPromotion promotion={product.promotion} /></td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                        </table>
                    )}
                </div>
            </div>

        </Modal>
    );
}