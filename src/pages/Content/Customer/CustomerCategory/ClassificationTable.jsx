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
import { store } from "../../../../redux/configStore";
import EditableCell from "../../Mcoupon/EditCellTable";
import FormAddCustomerType from "./FormAddCustomerType";
import {
  deleteCustomerType,
  editCustomerType,
  getListCustomerType,
  getListCustomerTypeAll,
} from "../../../../api/customer/customertype/listCustomerType";
import { useSelector } from "react-redux";
import { getListStoreAll } from "../../../../api/storeManger/store";

export default function ClassificationTable() {
  const [form] = Form.useForm();
  const { listCustomerType, isLoading } = useSelector(
    (state) => state.persistedReducer.customerType
  );
  const [tableSettings, setTableSettings] = useState({
    currentPage: 1,
    pageSize: 10,
    isModalOpen: false,
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
      await store.dispatch(getListCustomerType({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListCustomerTypeAll());
    };
    fetchData();
  }, [data]);
  useEffect(() => {
    const dataNew = listCustomerType?.data.map((items, index) => {
      return {
        key: index,
        id: items.id,
        name: items.name,
        description: items.description,
      };
    });
    setData(dataNew);
  }, [listCustomerType]);
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
        const response = await store.dispatch(editCustomerType(newData[index]));
        if (response.payload.message === "success") {
          setData(newData);
          message.success(`Sửa thành công`);
        } else {
          message.error("Có lỗi xảy ra ");
        }
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
      const response = await store.dispatch(deleteCustomerType(id));
      if (response.payload.success === true) {
        await store.dispatch(getListCustomerType({ currentPage, pageSize }));
        handlePageChange();
        message.success(`Xóa thành công`);
      } else {
        message.error("Có lỗi xảy ra ");
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
      title: "Loại khách hàng",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      editable: true,
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
  return (
    <div>
      <h2>Khách hàng</h2>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Khách hàng</Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/customertype">Phân loại khách hàng</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>
      <FormAddCustomerType
        isModalOpen={isModalOpen}
        currentPage={currentPage}
        pageSize={pageSize}
        handleCancel={handleCancel}
      />
      <Divider />
      <Form form={form} component={false}>
        <Table
          dataSource={data}
          columns={mergedColumns}
          components={{
            body: {
              cell: (cellProps) => <EditableCell {...cellProps} />,
            },
          }}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listCustomerType?.total,
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
