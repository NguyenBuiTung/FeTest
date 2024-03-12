import { EyeOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React, { useState } from 'react'

export default function ModalView({record}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div>
        
      <EyeOutlined onClick={showModal} style={{ color: "#f5222d", fontSize: 20,cursor:"pointer" }} />
      <Modal title="Chi tiết bài xem" open={isModalOpen} footer={null} onOk={handleOk} onCancel={handleCancel}>
        <p>id:{record.id}</p>
        <p>UserId:{record.userId}</p>
        <p>title:{record.title}</p>
      </Modal>
    </div>
  )
}
