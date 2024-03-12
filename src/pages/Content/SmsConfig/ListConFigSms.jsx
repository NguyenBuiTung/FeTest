import {
  Breadcrumb,
  Button,
  Divider,
  Flex,
  Form,
  Popconfirm,
  Switch,
  Table,
  Tooltip,
  message,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { store } from "../../../redux/configStore";
import { useSelector } from "react-redux";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";

import { NavLink } from "react-router-dom";
import {
  deleteConfigSms,
  getInfoConfig,
  updateStatusSms,
} from "../../../api/ConfigSms/smsConfig";
import formatDateTime from "../../../utils/dateTime";
import Config from "./Config";

export default function ListConFigSms() {
  const [form] = Form.useForm();
  const { listConfig, isLoadConfig } = useSelector(
    (state) => state.persistedReducer.sms
  );
  const { user } = useSelector((state) => state.persistedReducer.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Sử dụng state để lưu giá trị pageSize
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const handleSizeChange = useCallback(
    (current, size) => {
      setPageSize(size);
    },
    [setPageSize]
  );
  useEffect(() => {
    const fetchData = async () => {
      // await store.dispatch(getListCustomerTypeAll());
    };
    fetchData();
  }, []);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getInfoConfig({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const fetchData = async () => {
      // await store.dispatch(getLsPrCouponAll());
    };
    fetchData();
  }, [data]);
  useEffect(() => {
    const dataNew = listConfig?.data.map((items, index) => {
      const formattedDateTime = formatDateTime(items.created_at);
      return {
        key: index,
        id: items.id,
        branch: items.branch.name,
        branchname: items.branchname,
        username: items.username,
        created_at: formattedDateTime,
        is_active: items.is_active,
      };
    });
    setData(dataNew);
  }, [listConfig]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const onChangeSwitch = async (checked, record) => {
    try {
      const data = { id: record.id, is_active: checked };
      await store.dispatch(updateStatusSms(data));
      await store.dispatch(getInfoConfig({ currentPage, pageSize }));
      message.success("Thay đổi trạng thái thành công");
    } catch (error) {
      message.error("Đã xảy ra lỗi khi thay đổi trạng thái");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await store.dispatch(deleteConfigSms(id));
      if (deleteConfigSms.fulfilled.match(response)) {
        message.success(`Xóa thành công`);
        await store.dispatch(getInfoConfig({ currentPage, pageSize }));
      } else if (deleteConfigSms.rejected.match(response)) {
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
        } else if (response.payload.message) {
          message.error(response.payload.message);
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      render: (_, record) => (
        <Popconfirm
          title={`Chọn tài khoản nhắn tin?`}
          onConfirm={() => onChangeSwitch(!record.is_active, record)}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <Switch
            disabled={
              user?.data.type === "STAFF" ||
              user?.data.type === "BRANCH_MANAGER"
            }
            checked={record.is_active}
          />
        </Popconfirm>
      ),
    },
    {
      title: "Cửa hàng",
      dataIndex: "branch",
      editable: true,
    },
    {
      title: "Tên cửa hàng",
      dataIndex: "branchname",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
      editable: true,
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      editable: true,
    },
    {
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <Tooltip placement="leftTop" title="Xóa cấu hình">
              <Popconfirm
                placement="leftTop"
                title="Bạn có chắc chắn?"
                onConfirm={() => handleDelete(record.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <DeleteOutlined style={{ color: "#f5222d", fontSize: 20 }} />
              </Popconfirm>
            </Tooltip>
          </Flex>
        );
      },
    },
  ];
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Cài đặt</Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/sms-configuration">Danh sách tài khoản sms</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm tài khoản
      </Button>
      <Config
        isModalOpen={isModalOpen}
        currentPage={currentPage}
        pageSize={pageSize}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
      <Divider />
      <Form form={form} component={false}>
        <Table
          dataSource={data}
          columns={columns}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listConfig?.total,
            current: currentPage,
            onChange: handlePageChange,
          }}
          loading={isLoadConfig}
          bordered
          scroll={{ x: "500px" }}
        />
      </Form>
    </div>
  );
}
