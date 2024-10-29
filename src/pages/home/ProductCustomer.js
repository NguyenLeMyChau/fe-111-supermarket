import { useLocation, useNavigate } from "react-router";
import HeaderCustomer from "../../components/headerCustomer/HeaderCustomer";
import { IoCartOutline, IoChevronBackOutline } from "react-icons/io5";
import './ProductCustomer.scss';
import { useEffect, useState } from "react";
import UnitSelectModal from "./UnitSelectModal";

export default function ProductCustomer() {
    const location = useLocation();
    const navigate = useNavigate();

    const promotionPrice = 35000;
    const originalPrice = 50000;
    const normalPrice = 60000;
    const promotionDescription = 'Giảm giá 30%';

    const { category } = location.state || {};
    console.log('category', category);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductUnits, setSelectedProductUnits] = useState([]);
    const [selectedProductName, setSelectedProductName] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const openUnitModal = (unitConvert, productName) => {
        setSelectedProductUnits(unitConvert);
        setSelectedProductName(productName);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProductUnits([]);
        setSelectedProductName('');
    };

    return (
        <div className='cart-customer-container'>
            <header>
                <HeaderCustomer />
            </header>
            <main className='main'>
                <div className='main-header'>
                    <div className='product-customer-header-content'>
                        <IoChevronBackOutline size={25} onClick={() => navigate(-1)} />
                        <h3>{category.name}</h3>
                    </div>
                </div>

                <div className='product-customer-product-grid'>
                    {category.products && category.products.length > 0 ? (
                        category.products.map((product, index) => (
                            <div key={index} className='product-card'>
                                <img src={product.img} alt={product.name} />
                                <div className='product-info'>
                                    <p className="name">{product.name}</p>
                                    <p className="price">
                                        {
                                            promotionPrice ? (
                                                <>
                                                    <span className="promotion-price">{promotionPrice.toLocaleString()}đ</span>
                                                    <br />
                                                    <span className="original-price">{originalPrice.toLocaleString()}đ</span>
                                                </>
                                            ) : (
                                                <span className="normal-price">{normalPrice.toLocaleString()}đ</span>
                                            )
                                        }
                                    </p>
                                    {promotionDescription && <p className="promotion-description">{promotionDescription}</p>}

                                    <button className='cart-button'
                                        onClick={() => {
                                            if (product.unit_convert && product.unit_convert.length > 1) {
                                                openUnitModal(product.unit_convert, product.name);
                                            }
                                        }}
                                    >
                                        <IoCartOutline size={30} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <></>
                    )}

                    <UnitSelectModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        units={selectedProductUnits}
                        productName={selectedProductName}
                    />

                </div>
            </main>
        </div>
    );
}