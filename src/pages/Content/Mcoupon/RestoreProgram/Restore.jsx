import {
  Badge,
  Breadcrumb,
  Button,
  Col,
  Divider,
  Popconfirm,
  Row,
  Table,
  Tooltip,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import EditableCell from "../EditCellTable";
import { store } from "../../../../redux/configStore";
import { getLsRestoreCoupon } from "../../../../api/mcoupon/listTable";
import { useSelector } from "react-redux";
import { ArrowLeftOutlined, HistoryOutlined } from "@ant-design/icons";
import {
  restoreProgram,
  restoreProgramAll,
  restorePrograms,
} from "../../../../api/mcoupon/historyTable";
import { NavLink, useNavigate } from "react-router-dom";

export default function Restore() {
  const { dataRestore, loading } = useSelector(
    (state) => state.persistedReducer.getListProgramCoupon
  );
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Sử dụng state để lưu giá trị pageSize
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getLsRestoreCoupon({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const dataNew = dataRestore?.data.map((items, index) => {
      return {
        key: index,
        ID: items.id,
        name: items.name,
        total_code: items.total_code,
        start_date: items.start_date,
        end_date: items.end_date,
        is_active: items.is_active,
        sms_template: items.sms_template,
      };
    });
    setData(dataNew);
  }, [dataRestore]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleSizeChange = (current, size) => {
    setPageSize(size); // Cập nhật giá trị pageSize mới
  };
  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  };
  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  const handleRestore = async (id) => {
    try {
      const response = await store.dispatch(restoreProgram(id));
      if (response.payload.success === true) {
        await store.dispatch(getLsRestoreCoupon({ currentPage, pageSize }));
        message.success(`Khôi phục thành công`);
      } else {
        message.error("Có lỗi xảy ra ");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };
  const handleRestores = async () => {
    const codes = selectedRows.map((item) => item.ID);
    try {
      const response = await store.dispatch(
        restorePrograms({
          campaign_ids: codes,
        })
      );
      if (response.payload.success === true) {
        await store.dispatch(getLsRestoreCoupon({ currentPage, pageSize }));
        setSelectedRowKeys([]);
        setSelectedRows([]);
        message.success(`Khôi phục thành công`);
      } else {
        message.error("Có lỗi xảy ra ");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };
  const handleRestoreAll = async () => {
    try {
      const response = await store.dispatch(restoreProgramAll());
      if (response.payload.success === true) {
        await store.dispatch(getLsRestoreCoupon({ currentPage, pageSize }));
        setSelectedRowKeys([]);
        setSelectedRows([]);
        message.success(`Khôi phục thành công`);
      } else {
        message.error("Có lỗi xảy ra ");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };
  const columns = [
    {
      title: "Mã số",
      dataIndex: "ID",
    },
    {
      title: "Chương trình",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "Tổng mã",
      dataIndex: "total_code",
      editable: true,
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
      title: "Trạng thái",
      dataIndex: "is_active",
      render: (_, record) => {
        return record.is_active ? (
          <Badge status="success" text="Đang hoạt động" />
        ) : (
          <Badge status="error" text="Đã kết thúc" />
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      render: (_, record) => (
        <Tooltip placement="top" title="Khôi phục chương trình">
          <Popconfirm
            title="Bạn có chắc chắn muốn khôi phục?"
            onConfirm={() => handleRestore(record.ID)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <HistoryOutlined style={{ color: "#f5222d", fontSize: 20 }} />
          </Popconfirm>
        </Tooltip>
      ),
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
          <NavLink
            to="/restorePr"
          >
            Khôi phục
          </NavLink>
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
              <Popconfirm
                title="Bạn có chắc chắn muốn khôi phục?"
                onConfirm={() => handleRestores()}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button
                  type="primary"
                  danger
                  icon={<HistoryOutlined />}
                  disabled={!hasSelected}
                >
                  Khôi phục chương trình đã chọn
                </Button>
              </Popconfirm>
            </Col>
            <Col xl lg md sm>
              <Popconfirm
                title="Bạn có chắc chắn muốn khôi phục tất cả chương trình?"
                onConfirm={() => handleRestoreAll()}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button type="primary" danger icon={<HistoryOutlined />}>
                  Khôi phục tất cả chương trình
                </Button>
              </Popconfirm>
            </Col>
            <Col xl lg md sm>
              <Button
                type="primary"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/mcoupon")}
              >
                Quay lại
              </Button>
            </Col>
          </Row>
        </Col>
        <Col xl lg md sm />
      </Row>
      <Divider />
      <Table
        dataSource={data}
        columns={columns}
        rowSelection={{
          ...rowSelection,
        }}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        pagination={{
          showTotal: (total, range) =>
            `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
          showQuickJumper: true,
          showSizeChanger: true,
          onShowSizeChange: handleSizeChange,
          total: dataRestore?.total,
          current: currentPage,
          onChange: handlePageChange,
        }}
        loading={loading}
        bordered
        scroll={{ x: "500px" }}
      />
    </div>
  );
}
