import {
  Breadcrumb,
  Button,
  Divider,
  Popover,
  Table,
  TreeSelect,
} from "antd";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { store } from "../../../../redux/configStore";
import { useSelector } from "react-redux";
import formatDateTime from "../../../../utils/dateTime";
import { getListTranstionCustomer } from "../../../../api/customerSee/transactionCustomer";
import { transformData } from "../../../../utils/recursive";

export default function TransactionCustomer() {
  const { listTransationCustomer, isLoadList } = useSelector(
    (state) => state.persistedReducer.customerSee
  );
  const { listStoreCustomerAll, isLoadingStore } = useSelector(
    (state) => state.persistedReducer.storeCustomer
  );

  const dataTree = transformData(listStoreCustomerAll?.data);
  const options = dataTree?.filter((item) => item.parent_id === 0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const handleSizeChange = (current, size) => {
    setPageSize(size); // Cập nhật giá trị pageSize mới
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListTranstionCustomer({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const dataNew = listTransationCustomer?.data.map((items, index) => {
      const formattedDateTime = formatDateTime(items.created_at);
      return {
        key: index + 1,
        id: items?.id,
        code: items?.code,
        branch: items?.branch?.name,
        point_histories: items.point_histories,
        creator:
          items?.creator.info.first_name + " " + items?.creator.info.last_name,
        total_amount: items?.total_amount.toLocaleString(),
        real_revenue: items?.real_revenue.toLocaleString(),
        voucher: items?.voucher,
        created_at: formattedDateTime,
      };
    });
    setData(dataNew);
  }, [listTransationCustomer]);
  const columns = [
    {
      title: "STT",
      dataIndex: "key",
    },
    {
      title: "Mã giao dịch",
      dataIndex: "code",
    },
    {
      title: "Cửa hàng",
      dataIndex: "branch",
      render: (_, record) => {
        const content = (
          <>
            {record.point_histories.map((item, index) => {
              return item.fluctuation_type === "INCREASE" ? (
                <p style={{ color: "#52c41a", fontWeight: 500 }}>
                  Tăng {item.point} điểm
                </p>
              ) : (
                <p style={{ color: "#f5222d", fontWeight: 500 }}>
                  Giảm {item.point} điểm
                </p>
              );
            })}
          </>
        );
        return (
          <Popover
            content={content}
            title="Lịch sử tăng giảm điểm"
            trigger="click"
          >
            <Button type="link">{record.branch}</Button>
          </Popover>
        );
      },
    },
    {
      title: "Nhân viên giao dịch",
      dataIndex: "creator",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
    },
    {
      title: "Tiền thực tế phải trả",
      dataIndex: "real_revenue",
    },
    {
      title: "Mã giảm giá",
      dataIndex: "voucher",
      render: (_, record) => {
        const content = (
          <>
            <p>
              Chương trình:{" "}
              <b style={{ color: "#ff4d4f" }}>
                {record?.voucher?.campaign?.name}
              </b>{" "}
            </p>
            <p>
              Số điểm cần đổi:{" "}
              <b style={{ color: "#ff4d4f" }}>
                {record?.voucher?.exchange_point}
              </b>{" "}
            </p>
            <p>
              Giá trị ưu đãi:{" "}
              <b style={{ color: "#ff4d4f" }}>
                {record?.voucher?.preferential_value.toLocaleString()}
              </b>{" "}
              {record?.voucher?.preferential_type === "MONEY" ? "VNĐ" : "%"}
            </p>
            {record?.voucher?.preferential_type === "MONEY" ? (
              <p>
                Áp dụng cho đơn hàng tối thiểu:
                <b style={{ color: "#ff4d4f" }}>
                  {" "}
                  {record?.voucher?.minimum_value.toLocaleString()}
                </b>{" "}
                VNĐ
              </p>
            ) : (
              <p>
                Giảm tối đa:{" "}
                <b style={{ color: "#ff4d4f" }}>
                  {record?.voucher?.maximum_reduction.toLocaleString()}
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
            <Button style={{padding:0}} type="link">
              {record.voucher === null ? (
                <Button style={{padding:0,color:"#1677ff"}} disabled type="link">
                  Không áp dụng mã
                </Button>
              ) : (
                record?.voucher?.code
              )}
            </Button>
          </Popover>
        );
      },
    },
    {
      title: "Thời gian ",
      dataIndex: "created_at",
    },
  ];
  const handleSearch = async (value) => {
    await store.dispatch(
      getListTranstionCustomer({ currentPage, pageSize, value })
    );
  };
  return (
    <div>
      <h2>Lịch sử giao dịch</h2>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/transactions-customer">Thông tin giao dịch</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Divider />
      <TreeSelect
        style={{ width: 300, marginBottom: 20 }}
        disabled={isLoadingStore}
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
      <Table
        dataSource={data}
        columns={columns}
        pagination={{
          showTotal: (total, range) =>
            `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
          showQuickJumper: true,
          showSizeChanger: true,
          onShowSizeChange: handleSizeChange,
          total: listTransationCustomer?.total,
          current: currentPage,
          onChange: handlePageChange,
        }}
        loading={isLoadList}
        bordered
        scroll={{ x: "500px" }}
      />
    </div>
  );
}
