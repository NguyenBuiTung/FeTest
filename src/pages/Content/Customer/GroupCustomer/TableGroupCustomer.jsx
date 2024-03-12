import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Divider,
  Flex,
  Form,
  Popconfirm,
  Table,
  Tooltip,
  message,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import FormAddGroupCustomer from "./FormAddGroupCustomer";
import { getListCustomerAll } from "../../../../api/customer/customer";
import { store } from "../../../../redux/configStore";
import {
  deleteGroupCustomer,
  getListGroupCustomer,
  getListGroupCustomerALl,
} from "../../../../api/customer/groupCustomer/groupCustomer";
import EditGroupCustomer from "./EditGroupCustomer";

export default function TableGroupCustomer() {
  const [form] = Form.useForm();
  const { listGroupCustomer, isLoadingGroupCustomer } = useSelector(
    (state) => state.persistedReducer.groupCustomer
  );
  const [tableSettings, setTableSettings] = useState({
    currentPage: 1,
    pageSize: 10,
    isModalOpen: false,
  });
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { currentPage, pageSize, isModalOpen } = tableSettings;
  const showModalEdit = (record) => {
    setIsModalOpenEdit(true);
    setSelectedRecord(record);
  };
  const handleOkeEdit = () => {
    setIsModalOpenEdit(false);
  };
  const handleCancelEdit = () => {
    setIsModalOpenEdit(false);
  };
  const showModal = useCallback(() => {
    setTableSettings((prevSettings) => ({
      ...prevSettings,
      isModalOpen: true,
    }));
  }, []);

  const handleCancel = useCallback(() => {
    setTableSettings((prevSettings) => ({
      ...prevSettings,
      isModalOpen: false,
    }));
  }, []);

  const handleSizeChange = useCallback((current, size) => {
    setTableSettings((prevSettings) => ({ ...prevSettings, pageSize: size }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setTableSettings((prevSettings) => ({
      ...prevSettings,
      currentPage: page,
    }));
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      store.dispatch(getListCustomerAll());
    };
    fetchData();
  }, []);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListGroupCustomer({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListGroupCustomerALl());
    };
    fetchData();
  }, [data]);
  useEffect(() => {
    const dataNew = listGroupCustomer?.data.map((items, index) => {
      return {
        key: index + 1,
        id: items.id,
        name: items.name,
        branch_id: items.branch_id,
        customer: items?.customers[0]?.name,
        customers: items?.customers,
      };
    });
    setData(dataNew);
  }, [listGroupCustomer]);
  const handleDelete = async (id) => {
    try {
      const response = await store.dispatch(deleteGroupCustomer(id));
      if (deleteGroupCustomer.fulfilled.match(response)) {
        message.success(`Xóa thành công`);
        handlePageChange();
      } else if (deleteGroupCustomer.rejected.match(response)) {
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
      title: "STT",
      dataIndex: "key",
    },
    {
      title: "Nhóm khách hàng",
      dataIndex: "name",
      editable: true,
    },
    Table.EXPAND_COLUMN,
    {
      title: "Khách hàng",
      dataIndex: "customer",
      editable: true,
    },
    {
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <Tooltip placement="top" title="Sửa nhóm khách hàng">
              <span
                style={{
                  fontSize: 20,
                  cursor: "pointer",
                }}
                onClick={() => {
                  showModalEdit(record);
                }}
              >
                <EditOutlined />
              </span>
            </Tooltip>
            <EditGroupCustomer
              record={selectedRecord}
              isModalOpenEdit={isModalOpenEdit}
              currentPage={currentPage}
              pageSize={pageSize}
              handleOkeEdit={handleOkeEdit}
              handleCancelEdit={handleCancelEdit}
            />
            <Tooltip placement="leftTop" title="Xóa nhóm khách hàng">
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
      <h2>Nhóm Khách hàng</h2>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Khách hàng</Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/customer-group">Nhóm khách hàng</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>
      <FormAddGroupCustomer
        isModalOpen={isModalOpen}
        currentPage={currentPage}
        pageSize={pageSize}
        handleCancel={handleCancel}
      />
      <Divider />
      <Form form={form} component={false}>
        <Table
          dataSource={data}
          columns={columns}
          expandable={{
            expandedRowRender: (record) => {
              const columns = [
                {
                  title: "ID",
                  dataIndex: "id",
                  align: "center",
                },
                {
                  title: "Tên khách hàng",
                  dataIndex: "name",
                  align: "center",
                },
                {
                  title: "Số điện thoại",
                  dataIndex: "phone",
                  align: "center",
                },
                {
                  title: "Email",
                  dataIndex: "email",
                  align: "center",
                },
                {
                  title: "Ngày sinh",
                  dataIndex: "birthday",
                  align: "center",
                },
                {
                  title: "Giới tính",
                  dataIndex: "checkGender",
                  align: "center",
                },
                {
                  title: "Địa chỉ chi tiết",
                  dataIndex: "address_info",
                  align: "center",
                },
              ];
              const data = record.customers.map((item, index) => {
                const checkGender =
                  item.gender === "MALE"
                    ? "Nam"
                    : item.gender === "FEMALE"
                    ? "Nữ"
                    : item.gender === "OTHER"
                    ? "Khác"
                    : "";
                return {
                  id: item.id,
                  name: item.name,
                  birthday: item.birthday,
                  checkGender: checkGender,
                  phone: item.phone,
                  email: item.email,
                  address_info: item.address_info,
                };
              });
              return (
                <Table
                  columns={columns}
                  dataSource={data}
                  size="small"
                  pagination={false}
                  bordered
                />
              );
            },
          }}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listGroupCustomer?.total,
            current: currentPage,
            onChange: handlePageChange,
          }}
          loading={isLoadingGroupCustomer}
          bordered
          scroll={{ x: "500px" }}
        />
      </Form>
    </div>
  );
}
