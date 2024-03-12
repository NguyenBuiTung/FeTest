import {
  Avatar,
  Breadcrumb,
  Divider,
  Empty,
  Form,
  Skeleton,
  Space,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { store } from "../../../redux/configStore";
import { useSelector } from "react-redux";

import formatDateTime from "../../../utils/dateTime";
import {
  getListStoreCustomer,
  getListStoreCustomerAll,
} from "../../../api/customerSee/customerSee";
import { NavLink } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

export default function TableStoreCustomer() {
  const [form] = Form.useForm();
  const { listStoreCustomer, isLoading } = useSelector(
    (state) => state.persistedReducer.storeCustomer
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Sử dụng state để lưu giá trị pageSize

  const handleSizeChange = (current, size) => {
    setPageSize(size); // Cập nhật giá trị pageSize mới
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListStoreCustomer({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListStoreCustomerAll());
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
      return `${province.name} - ${district.name} - ${ward.name}`;
    };
    const getRank = (item) => {
      if (!item) return "";
      const { membership_class } = item;
      return membership_class?.name;
    };
    // Hàm xử lý dữ liệu và render địa chỉ
    const renderAddresses = (listStoreData) => {
      if (!listStoreData) return [];
      return listStoreData.map((item, index) => {
        const formattedDateTime = formatDateTime(item.created_at);
        const address = getAddress(item);
        const rank = getRank(item);
        let newData = {
          key: item.id,
          id: item?.id,
          name: item?.name,
          point: item?.point,
          avatar: item.membership_class?.avatar,
          rank: item?.membership_class,
          address: item?.address,
          address_detail: item?.address_detail,
          parent_id: item?.parent_id,
          addRess: address,
          Rank: rank,
          created_at: formattedDateTime,
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
      listStoreCustomer?.data.filter((item) => item.parent_id === 0)
    );
    setData(newData);
  }, [listStoreCustomer?.data]);
  // console.log(data)

  const columns = [
    {
      title: "Tên cửa hàng",
      dataIndex: "name",
    },
    {
      title: "Địa chỉ",
      dataIndex: "addRess",
    },
    {
      title: "Địa chỉ chi tiết",
      dataIndex: "address_detail",
    },
    {
      title: "Điểm của bạn",
      dataIndex: "point",
    },
    {
      title: "Hạng thành viên",
      dataIndex: "Rank",
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
    },
  ];
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/info-point-store">
            Thông tin điểm và xếp hạng của bạn
          </NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Divider />
      <Form form={form} component={false}>
        <Table
          columns={columns}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listStoreCustomer?.total,
            current: currentPage,
            onChange: handlePageChange,
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
          bordered
          scroll={{ x: "500px" }}
        />
      </Form>
    </div>
  );
}
