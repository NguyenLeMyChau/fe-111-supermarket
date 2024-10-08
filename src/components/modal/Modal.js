import React from 'react';
import ReactModal from 'react-modal';
import './Modal.scss';
import { MdCancel } from "react-icons/md";

export default function Modal({ title, isOpen, onClose, children, width, height, paddingBottom }) {
    const customStyles = {
        content: {
            width: width,
            height: height,
            paddingBottom: paddingBottom,
        },
    };
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal-content"
            overlayClassName="modal-overlay"
            style={customStyles}
            ariaHideApp={false}
        >
            <div className="modal-header" >
                <h2>{title}</h2>
                <button className="modal-close" onClick={onClose}>
                    <MdCancel size={35} color='red' />
                </button>
            </div>
            <div className="modal-body">
                {children}
            </div>
        </ReactModal>
    );
}
