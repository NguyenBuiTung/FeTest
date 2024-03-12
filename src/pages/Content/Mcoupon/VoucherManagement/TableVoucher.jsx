import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Breadcrumb,
  Button,
  Divider,
  Empty,
  Flex,
  Form,
  Popconfirm,
  Popover,
  Skeleton,
  Space,
  Switch,
  Table,
  Tooltip,
  message,
} from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { store } from "../../../../redux/configStore";
import {
  deleteVoucher,
  editVoucher,
  getListVoucher,
} from "../../../../api/voucher/voucher";
import FormAddVoucher from "./FormAddVoucher";
// import { getLsPrCouponAll } from "../../../../api/mcoupon/listTable";
import EditVoucher from "./EditVoucher";
// import { getListCustomerAll } from "../../../../api/customer/customer";
import { getListStoreAll } from "../../../../api/storeManger/store";
import { getLsPrCouponAll } from "../../../../api/mcoupon/listTable";
import { calculateTimeDifference } from "../../../../utils/dateTime";

export default function TableVoucher() {
  const [form] = Form.useForm();
  const { listVoucher, isLoadingVoucher } = useSelector(
    (state) => state.persistedReducer.voucherRedux
  );
  const { listAllCoupon, isLoadAllCoupon } = useSelector(
    (state) => state.persistedReducer.getListProgramCoupon
  );
  const { user } = useSelector((state) => state.persistedReducer.user);
  const mCoupon = useMemo(() => {
    return listAllCoupon?.data?.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }, [listAllCoupon]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListStoreAll());
      await store.dispatch(getLsPrCouponAll());
    };
    fetchData();
  }, []);
  const showModal = () => {
    setIsModalOpen(true);
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
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListVoucher({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const dataNew = listVoucher?.data.map((items, index) => {
      const currentDate = new Date();
      const endDate = items?.end_date;
      const formattedTimeDifference = calculateTimeDifference(
        currentDate,
        endDate
      );
      return {
        key: index,
        id: items.id,
        code: items.code,
        exchange_point: items.exchange_point,
        preferential_type: items.preferential_type,
        preferential_value: items.preferential_value,
        branch_id: items.branch_id,
        usage_limit: items.usage_limit,
        start_date: items.start_date,
        end_date: items.end_date,
        timeuse: formattedTimeDifference,
        creator:
          items?.creator.info.first_name + " " + items?.creator.info.last_name,
        number_use: items.number_use,
        is_active: items.is_active,
        maximum_reduction: items.maximum_reduction,
        minimum_value: items.minimum_value,
        campaign_id: items.campaign_id,
        campaign: items?.campaign?.name,
      };
    });
    setData(dataNew);
  }, [listVoucher]);

  const handleDelete = async (record) => {
    try {
      const response = await store.dispatch(deleteVoucher(record.id));
      if (deleteVoucher.fulfilled.match(response)) {
        message.success("Xóa mã voucher thành công");
        await store.dispatch(getListVoucher({ currentPage, pageSize }));
        handlePageChange();
      } else if (deleteVoucher.rejected.match(response)) {
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
  const onChangeSwitch = async (checked, record) => {
    try {
      const dataIndex = data.findIndex((item) => item.key === record.key);
      if (dataIndex !== -1) {
        const updatedData = [...data];
        updatedData[dataIndex].is_active = checked;
        const response = await store.dispatch(
          editVoucher(updatedData[dataIndex])
        );
        if (response.payload.message === "success") {
          setData(updatedData);
          message.success("Thay đổi trạng thái thành công");
        }
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi thay đổi trạng thái");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Tên mã giảm giá",
      dataIndex: "code",
      render: (_, record) => {
        const content = (
          <>
            <p>
              Số điểm cần đổi:{" "}
              <b style={{ color: "#1677ff" }}>{record.exchange_point}</b>{" "}
            </p>
            <p>
              Giá trị ưu đãi:{" "}
              <b style={{ color: "#1677ff" }}>
                {record.preferential_value.toLocaleString()}
              </b>{" "}
              {record.preferential_type === "MONEY" ? "VNĐ" : "%"}
            </p>
            {record.preferential_type === "MONEY" ? (
              <p>
                Áp dụng cho đơn hàng tối thiểu:
                <b style={{ color: "#1677ff" }}>
                  {" "}
                  {record.minimum_value.toLocaleString()}
                </b>{" "}
                VNĐ
              </p>
            ) : (
              <p>
                Giảm tối đa:{" "}
                <b style={{ color: "#1677ff" }}>
                  {record.maximum_reduction.toLocaleString()}
                </b>{" "}
                VNĐ
              </p>
            )}
          </>
        );
        return (
          <Popover
            content={content}
            title="Chi tiết mã giảm giá"
            trigger="click"
          >
            <Button type="link">{record.code}</Button>
          </Popover>
        );
      },
    },
    {
      title: "Người tạo",
      dataIndex: "creator",
      editable: true,
    },
    {
      title: "Số lượng",
      dataIndex: "number_use",
      editable: true,
      render: (_, record) =>
        record.number_use === null ? "Không giới hạn" : record.number_use,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      render: (_, record) => (
        parseInt(record.timeuse) < 0 ? (
          <Badge status="error" text="Tắt" />
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
        )
      ),
    },
    {
      title: "Thời gian còn lại",
      dataIndex: "timeuse",
      render: (_, record) =>
        parseInt(record.timeuse) < 0 ? (
          <Badge status="error" text="Đã hết hạn" />
        ) : (
          record.timeuse
        ),
    },
    {
      title: "Chương trình",
      dataIndex: "campaign",
      editable: true,
    },
    {
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      render: (_, record) => {
        return (
          <Flex align="center" justify="center" gap={10}>
            <Tooltip placement="top" title="Sửa Coupon">
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
            <EditVoucher
              record={selectedRecord}
              mCoupon={mCoupon}
              isLoadAllCoupon={isLoadAllCoupon}
              isModalOpenEdit={isModalOpenEdit}
              currentPage={currentPage}
              pageSize={pageSize}
              handleOkeEdit={handleOkeEdit}
              handleCancelEdit={handleCancelEdit}
            />
            <Tooltip placement="leftTop" title="Xóa mã này">
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
  return (
    <div>
      <h2>Quản lý mã giảm giá</h2>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>MCoupon</Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/voucher">Mã giảm giá</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Button type="primary" onClick={showModal} icon={<PlusCircleOutlined />}>
        Thêm mới
      </Button>
      <FormAddVoucher
        mCoupon={mCoupon}
        isLoadAllCoupon={isLoadAllCoupon}
        isModalOpen={isModalOpen}
        currentPage={currentPage}
        pageSize={pageSize}
        handleCancel={handleCancel}
      />
      <Divider />
      <Form form={form} component={false}>
        <Table
          loading={data?.length === 0 ? isLoadingVoucher : false}
          dataSource={isLoadingVoucher ? [] : data}
          locale={{
            emptyText:
              isLoadingVoucher ? (
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
          columns={columns}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listVoucher?.total,
            current: currentPage,
            onChange: handlePageChange,
          }}
          bordered
          scroll={{ x: "500px" }}
        />
      </Form>
    </div>
  );
}
