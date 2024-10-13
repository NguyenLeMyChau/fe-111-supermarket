import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const usePagination = (data, itemsPerPage) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { search } = location;
    const queryParams = new URLSearchParams(search);
    const pageNumber = queryParams.get('page');
    const page = (pageNumber ? parseInt(pageNumber, 10) : 1);

    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data?.length / itemsPerPage);
    const [inputPage, setInputPage] = useState(page);

    const goToPage = (page) => {
        const currentPath = location.pathname;
        console.log('Navigating to page:', page);
        console.log('Current Path:', currentPath);
        if (page === 1) {
            navigate(currentPath);
            return;
        }
        navigate(`${currentPath}?page=${page}`);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === page || i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
                pageNumbers.push(
                    <button
                        key={i}
                        className={i === page ? 'active' : ''}
                        onClick={() => goToPage(i)}
                    >
                        {i}
                    </button>
                );
            } else if (i === page - 2 || i === page + 2) {
                pageNumbers.push(<span key={i}>...</span>);
            }
        }
        return pageNumbers;
    };


    return {
        totalPages,
        currentItems,
        goToPage,
        currentPage: page,
        renderPageNumbers,
        inputPage,
        setInputPage,
    };
};

export default usePagination;