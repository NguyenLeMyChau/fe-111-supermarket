import FooterCustomer from '../../components/footerCustomer/footerCustomer';
import HeaderCustomer from '../../components/headerCustomer/HeaderCustomer';
import './Home.scss';
import imgNen from '../../assets/img-nen.png';
import CategoryCustomer from './CategoryCustomer';

export default function Home() {

    return (
        <div className='home-customer-container'>
            <header>
                <HeaderCustomer />
            </header>

            <main>
                <img src={imgNen} alt="Background" className="background-image" />
                <CategoryCustomer />
            </main>

            <footer>
                <FooterCustomer />
            </footer>
        </div>
    );
}
