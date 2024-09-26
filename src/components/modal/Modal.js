import React from 'react';
import ReactModal from 'react-modal';
import './Modal.scss';

export default function Modal({ isOpen, onClose, children }) {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal-content"
            overlayClassName="modal-overlay"
            ariaHideApp={false}
        >
            {children}
            <button className="modal-close" onClick={onClose}>Đóng</button>
        </ReactModal>
    );
}