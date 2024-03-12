import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Popconfirm,
  Popover,
  Row,
  Spin,
  Table,
  Tooltip,
  TreeSelect,
  message,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { store } from "../../../redux/configStore";
import {
  deleteStaff,
  editStaff,
  getListStaff,
  getListStaffHistory,
} from "../../../api/staff/staff";
import { useSelector } from "react-redux";
import FormAddEmployee from "./FormAddEmployee";
import EditableStaff from "./EditTableStaff";
import { getListStoreAll } from "../../../api/storeManger/store";
import { transformData } from "../../../utils/recursive";
import formatDateTime from "../../../utils/dateTime";

export default function EmployeeManager() {
  const [form] = Form.useForm();
  const { listStaff, isLoadingStaff } = useSelector(
    (state) => state.persistedReducer.employeeManager
  );
  const { allListStore, isLoadStoreAll } = useSelector(
    (state) => state.persistedReducer.storeManager
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSizeChange = useCallback((current, size) => {
    setPageSize(size);
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
      await store.dispatch(getListStaff({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const dataNew = listStaff?.data.map((items, index) => {
      return {
        key: index,
        id: items.id,
        full_name: items.full_name,
        phone: items.phone,
        email: items.email,
        type: items.user.info.type,
        gender: items.gender,
        birth_day: items.birth_day,
        branchs: items.branch,
        branch: items.branch?.name,
      };
    });
    setData(dataNew);
  }, [listStaff]);
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
        const response = await store.dispatch(editStaff(newData[index]));
        if (editStaff.fulfilled.match(response)) {
          message.success("Sửa nhân viên thành công");
          await store.dispatch(getListStaff({ currentPage, pageSize }));
        } else if (editStaff.rejected.match(response)) {
          if (response.payload.message === "Không có quyền truy cập.") {
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
  const handleDelete = async (record) => {
    try {
      const response = await store.dispatch(deleteStaff(record.id));
      if (deleteStaff.fulfilled.match(response)) {
        message.success("Xóa nhân viên thành công");
        await store.dispatch(getListStaff({ currentPage, pageSize }));
      } else if (deleteStaff.rejected.match(response)) {
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
      // Xử lý lỗi trong quá trình xóa
      message.error("Có lỗi xảy ra");
    }
  };
  const [popoverStates, setPopoverStates] = useState({});
  const [loading, setLoading] = useState({});
  const handleHistory = async (id) => {
    setLoading((preLoading) => ({
      ...preLoading,
      [id]: true,
    }));
    try {
      const response = await store.dispatch(getListStaffHistory(id));
      console.log(response.payload.data.length === 0);
      setLoading((preLoading) => ({
        ...preLoading,
        [id]: false,
      }));
      setPopoverStates((prev) => ({
        ...prev,
        [id]: {
          visible: true,
          content: (
            <>
              {response.payload.data.length === 0 ? (
                <p style={{ color: "#ff4d4f", fontWeight: 500 }}>
                  Nhân viên chưa từng chuyển cửa hàng
                </p>
              ) : (
                response.payload.data?.map((item, index) => {
                  const startTime = formatDateTime(item.created_at);
                  const endTime = formatDateTime(item.updated_at);
                  return (
                    <p
                      style={{ color: "#ff4d4f", fontWeight: 500 }}
                      key={index}
                    >
                      {item.branch.name} ({startTime} đến {endTime})
                    </p>
                  );
                })
              )}
            </>
          ),
        },
      }));
    } catch (error) {
      setLoading((preLoading) => ({
        ...preLoading,
        [id]: false,
      }));
    }
  };
  const handlePopoverClose = (id) => {
    // Đóng popover của ID tương ứng
    setPopoverStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        visible: false,
      },
    }));
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      editable: true,
      // width: "20%",
      align: "center",
      render: (_, record) => {
        const popoverState = popoverStates[record.id] || {
          visible: false,
          content: null,
        };

        return (
          <Popover
            content={popoverState.content}
            title="Đã từng làm tại cửa hàng"
            trigger="click"
            visible={popoverState.visible}
            onVisibleChange={(visible) => {
              if (!visible) {
                handlePopoverClose(record.id);
              }
            }}
          >
            <Button
              onClick={() => {
                handleHistory(record.id);
              }}
              type="dashed"
            >
              {loading[record.id] ? (
                <Spin>
                  <div className="content" />
                </Spin>
              ) : (
                record.full_name
              )}
            </Button>
          </Popover>
        );
      },
    },
    {
      title: "Chức vụ",
      dataIndex: "type",
      render: (_, record) => {
        const checktype =
          record.type === "BRANCH_MANAGER"
            ? "Quản lý"
            : record.type === "STAFF"
            ? "Nhân viên"
            : "Không xác định";
        return checktype;
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      editable: true,
    },
    {
      title: "Ngày sinh",
      dataIndex: "birth_day",
      editable: true,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      editable: true,
      render: (_, record) => {
        const checkGender =
          record.gender === "MALE"
            ? "Nam"
            : record.gender === "FEMALE"
            ? "Nữ"
            : record.gender === "OTHER"
            ? "Khác"
            : "";
        return checkGender;
      },
    },
    {
      title: "Làm tại cửa hàng",
      dataIndex: "branch",
      editable: true,
      width: "20%",
    },
    {
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <Flex align="center" justify="space-evenly">
            {editable ? (
              <>
                <Button
                  type="primary"
                  onClick={() => save(record.id)}
                  style={{ marginRight: 8 }}
                  // loading={}
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
                <Tooltip placement="top" title="Sửa nhân viên">
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
                <Tooltip placement="leftTop" title="Xóa nhân viên">
                  <Popconfirm
                    placement="leftTop"
                    title="Bạn có chắc chắn?"
                    onConfirm={() => handleDelete(record)}
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

  const dataTree = transformData(allListStore?.data);
  const options = dataTree?.filter((item) => item.parent_id === 0);
  const handleSearch = async (value) => {
    await store.dispatch(getListStaff({ currentPage, pageSize, value }));
  };
  return (
    <div>
      <h2>Quản lý nhân viên</h2>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/employee-manager">Nhân viên</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>
      <FormAddEmployee
        isModalOpen={isModalOpen}
        currentPage={currentPage}
        pageSize={pageSize}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
      <Divider />
      <Row style={{ marginBottom: 20 }} gutter={[8, 8]}>
        <Col xl lg md sm>
          <TreeSelect
            style={{ width: 300 }}
            disabled={isLoadStoreAll}
            placeholder="Tìm kiếm theo cửa hàng"
            showSearch
            allowClear
            filterTreeNode={(inputValue, treeNode) => {
              return treeNode.title
                .toLowerCase()
                .includes(inputValue.toLowerCase());
            }}
            onChange={handleSearch}
            treeLine
            treeData={options}
          />
        </Col>
      </Row>
      <Form form={form} component={false}>
        <Table
          dataSource={data}
          columns={mergedColumns}
          components={{
            body: {
              cell: (cellProps) => (
                <EditableStaff
                  {...cellProps}
                  isLoadStoreAll={isLoadStoreAll}
                  branchs={options}
                />
              ),
            },
          }}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listStaff?.total,
            current: currentPage,
            onChange: handlePageChange,
          }}
          loading={isLoadingStaff}
          bordered
          scroll={{ x: "500px" }}
        />
      </Form>
    </div>
  );
}
