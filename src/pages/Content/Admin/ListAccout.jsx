import { DeleteOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Breadcrumb, Popconfirm, Select, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../../../redux/configStore";
import { getUserShop } from "../../../api/User/infoUser";
import { NavLink } from "react-router-dom";
import ModalView from "./ModalView";

export default function ListAccout() {
  const { userShop, isLoading } = useSelector(
    (state) => state.persistedReducer.user
  );
  // console.log(userShop)
  const options = userShop.map((item) => {
    return {
      value: item.id,
      label: item.id,
    };
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);
  const handleSizeChange = useCallback((current, size) => {
    setPageSize(size);
  }, []);

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getUserShop({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const dataNew = userShop?.map((items, index) => {
      return {
        key: items.id,
        id: items.id,
        userId: items.userId,
        title: items.title,
      };
    });
    setData(dataNew);
  }, [userShop]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "User ID",
      dataIndex: "userId",
      align: "center",
      width: "10%",
    },
    {
      title: "Title",
      dataIndex: "title",
      editable: true,
      width: "20%",
    },

    {
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      render: (_, record) => <ModalView record={record} />,
    },
  ];
  const handleFilterChange = (value) => {
    console.log(value);
     store.dispatch(getUserShop({ currentPage, pageSize,value }));
  };
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/post-manager">Post manager</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Select
      allowClear
        placeholder="Lọc theo id "
        onChange={handleFilterChange}
        style={{ width: "200px",marginBottom:10 }}
        loading={isLoading}
        options={options}
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
          total: userShop?.total,
          current: currentPage,
          onChange: handlePageChange,
        }}
        loading={isLoading}
        bordered
        scroll={{ x: "500px" }}
      />
    </div>
  );
}
