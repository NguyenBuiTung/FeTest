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
  QRCode,
  Row,
  Table,
  Tooltip,
  message,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { store } from "../../../redux/configStore";
import {
  deleteCustomer,
  deleteCustomers,
  getListCustomer,
  getListCustomerAll,
} from "../../../api/customer/customer";
import { useSelector } from "react-redux";
import FormAddCustomer from "./FormAddCustomer";
import formatDateTime from "../../../utils/dateTime";
import EditCustomer from "./EditCustomer";
import { getListStoreAll } from "../../../api/storeManger/store";
import { getListRankAll } from "../../../api/customer/rankcustomer/rankcustomer";


export default function TableCustomer() {
  const { listCustomer, isLoadCustomer } = useSelector(
    (state) => state.persistedReducer.customer
  );
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });
  const { currentPage, pageSize } = pagination;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState();
  const [selectedRecord, setSelectedRecord] = useState(null);
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
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  };
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        store.dispatch(getListRankAll()),
        store.dispatch(getListStoreAll()),
      ]);
    };
    fetchData();
  }, []);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListCustomer({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListCustomerAll());
    };
    fetchData();
  }, [data]);
  useEffect(() => {
    const dataNew = listCustomer?.data.map((items, index) => {
      return {
        key: index,
        id: items.id,
        name: items.name,
        phone: items.phone,
        email: items.email,
        gender: items.gender,
        birthday: items.birthday,
        // customertype_id: items.customertype_id,
        customer_category: items?.customer_category?.name,
        stores: items.stores,
        address: items.address,
        address_info: items.address_info,
        created_at: items.created_at,
      };
    });
    setData(dataNew);
  }, [listCustomer]);
  const handlePageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);
  const handleSizeChange = useCallback((current, size) => {
    setPagination({ currentPage: 1, pageSize: size });
  }, []);
  const handleDelete = async (record) => {
    try {
      const newData = [...data];
      const index = newData.findIndex((item) => item.id === record.id);
      if (index > -1) {
        newData.splice(index, 1);
        const response = await store.dispatch(deleteCustomer(record.id));
        if (deleteCustomer.fulfilled.match(response)) {
          message.success(`Xóa thành công`);
          handlePageChange();
        } else if (deleteCustomer.rejected.match(response)) {
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
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };
  const handleDeletes = async () => {
    const codes = selectedRows.map((item) => item.id);
    setIsLoadingDelete(true);
    try {
      const response = await store.dispatch(
        deleteCustomers({
          customer_ids: codes,
        })
      );
      if (deleteCustomers.fulfilled.match(response)) {
        message.success(`Xóa thành công`);
        setIsLoadingDelete(false);
        setSelectedRowKeys([]);
        setSelectedRows([]);
        handlePageChange();
      } else if (deleteCustomers.rejected.match(response)) {
        if (response.payload.errors) {
          setIsLoadingDelete(false);
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
        }
      }
      if (response.payload.message) {
        setIsLoadingDelete(false);
        message.error(response.payload.message);
      }
    } catch (error) {
      setIsLoadingDelete(false);
      message.error("Có lỗi xảy ra");
    }
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    Table.EXPAND_COLUMN,
    {
      title: "Khách hàng",
      dataIndex: "name",
    },
    {
      title: "Mã QR",
      dataIndex: "qrcode",
      render:(_,record)=>(
        <QRCode size={70} type="svg" value={record.id+" "+ record.name +" "+ record.phone} />
      )
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <Tooltip placement="top" title="Sửa thông tin khách hàng">
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
            <EditCustomer
              record={selectedRecord}
              isModalOpenEdit={isModalOpenEdit}
              currentPage={currentPage}
              pageSize={pageSize}
              handleOkeEdit={handleOkeEdit}
              handleCancelEdit={handleCancelEdit}
            />
            <Tooltip placement="leftTop" title="Xóa khách hàng">
              <Popconfirm
                placement="leftTop"
                title="Bạn có chắc chắn?"
                onConfirm={() => handleDelete(record)}
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
  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onChange: onSelectChange,
  };
  const hasSelected =
    selectedRowKeys.length === 10 ||
    (selectedRowKeys.length < 10 && selectedRowKeys.length > 0);
  return (
    <div>
      <h2>Quản lý khách hàng</h2>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/customer">Khách hàng</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <Button
            type="primary"
            onClick={showModal}
            icon={<PlusCircleOutlined />}
          >
            Thêm mới
          </Button>
          <FormAddCustomer
            isModalOpen={isModalOpen}
            currentPage={currentPage}
            pageSize={pageSize}
            handleOk={handleOk}
            handleCancel={handleCancel}
          />
        </Col>
        <Col xl lg md sm>
          <Button
            type="primary"
            onClick={() => {
              handleDeletes();
            }}
            danger
            loading={isLoadingDelete}
            icon={<DeleteOutlined />}
            disabled={!hasSelected}
          >
            Xóa khách hàng
          </Button>
        </Col>
      </Row>
      <Divider />
      <Form form={form} component={false}>
        <Table
          dataSource={data}
          columns={columns}
          rowSelection={{
            ...rowSelection,
          }}
          expandable={{
            expandedRowRender: (record) => {
              const columns = [
                {
                  title: "Ngày sinh",
                  dataIndex: "birthday",
                  align: "center",
                },
                {
                  title: "Giới tính",
                  dataIndex: "gender",
                  align: "center",
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
                  title: "Email",
                  dataIndex: "email",
                  align: "center",
                },
                {
                  title: "Địa chỉ",
                  dataIndex: "address",
                  align: "center",
                },
                {
                  title: "Địa chỉ chi tiết",
                  dataIndex: "address_info",
                  align: "center",
                },
                {
                  title: "Ngày tạo",
                  dataIndex: "created_at",
                  align: "center",
                },
              ];
              const formattedDateTime = formatDateTime(record.created_at);
              const data = [
                {
                  birthday: record.birthday,
                  gender: record.gender,
                  orther_info: record.orther_info,
                  email: record.email,
                  address: `${record.address.province.name}/${record.address.district.name}/${record.address.ward.name}`,
                  address_info: record.address_info,
                  created_at: formattedDateTime,
                },
              ];
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
            total: listCustomer?.total,
            current: currentPage,
            onChange: handlePageChange,
          }}
          loading={isLoadCustomer}
          bordered
          scroll={{ x: "500px" }}
        />
      </Form>
    </div>
  );
}
