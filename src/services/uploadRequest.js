import axios from "axios";

const uploadImageVideo = async (file) => {
    const formData = new FormData();
    formData.append('image', file); // Tên field phải khớp với 'image' trong Multer
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload/upload-img-video`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Upload image success:', response.data);
        return response.data;
    } catch (error) {
        console.error('Upload image failed:', error);
    }
}

export { uploadImageVideo };