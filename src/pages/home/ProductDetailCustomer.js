import { useLocation, useNavigate } from "react-router";
import { IoChevronBackOutline } from "react-icons/io5";
import { formatCurrency } from "../../utils/fotmatDate";
import HeaderCustomer from "../../components/headerCustomer/HeaderCustomer";
import useAddBill from "../../hooks/useAddBill";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function ProductDetailCustomer() {
    const location = useLocation();
    const navigate = useNavigate();
    const { product } = location.state || {};
    const containerRef = useRef(null);

    const categoriesCustomer = useSelector((state) => state.categoryCustomer?.categoriesCustomer) || [];
    const { getUnitDescription } = useAddBill();

    const [selectedUnit, setSelectedUnit] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const promotionPrice = 35000;
    const originalPrice = 50000;
    const normalPrice = 60000;
    const promotionDescription = 'Giảm giá 30%';

    const handleSelectUnit = (unit) => {
        setSelectedUnit(unit);
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
        const walk = (x - startX) * 2;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => setIsDragging(false);

    useEffect(() => {
        if (product.unit_convert.length > 0) {
            setSelectedUnit(product.unit_convert[0]);
        }
    }, [product.unit_convert]);

    useEffect(() => {
        if (product.category_id) {
            const filteredProducts = categoriesCustomer?.find(p => p._id === product.category_id);
            const related = filteredProducts?.products.filter(p => p._id !== product._id) || [];
            setRelatedProducts(related);
        }
    }, [product.category_id, categoriesCustomer, product._id]);

    if (!product) {
        return <div>Không tìm thấy sản phẩm</div>;
    }

    return (
        <div className='cart-customer-container'>
            <header>
                <HeaderCustomer />
            </header>
            <main className='main'>
                <div className='main-header'>
                    <div className='product-customer-header-content'>
                        <IoChevronBackOutline size={25} onClick={() => navigate(-1)} />
                        <h3>{product.name}</h3>
                    </div>
                </div>

                <div className='product-detail-customer-container'>
                    <div className="left">
                        <img src={product.img} alt={product.name} className='product-image' />
                    </div>

                    <div className="right">
                        <ul className='unit-list'>
                            {product.unit_convert.map((unit) => (
                                <li key={unit.unit} className='unit-item'>
                                    <img src={unit.img} alt={unit.name} className='unit-img' />
                                    <div className='unit-details'>
                                        <p>{getUnitDescription(unit.unit)}</p>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={selectedUnit === unit}
                                        onChange={() => handleSelectUnit(unit)}
                                        style={{ width: 20, height: 20 }}
                                    />

                                    <div className="price">
                                        {promotionPrice ? (
                                            <>
                                                <div style={{ textAlign: "center" }}>
                                                    <span className="promotion-price">{formatCurrency(promotionPrice)}</span>
                                                    <br />
                                                    <span className="original-price">{formatCurrency(originalPrice)}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="normal-price">{formatCurrency(normalPrice)}</span>
                                        )}
                                    </div>
                                    {promotionDescription && <p className="promotion-description">{promotionDescription}</p>}
                                </li>
                            ))}
                        </ul>

                        <button className="buy-button" style={{ width: '100%' }}>MUA</button>
                    </div>
                </div>

                <div className='related-products-customer'>
                    <h3>Sản phẩm liên quan</h3>
                    <div className='related-products-container'>
                        <ul
                            className='related-products-list'
                            ref={containerRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                        >
                            {relatedProducts.map((relatedProduct) => (
                                <li key={relatedProduct._id} className='related-product-item'
                                    onClick={() => navigate('/customer/product-detail', { state: { product: relatedProduct } })}
                                >
                                    <img src={relatedProduct.img} alt={relatedProduct.name} className='related-product-image' />
                                    <p>{relatedProduct.name}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
