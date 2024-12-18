import { useLocation, useNavigate } from "react-router";
import HeaderCustomer from "../../components/headerCustomer/HeaderCustomer";
import { IoCartOutline, IoChevronBackOutline } from "react-icons/io5";
import "./ProductCustomer.scss";
import { useEffect, useState } from "react";
import UnitSelectModal from "./UnitSelectModal";
import useCart from "../../hooks/useCart";
import { formatCurrency } from "../../utils/fotmatDate";

export default function ProductCustomer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addCart } = useCart();

  const promotionPrice = 35000;
  const originalPrice = 50000;
  const normalPrice = 60000;
  const promotionDescription = "Giảm giá 30%";

  const { category } = location.state || {};
  console.log("category", category);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductUnits, setSelectedProductUnits] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openUnitModal = (productUnit) => {
    setSelectedProductUnits(productUnit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductUnits([]);
  };

  const handleAddCart = async (product) => {
    console.log("selectedProduct", product);
    console.log("product id", product._id);
    console.log("product unit id", product.unit_id);
    await addCart(product._id, product.unit_id, 1, 10000);
  };

  return (
    <div className="cart-customer-container">
      <header>
        <HeaderCustomer />
      </header>
      <main className="main">
        <div className="main-header">
          <div className="product-customer-header-content">
            <IoChevronBackOutline size={25} onClick={() => navigate(-1)} />
            <h3>{category.name}</h3>
          </div>
        </div>

        <div className="product-customer-product-grid">
          {category.products && category.products.length > 0 ? (
            category.products.map((product, index) => (
              <div
                key={index}
                className="product-card"
                onClick={() =>
                  navigate("/customer/product-detail", { state: { product } })
                }
              >
                <img src={product.img} alt={product.name} />
                <div className="product-info">
                  <p className="name">{product.name}</p>
                  <p className="name">{product.unit_id.description}</p>
                  <p className="price">
                    {product.promotions &&
                    product.promotions.some(
                      (promo) => promo.type === "amount"
                    ) ? (
                      <>
                        <span className="promotion-price">
                          {formatCurrency(
                            product.price -
                              product.promotions.find(
                                (promo) => promo.type === "amount"
                              ).amount_donate
                          )}
                        </span>
                        <br />
                        <span className="original-price">
                          {formatCurrency(product.price)}
                        </span>
                      </>
                    ) : product.promotions && product.promotions.some(promo => promo.type === 'quantity') ? (
                        <>
                            <span className="promotion-price">
                                {formatCurrency(product.price)}
                            </span>
                        </>
                    ) : (
                        <span className="normal-price">
                            {formatCurrency(product.price)}
                        </span>
                    )}
                  </p>
                  {product.promotions && (
    <p className="promotion-description">
        {product.promotions[0]?.description}
    </p>
)}


                  <button
                    className="cart-button"
                    onClick={(event) => {
                      event.stopPropagation(); // Ngăn sự kiện onClick của thẻ cha
                      if (
                        product.unit_convert &&
                        product.unit_convert.length > 1
                      ) {
                        openUnitModal(product);
                      } else {
                        handleAddCart(product);
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
            product={selectedProductUnits}
          />
        </div>
      </main>
    </div>
  );
}
