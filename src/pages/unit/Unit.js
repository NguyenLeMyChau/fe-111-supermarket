import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { CiEdit } from 'react-icons/ci';
import Modal from '../../components/modal/Modal';
import Input from '../../components/input/Input';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { addUnit, updateUnit } from '../../services/unitRequest';
import Button from '../../components/button/Button';
import ClipLoader from 'react-spinners/ClipLoader';
import { useNavigate } from 'react-router';

export default function Unit() {
    const units = useSelector((state) => state.unit?.units) || [];
    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();
    const navigate = useNavigate();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);

    const [isOpenNewUnit, setIsOpenNewUnit] = useState(false);
    const [unit, setUnit] = useState({ description: '' });
    const [loading, setLoading] = useState(false);

    const handleEditClick = (event, unit) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click của hàng bảng
        setSelectedUnit(unit);
        console.log('unit', unit);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUnit(null);
    };

    const unitColumn = [
        { title: 'Đơn vị tính', dataIndex: 'description', key: 'description', width: '50%' },
        {
            title: 'Chỉnh sửa',
            key: 'edit',
            width: '10%',
            className: 'text-center',
            render: (text, record) => (
                <CiEdit
                    style={{ color: 'blue', cursor: 'pointer' }}
                    size={25}
                    onClick={(event) => handleEditClick(event, record)}
                />
            ),
        },
    ];

    const handleAddUnit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await addUnit(unit, accessToken, axiosJWT);
            if (response) {
                setUnit({ description: '' });
            }
        } catch (error) {
            console.error('Failed to add category:', error);
            alert('Có lỗi xảy ra khi thêm nhà cung cấp.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUnit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Call API to update user data
        await updateUnit(selectedUnit._id, selectedUnit, accessToken, axiosJWT, navigate);
        setLoading(false);
    };


    return (
        <div>
            <FrameData
                title="Đơn vị tính"
                buttonText="Thêm đơn vị tính"
                data={units}
                columns={unitColumn}
                onButtonClick={() => setIsOpenNewUnit(true)}
            />

            {isOpenNewUnit && (
                <Modal
                    title="Thêm đơn vị tính"
                    isOpen={isOpenNewUnit}
                    onClose={() => setIsOpenNewUnit(false)}
                    width={'30%'}
                >

                    <div className='flex-column-center'>

                        <form onSubmit={handleAddUnit}>
                            <Input
                                label='Đơn vị tính'
                                placeholder='Nhập đơn vị tính'
                                name='name'
                                value={unit.description}
                                onChange={e => setUnit({ description: e.target.value })}
                            />

                            <div className='flex-row-center' style={{ position: 'sticky', bottom: 0 }}>
                                {loading ? (
                                    <ClipLoader size={30} color="#2392D0" loading={loading} />
                                ) : (
                                    <div className='login-button' style={{ width: 200 }}>
                                        <Button type='submit' text='Thêm đơn vị tính' />
                                    </div>
                                )}
                            </div>
                        </form>

                    </div>
                </Modal>
            )}

            {isEditModalOpen && (
                <Modal
                    title='Cập nhật đơn vị tính'
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    width={'30%'}
                >
                    <div className='flex-column-center'>

                        <form onSubmit={handleUpdateUnit}>

                            <Input
                                label='Đơn vị tính'
                                name='unit'
                                placeholder='Nhập đơn vị tính'
                                value={selectedUnit.description}
                                onChange={(e) => setSelectedUnit({ ...selectedUnit, description: e.target.value })}
                            />

                            <div className='flex-row-center' style={{ position: 'sticky', bottom: 0 }}>
                                {loading ? (
                                    <ClipLoader size={30} color="#2392D0" loading={loading} />
                                ) : (
                                    <div className='login-button' style={{ width: 200 }}>
                                        <Button type='submit' text='Cập nhật đơn vị tính' />
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </div>
    );
}
