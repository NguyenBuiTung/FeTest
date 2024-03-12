import {
  Badge,
  Breadcrumb,
  Button,
  Col,
  Divider,
  Empty,
  Flex,
  Form,
  Popconfirm,
  Row,
  Skeleton,
  Space,
  Switch,
  Table,
  Tooltip,
  message,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { store } from "../../../redux/configStore";
import { useSelector } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  HistoryOutlined,
  PlusCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import FormAdd from "./FormAdd";

import { NavLink, useNavigate } from "react-router-dom";
import {
  editPro,
  exportExcelMcoupon,
  getLsPrCoupon,
  getLsPrCouponAll,
} from "../../../api/mcoupon/listTable";
import { deletePro, deletePros } from "../../../api/mcoupon/deleteTable";
import EditMcoupon from "./EditMcoupon";
import { getListStoreAll } from "../../../api/storeManger/store";
import { calculateTimeDifference } from "../../../utils/dateTime";
import { getListGroupCustomerALl } from "../../../api/customer/groupCustomer/groupCustomer";

export default function TableMcoupon() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { dataTable, isLoading, isLoadingDelete } = useSelector(
    (state) => state.persistedReducer.getListProgramCoupon
  );
  const { user } = useSelector((state) => state.persistedReducer.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Sử dụng state để lưu giá trị pageSize
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
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
      await store.dispatch(getListGroupCustomerALl());
      await store.dispatch(getListStoreAll());
    };
    fetchData();
  }, []);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getLsPrCoupon({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getLsPrCouponAll());
    };
    fetchData();
  }, [data]);
  useEffect(() => {
    const dataNew = dataTable?.data.map((items, index) => {
      const currentDate = new Date();
      const endDate = items?.end_date;
      const formattedTimeDifference = calculateTimeDifference(
        currentDate,
        endDate
      );
      return {
        key: index,
        id: items.id,
        name: items?.name,
        type: items?.type,
        branch_id: items.branch_id,
        branch: items?.branch?.name,
        coupon_codes_count: items.coupon_codes_count,
        start_date: items.start_date,
        end_date: items.end_date,
        checkTime: formattedTimeDifference,
        is_active: items.is_active,
        creator:
          items?.creator.info?.first_name +
          " " +
          items?.creator.info?.last_name,
        customer_categories: items.customer_categories,
      };
    });
    setData(dataNew);
  }, [dataTable]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  };
  const onChangeSwitch = (checked, record) => {
    try {
      const dataIndex = data.findIndex((item) => item.key === record.key);
      if (dataIndex !== -1) {
        const updatedData = [...data];
        updatedData[dataIndex].is_active = checked;
        setData(updatedData);
        store.dispatch(editPro(updatedData[dataIndex]));
        message.success("Thay đổi trạng thái thành công");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi thay đổi trạng thái");
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await store.dispatch(deletePro(id));
      if (response.payload.success === true) {
        await store.dispatch(getLsPrCoupon({ currentPage, pageSize }));
        message.success(`Xóa thành công`);
      } else {
        message.error("Có lỗi xảy ra ");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };
  const handleDeletes = async () => {
    const codes = selectedRows.map((item) => item.id);
    try {
      const response = await store.dispatch(
        deletePros({
          campaign_ids: codes,
        })
      );
      if (response.payload.success === true) {
        await store.dispatch(getLsPrCoupon({ currentPage, pageSize }));
        setSelectedRowKeys([]);
        setSelectedRows([]);
        handlePageChange();
        message.success(`Xóa thành công`);
      } else {
        message.error("Có lỗi xảy ra ");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };
  const baseUrl = process.env.REACT_APP_API_URL;
  const handleExportExcel = async () => {
    try {
      await store.dispatch(exportExcelMcoupon());
      window.location.href = `${baseUrl}/mcoupon/api/v1/campaigns/export-excel`;
    } catch (error) {}
  };
  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onChange: onSelectChange,
  };
  const hasSelected =
    selectedRowKeys.length === 10 ||
    (selectedRowKeys.length < 10 && selectedRowKeys.length > 0);
  const columns = [
    {
      title: "Mã số",
      dataIndex: "id",
    },
    {
      title: "Chương trình",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "Loại chương trình",
      dataIndex: "type",
      render: (_, record) =>
        record.type === "GROUP_CUSTOMER"
          ? "Nhóm khách hàng"
          : record.type === "RANK_CUSTOMER"
          ? "Hạng thành viên"
          : record.type === "DIRECT"
          ? "Tặng trực tiếp"
          : "Tất cả khách hàng",
    },
    {
      title: "Người tạo",
      dataIndex: "creator",
    },
    {
      title: "Tổng mã",
      dataIndex: "coupon_codes_count",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      editable: true,
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      editable: true,
    },
    {
      title: "Cửa hàng",
      dataIndex: "branch",
      editable: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      render: (_, record) =>
        parseInt(record.checkTime) < 0 ? (
          <Badge status="error" text="Đã kết thúc" />
        ) : (
          <Popconfirm
            title={`Bạn có chắc chắn muốn thay đổi trạng thái?`}
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
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <Tooltip placement="top" title="Sửa chương trình">
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
            <EditMcoupon
              record={selectedRecord}
              isModalOpenEdit={isModalOpenEdit}
              currentPage={currentPage}
              pageSize={pageSize}
              handleOkeEdit={handleOkeEdit}
              handleCancelEdit={handleCancelEdit}
            />
            <Tooltip placement="leftTop" title="Xóa chương trình">
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
      <h2>Mobile Coupon</h2>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>MCoupon</Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/mcoupon">Chương trình</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Row
        style={{ marginTop: 10 }}
        gutter={[16, 16]}
        justify={"space-between"}
      >
        <Col xl lg md sm>
          <Row gutter={[16, 16]} justify={"space-between"}>
            <Col xl lg md sm>
              <Button
                type="primary"
                onClick={showModal}
                icon={<PlusCircleOutlined />}
              >
                Thêm mới
              </Button>
              <FormAdd
                isModalOpen={isModalOpen}
                currentPage={currentPage}
                pageSize={pageSize}
                handleOk={handleOk}
                handleCancel={handleCancel}
              />
            </Col>
            <Col xl lg md sm>
              <NavLink to={"/donate-directly"}>
                <Button type="primary" icon={<TeamOutlined />}>
                  Tặng trực tiếp khách hàng
                </Button>
              </NavLink>
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
                Xóa chương trình
              </Button>
            </Col>

            <Col xl lg md sm>
              <Button
                type="primary"
                icon={<HistoryOutlined />}
                onClick={() => navigate("/restorePr")}
              >
                Khôi phục
              </Button>
            </Col>
            <Col xl lg md sm>
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                disabled={data?.length === 0}
                onClick={() => handleExportExcel()}
              >
                Xuất file excel
              </Button>
            </Col>
          </Row>
        </Col>
        <Col xl lg md sm />
      </Row>
      <Divider />
      <Form form={form} component={false}>
        <Table
          columns={columns}
          rowSelection={{
            ...rowSelection,
          }}
          loading={data?.length === 0 ? isLoading : false}
          dataSource={isLoading ? [] : data}
          locale={{
            emptyText: isLoading ? (
              <Space direction="vertical" style={{ width: "100%" }}>
                {data?.map((item, index) => (
                  <Skeleton.Input
                    key={index}
                    style={{ width: "100%" }}
                    active={true}
                    size="small"
                  />
                ))}
              </Space>
            ) : (
              <Empty />
            ),
          }}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: dataTable?.total,
            current: currentPage,
            onChange: handlePageChange,
          }}
          bordered
          scroll={{ x: "500px", y: "550px" }}
        />
      </Form>
    </div>
  );
}
