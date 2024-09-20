import './App.scss';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Frame from './containers/frame/Frame.js';
import Frame_Staff from './containers/frame_Staff/Frame_Staff.js';
import Login from './pages/login/Login.js';
import Payment from './pages/payment/Payment.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/frame" element={<Frame />} />
        <Route path="/frame-staff" element={<Frame_Staff/>} />
        <Route path="*" element={<Navigate to="/login"/>} />
        <Route path="/frame-staff/payment" element={<Payment/>} />
      </Routes>
    </Router>
  );
}

export default App;
