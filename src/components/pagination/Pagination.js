import React from 'react';
import './Pagination.scss';
import usePagination from '../../hooks/usePagination';

export default function Pagination({ data, itemsPerPage }) {
    const {
        currentPage,
        totalPages,
        goToPage,
        renderPageNumbers,
    } = usePagination(data, itemsPerPage);

    return (
        <div className="pagination">
            <button className="pagination-button-prev"
                onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                &lt;
            </button>

            {renderPageNumbers()}

            <button className="pagination-button-next"
                onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                &gt;
            </button>
        </div>
    );
}
