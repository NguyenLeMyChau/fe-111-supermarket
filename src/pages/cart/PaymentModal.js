import { AiFillCloseCircle } from 'react-icons/ai'; // Import icon

const paymentMethods = [
    { id: '1', name: 'MoMo', icon: require('../../assets/icon-momo.png') },
    { id: '2', name: 'Thẻ tín dụng', icon: require('../../assets/icon-the-tin-dung.png') },
    { id: '3', name: 'Ngân hàng', icon: require('../../assets/icon-ngan-hang.jpg') },
];

export default function PaymentModal({ isOpen, onClose, onSelect, selectedPaymentMethod }) {
    return (
        isOpen && (
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4>Chọn phương thức thanh toán</h4>
                        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                            <AiFillCloseCircle size={30} color="#323C64" />
                        </button>
                    </div>
                    <ul>
                        {paymentMethods.map(method => (
                            <li
                                key={method.id}
                                onClick={() => { onSelect(method); onClose(); }}
                                className={selectedPaymentMethod && selectedPaymentMethod.id === method.id ? 'selected' : 'unselected'}
                                style={{ padding: '10px', cursor: 'pointer' }}
                            >
                                <img src={method.icon} alt={method.name} />
                                <span style={{ marginLeft: '10px' }}>{method.name}</span>
                                {selectedPaymentMethod && selectedPaymentMethod.id === method.id && (
                                    <span style={{ marginLeft: 'auto', color:'#4CAF50' }}>✔</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    );
}
