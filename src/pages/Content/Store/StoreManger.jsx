import {
  Button,
  Divider,
  Flex,
  Form,
  Popconfirm,
  Table,
  Tooltip,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { store } from "../../../redux/configStore";
import { useSelector } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  deleteStore,
  getListStore,
  getListStoreAll,
} from "../../../api/storeManger/store";
import formatDateTime from "../../../utils/dateTime";
import FormAddStore from "./FormAddStore";
import EditStore from "./EditStore";

export default function StoreManger() {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.persistedReducer.user);
  const { listStore, isLoadStore } = useSelector(
    (state) => state.persistedReducer.storeManager
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Sử dụng state để lưu giá trị pageSize
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
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
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSizeChange = (current, size) => {
    setPageSize(size); // Cập nhật giá trị pageSize mới
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListStore({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListStoreAll());
    };
    fetchData();
  }, [data]);
  useEffect(() => {
    // Hàm đệ quy để tạo chuỗi địa chỉ từ cấu trúc dữ liệu cây
    const getAddress = (item) => {
      if (!item) return "";
      const { address } = item;
      const { province, district, ward } = address || {};
      if (!province || !district || !ward) return "";
      return `${province.name}/${district.name}/${ward.name}`;
    };
  
    const getCreator = (item) => {
      if (!item) return "";
      return item.owner
        ? `${item.owner.info.first_name} ${item.owner.info.last_name}`
        : "Chi nhánh";
    };
  
    // Hàm xử lý dữ liệu và render địa chỉ
    const renderAddresses = (listStoreData) => {
      if (!listStoreData) return [];
      return listStoreData.map((item) => {
        const formattedDateTime = formatDateTime(item.created_at);
        const owner = getCreator(item);
        const address = getAddress(item);
        let newData = {
          key: item.id,
          id: item.id,
          name: item.name,
          address: item.address,
          address_detail: item.address_detail,
          parent_id: item.parent_id,
          tax_code: item.tax_code,
          owner: owner,
          created_at: formattedDateTime,
          addRess: address,
          owNer: owner,
        };
        if (item.children && item.children.length > 0) {
          newData = {
            ...newData,
            children: renderAddresses(item.children),
          };
        }
        return newData;
      });
    };
  
    const newData = renderAddresses(
      listStore?.data.filter((item) => item.parent_id === 0)
    );
  
    setData(newData);
  }, [listStore?.data]);
  
  // console.log(data)
  const handleDelete = async (id) => {
    try {
      const response = await store.dispatch(deleteStore(id));
      if (deleteStore.fulfilled.match(response)) {
        message.success(`Xóa thành công`);
        await store.dispatch(getListStore({ currentPage, pageSize }));
      } else if (deleteStore.rejected.match(response)) {
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
      width: "10%",
      key: "id",
    },
    // Table.EXPAND_COLUMN,
    {
      title: "Tên cửa hàng",
      dataIndex: "name",
      editable: true,
      key: "name",
    },
    {
      title: "Địa chỉ",
      dataIndex: "addRess",
      editable: true,
    },
    {
      title: "Địa chỉ chi tiết",
      dataIndex: "address_detail",
      editable: true,
      key: "address_detail",
    },
    {
      title: "Mã số thuế",
      dataIndex: "tax_code",
      editable: true,
      key: "tax_code",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Chủ cửa hàng",
      dataIndex: "owNer",
      key: "owner",
    },
    {
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <Tooltip placement="top" title="Sửa nhân viên">
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
            <EditStore
              record={selectedRecord}
              isModalOpenEdit={isModalOpenEdit}
              currentPage={currentPage}
              pageSize={pageSize}
              handleOkeEdit={handleOkeEdit}
              handleCancelEdit={handleCancelEdit}
            />
            <Tooltip placement="leftTop" title="Xóa nhân viên">
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
      <Button
        type="primary"
        onClick={showModal}
        disabled={user?.data.type === "STAFF"}
        icon={<PlusCircleOutlined />}
      >
        Thêm mới
      </Button>
      <FormAddStore
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
            total: listStore?.total,
            current: currentPage,
            onChange: handlePageChange,
          }}
          loading={isLoadStore}
          bordered
          scroll={{ x: "500px" }}
        />
      </Form>
    </div>
  );
}
