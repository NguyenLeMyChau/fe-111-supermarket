import { useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";


const productCategories = [
    { name: 'Sữa', item: 10, img: 'https://res.cloudinary.com/df1iihqft/image/upload/v1728911017/supermarket-111/c01213f7-6d38-49b2-9905-9b13178d94b2.png' },
    { name: 'Nước giải khát', item: 10, img: 'https://res.cloudinary.com/df1iihqft/image/upload/v1728909649/supermarket-111/af979a7b-ca18-43cf-aedd-be7a76be4b04.png' },
    { name: 'Cookie', item: 10, img: 'https://supermarket-111.s3.ap-southeast-1.amazonaws.com/1728913327830.png' },
    { name: 'Bia', item: 10, img: 'https://res.cloudinary.com/df1iihqft/image/upload/v1728910569/supermarket-111/image-Photoroom_1_k6zm88.png' },
    { name: 'Thực phẩm', item: 10, img: 'https://res.cloudinary.com/df1iihqft/image/upload/v1728910573/supermarket-111/image-Photoroom_2_kqgwhk.png' },
    { name: 'Dược phẩm', item: 10, img: 'https://res.cloudinary.com/df1iihqft/image/upload/v1728912410/supermarket-111/image-Photoroom_8_ofw0s9.png' },
    { name: 'Mì, Miến, Phở, Cháo', item: 10, img: 'https://res.cloudinary.com/df1iihqft/image/upload/v1728910807/supermarket-111/image-Photoroom_3_hihi37.png' },
    { name: 'Kem', item: 10, img: 'https://res.cloudinary.com/df1iihqft/image/upload/v1728910809/supermarket-111/image-Photoroom_4_kuqldx.png' },
    { name: 'Đồ hộp', item: 10, img: 'https://res.cloudinary.com/df1iihqft/image/upload/v1728912423/supermarket-111/image-Photoroom_10_an84pj.png' },
    { name: 'Xúc xích', item: 10, img: 'https://res.cloudinary.com/df1iihqft/image/upload/v1728912416/supermarket-111/image-Photoroom_9_ghytcm.png' }
];

export default function CategoryCustomer() {
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

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
                    {productCategories.map((category, index) => (
                        <div key={index} className='product-category'>
                            <img src={category.img} alt={category.name} />
                            <span>{category.name}</span>
                            <p>{category.item} sản phẩm</p>
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