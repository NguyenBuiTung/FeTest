import { Badge, Breadcrumb, Divider, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { store } from "../../../redux/configStore";
import formatDateTime from "../../../utils/dateTime";
import { getHistorySms } from "../../../api/ConfigSms/smsConfig";
// import axios from "axios";
// import { http } from "../../../utils/config";
// const { Option } = Select;
export default function HistorySms() {
  const { listHistorySms, isLoadHistorySms } = useSelector(
    (state) => state.persistedReducer.sms
  );
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
      await store.dispatch(getHistorySms({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const dataNew = listHistorySms?.data.map((items, index) => {
      const formattedDateTime = formatDateTime(items.created_at);
      return {
        key: index + 1,
        sms_id: items?.sms_id,
        username: items?.username,
        phone_receive: items?.phone_receive,
        code: items?.code,
        content: items?.content,
        message_code: items?.message_code,
        created_at: formattedDateTime,
      };
    });
    setData(dataNew);
  }, [listHistorySms]);
  const columns = [
    {
      title: "STT",
      dataIndex: "key",
    },
    {
      title: "SMS-ID",
      dataIndex: "sms_id",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
    },
    {
      title: "Đến số điện thoại",
      dataIndex: "phone_receive",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
    },
    {
      title: "Nội dung trạng thái",
      dataIndex: "message_code",
    },
    {
      title: "Trạng thái",
      dataIndex: "code",
      render: (_, record) => {
        return record.code === 0 ? (
          <Badge status="success" text="Thành công" />
        ) : (
          <Badge status="error" text="Thất bại" />
        );
      },
    },
    {
      title: "Thời gian ",
      dataIndex: "created_at",
    },
  ];

  // const [provinces, setProvinces] = useState([]);
  // const [districts, setDistricts] = useState([]);
  // const [wards, setWards] = useState([]);
  // const [selectedProvince, setSelectedProvince] = useState('');
  // const [selectedDistrict, setSelectedDistrict] = useState('');
  // const [selectedWard, setSelectedWard] = useState('');
  // const [loadingProvinces, setLoadingProvinces] = useState(false);
  // const [loadingDistricts, setLoadingDistricts] = useState(false);
  // const [loadingWards, setLoadingWards] = useState(false);
  // useEffect(() => {
  //   // Fetch provinces and set initial options
  //   setLoadingProvinces(true);
  //   http.get("/api/v1/province")
  //     .then((response) => setProvinces(response.data))
  //     .catch((error) => console.error(error))
  //     .finally(() => setLoadingProvinces(false));
  // }, []);

  // const handleProvinceChange = async (selectedProvinceId) => {
  //   setSelectedProvince(selectedProvinceId);
  //   setSelectedDistrict('');
  //   setSelectedWard('');

  //   // Fetch districts based on selected province
  //   setLoadingDistricts(true);
  //   try {
  //     const response = await http.get(`/api/v1/district/?province_id=${selectedProvinceId}`);
  //     setDistricts(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoadingDistricts(false);
  //   }
  // };

  // const handleDistrictChange = async (selectedDistrictId) => {
  //   setSelectedDistrict(selectedDistrictId);
  //   setSelectedWard('');

  //   // Fetch wards based on selected district
  //   setLoadingWards(true);
  //   try {
  //     const response = await http.get(`/api/v1/ward?district_id=${selectedDistrictId}`);
  //     setWards(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoadingWards(false);
  //   }
  // };


  return (
    <div>
      <h2>Lịch sử gửi tin nhắn</h2>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Sms</Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/history-sms">Lịch sử gửi tin nhắn</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Divider />
      <Table
        dataSource={data}
        columns={columns}
        pagination={{
          showTotal: (total, range) =>
            `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
          showQuickJumper: true,
          showSizeChanger: true,
          onShowSizeChange: handleSizeChange,
          total: listHistorySms?.total,
          current: currentPage,
          onChange: handlePageChange,
        }}
        loading={isLoadHistorySms}
        bordered
        scroll={{ x: "500px" }}
      />
      {/* <label>Province</label>
        <Select
          value={selectedProvince}
          onChange={handleProvinceChange}
          loading={loadingProvinces}
        >
          <Option value="">Select Province</Option>
          {provinces.map((province) => (
            <Option key={province.id} value={province.id}>
              {province.name}
            </Option>
          ))}
        </Select>
        <label>District</label>
        <Select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          loading={loadingDistricts}
        >
          <Option value="">Select District</Option>
          {districts.map((district) => (
            <Option key={district.id} value={district.id}>
              {district.name}
            </Option>
          ))}
        </Select>
        <label>Ward</label>
        <Select
          value={selectedWard}
          onChange={setSelectedWard}
          loading={loadingWards}
        >
          <Option value="">Select Ward</Option>
          {wards.map((ward) => (
            <Option key={ward.id} value={ward.id}>
              {ward.name}
            </Option>
          ))}
        </Select> */}
    </div>
  );
}
