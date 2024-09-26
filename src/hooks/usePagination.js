import { useState } from 'react';

const usePagination = (items, itemsPerPage) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [inputPage, setInputPage] = useState(1); // State cho số trang nhập vào

    // Tính toán các phần tử cần hiển thị dựa trên trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items?.slice(indexOfFirstItem, indexOfLastItem);

    // Tính tổng số trang
    const totalPages = Math.ceil(items?.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            setInputPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setInputPage(currentPage - 1);
        }
    };

    const goToPage = (page) => {
        setCurrentPage(page);
        setInputPage(page);
    };

    // Chuyển trang ngay lập tức khi giá trị thay đổi
    const handlePageInputChange = (event) => {
        const value = event.target.value;
        if (value === '') {
            setInputPage(value);
        } else {
            const pageNumber = parseInt(value, 10);
            if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
                goToPage(pageNumber);
                setInputPage(pageNumber);
            } else {
                alert(`Vui lòng nhập số trang từ 1 đến ${totalPages}`);
            }
        }
    };

    return {
        currentPage,
        totalPages,
        currentItems,
        inputPage,
        handleNextPage,
        handlePreviousPage,
        goToPage,
        handlePageInputChange,
    };
};

export default usePagination;