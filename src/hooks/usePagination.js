import { useLocation, useNavigate } from "react-router-dom";

const usePagination = (data, itemsPerPage) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { search } = location;
    const queryParams = new URLSearchParams(search);
    const pageNumber = queryParams.get('page');

    const page = (pageNumber ? parseInt(pageNumber, 10) : 1);

    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const goToPage = (page) => {
        const currentPath = location.pathname;
        if (page === 1) {
            navigate(currentPath);
            return;
        }
        navigate(`${currentPath}?page=${page}`);
    };

    return {
        totalPages,
        currentItems,
        goToPage,
        currentPage: page,
    };
};

export default usePagination;
