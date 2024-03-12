import { EyeOutlined } from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';
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
        
      <Tooltip placement='top' title="Xem chi tiết">
      <EyeOutlined onClick={showModal} style={{ color: "#4096ff", fontSize: 20,cursor:"pointer" }} />
      </Tooltip>
      <Modal title="Chi tiết bài xem" open={isModalOpen} footer={null} onOk={handleOk} onCancel={handleCancel}>
        <p>id:{record.id}</p>
        <p>UserId:{record.userId}</p>
        <p>title:{record.title}</p>
      </Modal>
    </div>
  )
}
