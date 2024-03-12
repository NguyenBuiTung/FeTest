import React, { useCallback, useEffect, useState } from "react";
import { getListCustomer } from "../../../api/customer/customer";
import { store } from "../../../redux/configStore";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  QRCode,
  Row,
  Select,
  Table,
  message,
} from "antd";
import formatDateTime from "../../../utils/dateTime";
import { useSelector } from "react-redux";
import { PlusCircleOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { createProgram } from "../../../api/mcoupon/addProGram";
import { debounce } from "lodash";
const { RangePicker } = DatePicker;
export default function FormAddDonate() {
  const { listCustomer, isLoadCustomer } = useSelector(
    (state) => state.persistedReducer.customer
  );
  const { allListStore, isLoadStoreAll } = useSelector(
    (state) => state.persistedReducer.storeManager
  );
  const branch = allListStore?.data
    .filter((item) => item.parent_id === 0)
    .map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });
  const { currentPage, pageSize } = pagination;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  };

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListCustomer({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  const rangeConfig = {
    rules: [
      {
        type: "array",
        required: true,
        message: "Vui lòng chọn thời gian",
      },
    ],
  };
  useEffect(() => {
    const dataNew = listCustomer?.data.map((items, index) => {
      const formattedDateTime = formatDateTime(items.created_at);
      return {
        key: index,
        id: items.id,
        name: items.name,
        phone: items.phone,
        email: items.email,
        gender: items.gender,
        birthday: items.birthday,
        customer_category: items?.customer_category?.name,
        stores: items.stores,
        address: items.address,
        address_info: items.address_info,
        created_at: formattedDateTime,
      };
    });
    setData(dataNew);
  }, [listCustomer]);
  const handlePageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);
  const handleSizeChange = useCallback((current, size) => {
    setPagination({ pageSize: size });
  }, []);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Mã QR",
      dataIndex: "qrcode",
      render:(_,record)=>(
        <QRCode size={70} type="svg" value={record.id+" "+ record.name +" "+ record.phone} />
      )
    },
    Table.EXPAND_COLUMN,
    {
      title: "Khách hàng",
      dataIndex: "name",
    },

    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
    },
  ];
  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys?.length > 0;
  const onFinish = async (fieldsValue) => {
    const rangeTimeValue = fieldsValue["datepicker"];
    const values = {
      ...fieldsValue,
      datepicker: [
        rangeTimeValue[0].format("YYYY-MM-DD HH:mm:ss"),
        rangeTimeValue[1].format("YYYY-MM-DD HH:mm:ss"),
      ],
    };
    const customer_ids = selectedRows.map((item) => item.id);
    const data = {
      name: values.name,
      start_date: values.datepicker[0],
      end_date: values.datepicker[1],
      customer_ids: customer_ids,
      type: "DIRECT",
      branch_id: values.branch_id,
    };
    console.log(data);
    if (!hasSelected) {
      message.error("Vui lòng chọn khách hàng");
    }
    setIsLoading(true);
    try {
      const response = await store.dispatch(createProgram(data));
      if (createProgram.fulfilled.match(response)) {
        setIsLoading(false);
        message.success("Thêm chương trình thành công");
        form.resetFields();
        setSelectedRowKeys(null);
      } else if (createProgram.rejected.match(response)) {
        if (response.payload.errors) {
          setIsLoading(false);
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
        }
      }
    } catch (error) {
      setIsLoading(false);
      message.error("Có lỗi xảy ra");
    }
  };
  const [inputValue, setInputValue] = useState("");

  const delayedSearch = debounce((value) => {
    store.dispatch(getListCustomer({ currentPage, pageSize, value }));
  }, 500);
  const handleInputChange = (event) => {
    let value = event.target.value;
    // Thực hiện thay đổi định dạng số từ 0 thành 84
    value = value.replace(/^0/, "84");
    setInputValue(value);
    delayedSearch(value);
  };

  return (
    <div>
      <h2>Chương trình tặng trực tiếp</h2>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/mcoupon">Chương trình</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/donate-directly">Tặng trực tiếp khách hàng</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Divider />
      <Form
        name="addDonateCoupon"
        onFinish={onFinish}
        form={form}
        layout="vertical"
      >
        <Row gutter={[8, 8]}>
          <Col xl={8} lg={8} md={8} sm>
            {" "}
            <Form.Item
              label="Tên chương trình"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên chương trình",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xl={8} lg={8} md={8} sm>
            <Form.Item
              name="datepicker"
              label="Chọn ngày bắt đầu - kết thúc "
              {...rangeConfig}
            >
              <RangePicker
                style={{ width: "100%" }}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col xl={8} lg={8} md={8} sm>
            {" "}
            <Form.Item
              label="Cửa hàng"
              name="branch_id"
              rules={[{ required: true, message: "Vui lòng chọn cửa hàng" }]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                  optionA?.label
                    ?.toLowerCase()
                    .localeCompare(optionB?.label?.toLowerCase())
                }
                //   onChange={handleBranchId}
                disabled={isLoadStoreAll}
                placeholder="Vui lòng chọn cửa hàng"
                options={branch}
              />
            </Form.Item>
          </Col>
          <Col xl={8} lg={8} md={8} sm>
            {" "}
            <Form.Item label>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!hasSelected}
                loading={isLoading}
                icon={<PlusCircleOutlined />}
              >
                Thêm chương trình
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 8]} justify={"end"}>
          <Col xl={8} lg={8} md={8} sm>
            {" "}
            <Input
              allowClear
              style={{ marginBottom: 16 }}
              onChange={handleInputChange}
              value={inputValue}
              placeholder="Tìm kiếm theo tên hoặc số điện thoại"
            />
          </Col>
        </Row>
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

              const data = [
                {
                  birthday: record.birthday,
                  gender: record.gender,
                  orther_info: record.orther_info,
                  email: record.email,
                  address: `${record.address.province.name}/${record.address.district.name}/${record.address.ward.name}`,
                  address_info: record.address_info,
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
          scroll={{ x: "500px", y: "550px" }}
        />
      </Form>
    </div>
  );
}
