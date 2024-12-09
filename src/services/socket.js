import { io } from "socket.io-client";


const SOCKET_URL = process.env.REACT_APP_API_URL; // Địa chỉ server
console.log(SOCKET_URL)
// Khởi tạo kết nối socket
const socket = io(SOCKET_URL, {
  autoConnect: false, // Chỉ kết nối khi cần thiết
});

// Hàm tiện ích để kết nối
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
    console.log("Socket connected");
  }
};

// Hàm tiện ích để ngắt kết nối
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
};

// Hàm tiện ích để lắng nghe sự kiện
export const onSocketEvent = (event, callback) => {
  socket.on(event, callback);
};

// Hàm tiện ích để gửi sự kiện
export const emitSocketEvent = (event, data) => {
  socket.emit(event, data);
};

// Xuất đối tượng socket nếu cần sử dụng trực tiếp
export default socket;
