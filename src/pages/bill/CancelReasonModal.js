// CancelReasonModal.js
import React, { useState } from 'react';
import Modal from '../../components/modal/Modal';
import './Bill.scss';

export default function CancelReasonModal({ isOpen, onClose, onSubmit }) {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError('Lý do huỷ phiếu không được để trống');
            return;
        }
        onSubmit(reason);
        setReason('');
        setError('');
    };

    return (
        <Modal
            title="Lý do huỷ phiếu"
            isOpen={isOpen}
            onClose={onClose}
            width={'40%'}
        >
            <div className="cancel-reason-modal">
                <textarea
                    value={reason}
                    onChange={(e) => {
                        setReason(e.target.value);
                        setError(''); // Clear error when user starts typing
                    }}
                    placeholder="Nhập lý do huỷ phiếu"
                    rows="4"
                    className="cancel-reason-textarea"
                />
                {error && <p className="error-message">{error}</p>}
                <button
                    className="cancel-reason-button"
                    onClick={handleSubmit}
                    disabled={!reason.trim()}
                >
                    Xác nhận
                </button>
            </div>
        </Modal>
    );
}