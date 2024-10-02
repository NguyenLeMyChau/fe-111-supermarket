import { useNavigate } from "react-router";
import Button from "../../components/button/Button";
import Modal from "../../components/modal/Modal";
import FrameData from "../../containers/frameData/FrameData";

export default function ProductWarehouse({ isModalOpen, closeModal, products, productColumns }) {
    const navigate = useNavigate();

    const handleOrderClick = (product) => {
        navigate('/admin/order/add-order', { state: { selectedProducts: product } });
    };

    return (
        <Modal
            title={'Sản phẩm trong danh mục'}
            isOpen={isModalOpen}
            onClose={closeModal}
        >
            {
                products.length > 0 ? (
                    <>
                        <div className="warehouse-container">
                            <div className="warehouse-button">
                                <Button
                                    text='Đặt hàng'
                                    backgroundColor='#1366D9'
                                    onClick={() => handleOrderClick(products)}

                                />
                            </div>
                        </div>
                        <FrameData
                            data={products}
                            columns={productColumns}
                        />

                    </>
                ) : (
                    <p style={{ marginLeft: 30 }}>Không có sản phẩm nào trong danh mục này.</p>
                )
            }
        </Modal>
    );
}
