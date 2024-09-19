
import './Frame_Staff.scss';

import Sales from '../../pages/sales/Sales';
import Header from '../header_sales/Header';
import Promotion from '../../pages/promotion/Promotion';

export default function Frame_Staff() {
    const infoHeader = {
        "supermarketName" :"CapySmart",
        "employeeName" :"Nguyễn Văn Hoàng",
        "employeeId" :"12345",
        "address" : "12 Nguyễn Văn Bảo, phường 4, quận Gò Vấp, Thành phố HCM"
    
      }
   
    return (
        <div className='frame-container'>
                <div className='header'> <Header supermarketName={infoHeader.supermarketName} address={infoHeader.address} employeeName={infoHeader.employeeName} /></div>
                <main className='main-content'>
                    <div className='sales' >  <Sales/></div>
                    <div className='promotion'>  <Promotion/></div>
                </main>
                
            
        </div>
    );
}
