import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import useCommonDataCustomer from "../../hooks/useCommonDataCustomer";
import { useSelector } from "react-redux";

export default function CategoryCustomer() {
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const { fetchDataShop } = useCommonDataCustomer();
    const [loadingShop, setLoadingShop] = useState(true);
    const categoriesCustomer = useSelector((state) => state.categoryCustomer?.categoriesCustomer) || [];


    // useEffect to fetch shop data
    useEffect(() => {
        fetchDataShop(setLoadingShop);
    }, []);

    const handlePrev = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const handleNext = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Tăng tốc độ kéo
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    return (
        <div className='explore-container'>
            <h2 className='explore-title'>Khám phá loại sản phẩm</h2>
            <div className='product-categories-container'>
                <button className='nav-button' onClick={handlePrev}>
                    <FaArrowLeft />
                </button>
                <div
                    className='product-categories'
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    {categoriesCustomer.map((category, index) => (
                        <div key={index} className='product-category'>
                            <img src={category.img} alt={category.name} />
                            <span>{category.name}</span>
                            <p>{category.products.length} sản phẩm</p>
                        </div>
                    ))}
                </div>
                <button className='nav-button' onClick={handleNext}>
                    <FaArrowRight />
                </button>
            </div>
        </div>
    )
}