import './App.scss';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Frame from './containers/frame/Frame.js';
import Login from './pages/login/Login.js';
import Payment from './pages/payment/Payment.js';
import FrameStaff from './containers/frame_staff/FrameStaff.js';
import Stall from './containers/stall/Stall.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/frame" element={<Frame />} />
        <Route path="/frame-staff" element={<FrameStaff />} />
        <Route path="/frame-staff/stall" element={<Stall />} />
        <Route path="/frame-staff/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;
