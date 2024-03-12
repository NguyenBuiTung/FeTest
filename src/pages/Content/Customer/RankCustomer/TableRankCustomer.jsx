import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Divider,
  Flex,
  Form,
  Popconfirm,
  Select,
  Table,
  Tooltip,
  message,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { store } from "../../../../redux/configStore";
import { useSelector } from "react-redux";
import { getListStoreAll } from "../../../../api/storeManger/store";
import FormAddRankCustomer from "./FormAddRankCustomer";
import {
  deleteRankCustomer,
  editRank,
  getListRank,
  getListRankAll,
} from "../../../../api/customer/rankcustomer/rankcustomer";
import EditTableRank from "./EditTableRank";
export default function TableRankCustomer() {
  const [form] = Form.useForm();
  const { listRank, isLoading } = useSelector(
    (state) => state.persistedReducer.rankCustomer
  );
  const { allListStore, isLoadStoreAll } = useSelector(
    (state) => state.persistedReducer.storeManager
  );
  const [tableSettings, setTableSettings] = useState({
    currentPage: 1,
    pageSize: 10,
    isModalOpen: false,
  });
  const branch = allListStore?.data
    .filter((item) => item.parent_id === 0)
    .map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
  const { currentPage, pageSize, isModalOpen } = tableSettings;
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
      await store.dispatch(getListStoreAll());
    };
    fetchData();
  }, []);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListRank({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListRankAll());
    };
    fetchData();
  }, [data]);
  useEffect(() => {
    const dataNew = listRank?.data.map((items, index) => {
      return {
        key: index,
        id: items.id,
        name: items.name,
        purchase_amount: items.purchase_amount,
        avatar: items.avatar,
        branchs: items.branch,
        branch: items.branch.name,
        totalCustomer: items.customer_branches.length,
      };
    });
    setData(dataNew);
  }, [listRank]);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        // console.log(newData[index]);
        const response = await store.dispatch(editRank(newData[index]));
        if (editRank.fulfilled.match(response)) {
          message.success("Sửa thành công");
          await store.dispatch(getListRank({ currentPage, pageSize }));
        } else if (editRank.rejected.match(response)) {
          if (response.payload.message) {
            message.error(response.payload.message);
          }
          if (response.payload.errors) {
            Object.keys(response.payload.errors).forEach((field) => {
              const errorMessages = response.payload.errors[field];
              errorMessages.forEach((errorMessage) => {
                message.error(`${errorMessage}`);
              });
            });
          }
        }
        // console.log(response.payload)

        setEditingKey("");
      } else {
        setEditingKey("");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra ");
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await store.dispatch(deleteRankCustomer(id));
      if (deleteRankCustomer.fulfilled.match(response)) {
        message.success("Xóa hạng thành viên thành công");
        await store.dispatch(getListRank({ currentPage, pageSize }));
        handlePageChange();
      } else if (deleteRankCustomer.rejected.match(response)) {
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
        }
      }
      if (response.payload.message) {
        message.error(response.payload.message);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };
  const columns = [
    {
      title: "Hạng thành viên",
      dataIndex: "name",
      render: (text, record) => {
        const userAvatar = record?.avatar
          ? `${process.env.REACT_APP_API_URL}/${record.avatar}`
          : null;
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              style={{ cursor: "pointer", marginRight: "12px" }}
              size={40}
              src={userAvatar}
              icon={record?.avatar ? null : <UserOutlined />}
            />
            <span>{text}</span>
          </div>
        );
      },
      editable: true,
    },
    {
      title: "Tổng chi tiêu",
      dataIndex: "purchase_amount",
      editable: true,
      render: (_, record) => record.purchase_amount.toLocaleString(),
      sorter: (a, b) => a.purchase_amount - b.purchase_amount,
    },
    {
      title: "Cửa hàng",
      dataIndex: "branch",
      editable: true,
    },
    {
      title: "Thành viên hiện có",
      dataIndex: "totalCustomer",
    },
    {
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <Flex align="center" justify="center" gap={10}>
            {editable ? (
              <>
                <Button
                  type="primary"
                  onClick={() => save(record.id)}
                  style={{ marginRight: 8 }}
                >
                  Lưu
                </Button>
                <Popconfirm
                  placement="leftTop"
                  title="Bạn có chắc chắn?"
                  onConfirm={cancel}
                >
                  <Button type="primary" danger>
                    Hủy
                  </Button>
                </Popconfirm>
              </>
            ) : (
              <>
                <Tooltip placement="top" title="Sửa loại khách hàng">
                  <span
                    style={{
                      fontSize: 20,
                      cursor: editingKey === "" ? "pointer" : "not-allowed",
                    }}
                    onClick={() => {
                      if (editingKey === "") {
                        edit(record);
                      }
                    }}
                  >
                    <EditOutlined />
                  </span>
                </Tooltip>
                <Tooltip placement="leftTop" title="Xóa loại khách hàng">
                  <Popconfirm
                    placement="leftTop"
                    title="Bạn có chắc chắn?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <DeleteOutlined
                      style={{ color: "#f5222d", fontSize: 20 }}
                    />
                  </Popconfirm>
                </Tooltip>
              </>
            )}
          </Flex>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const handleSearch = async (value) => {
    await store.dispatch(getListRank({ currentPage, pageSize, value }));
  };
  return (
    <div>
      <h2>Tạo hạng thành viên</h2>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Khách hàng</Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/rank-customer">Hạng thành viên</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>
      <FormAddRankCustomer
        isModalOpen={isModalOpen}
        currentPage={currentPage}
        pageSize={pageSize}
        handleCancel={handleCancel}
      />
      <Divider />
      <Select
        style={{ marginBottom: 24, width: 300 }}
        showSearch
        allowClear
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.label?.toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA, optionB) =>
          optionA?.label
            ?.toLowerCase()
            .localeCompare(optionB?.label?.toLowerCase())
        }
        disabled={isLoadStoreAll}
        onChange={handleSearch}
        placeholder="Lọc theo cửa hàng"
        options={branch}
      />
      <Form form={form} component={false}>
        <Table
          dataSource={data}
          columns={mergedColumns}
          components={{
            body: {
              cell: (cellProps) => (
                <EditTableRank branchs={branch} {...cellProps} />
              ),
            },
          }}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listRank?.total,
            current: currentPage,
            onChange: handlePageChange,
          }}
          loading={isLoading}
          bordered
          scroll={{ x: "500px" }}
        />
      </Form>
    </div>
  );
}
