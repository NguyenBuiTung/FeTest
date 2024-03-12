import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
  TreeSelect,
  message,
} from "antd";
import React, { useState } from "react";
import { store } from "../../../../redux/configStore";
import { createVoucher, getListVoucher } from "../../../../api/voucher/voucher";
import { useSelector } from "react-redux";
import { getLsPrCouponAll } from "../../../../api/mcoupon/listTable";
import { transformData } from "../../../../utils/recursive";
const { Option } = Select;
const { RangePicker } = DatePicker;
export default function FormAddVoucher({
  isModalOpen,
  currentPage,
  handleCancel,
  isLoadAllCoupon,
  mCoupon,
  pageSize,
}) {
  const rangeConfig = {
    rules: [
      {
        type: "array",
        required: true,
        message: "Vui lòng chọn thời gian",
      },
    ],
  };
  const [form] = Form.useForm();
  const { allListStore, isLoadStoreAll } = useSelector(
    (state) => state.persistedReducer.storeManager
  );
  const { user } = useSelector((state) => state.persistedReducer.user);
  const [showTypeSelect, setShowTypeSelect] = useState(false);
  const [showPreferentialPercentMoney, setShowPreferentialPercentMoney] =
    useState(false);
  const [showPreferentialMoney, setShowPreferentialMoney] = useState(false);
  const data = transformData(allListStore?.data);
  const options = data?.filter((item) => item.parent_id === 0);
  const [isLoading, setIsLoading] = useState();

  const onFinish = async (fieldsValue) => {
    const rangeTimeValue = fieldsValue["datepicker"];
    const values = {
      ...fieldsValue,
      start_date: rangeTimeValue[0].format("YYYY-MM-DD HH:mm:ss"),
      end_date: rangeTimeValue[1].format("YYYY-MM-DD HH:mm:ss"),
    };
    // console.log(values);
    setIsLoading(true);
    try {
      const response = await store.dispatch(createVoucher(values));
      if (createVoucher.fulfilled.match(response)) {
        setIsLoading(false);
        message.success("Thêm mã giảm giá thành công");
        await store.dispatch(getListVoucher({ currentPage, pageSize }));
        form.resetFields();
        handleCancel();
      } else if (createVoucher.rejected.match(response)) {
        if (response.payload.message) {
          message.error(response.payload.message);
        }
        setIsLoading(false);
        if (response.payload.errors) {
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
    }
  };

  const handleSelect = (value) => {
    if (value === "LIMITED") {
      setShowTypeSelect(true);
    } else {
      setShowTypeSelect(false);
    }
  };
  const handleBranchId = async (value) => {
    try {
      await store.dispatch(getLsPrCouponAll(value));
      form.resetFields(["campaign_id"]);
    } catch (error) {
      message.error("Có lỗi khi lấy chương trình");
    }
  };

  const handlePreferentialType = (value) => {
    if (value === "MONEY") {
      setShowPreferentialPercentMoney(false);
      setShowPreferentialMoney(true);
    } else {
      setShowPreferentialPercentMoney(true);
      setShowPreferentialMoney(false);
    }
  };
  return (
    <div>
      <Modal
        title="Thêm mã giảm giá"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          name="addVoucher"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]} justify={"space-between"}>
            <Col xl={12} lg={12} md={12} sm={24}>
              <Form.Item
                label="Tên mã giảm giá"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên mã giảm giá",
                  },
                  {
                    pattern: /^[A-Z0-9!@#$%^&*()]*$/,
                    message:
                      "Tên mã giảm giá chỉ được chứa chữ in hoa, số và ký tự đặc biệt",
                  },
                ]}
              >
                <Input placeholder="Tên voucher" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24}>
              <Form.Item
                label="Tương ứng số điểm"
                name="exchange_point"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điểm",
                  },
                  {
                    type: "number",
                    message: "Vui lòng nhập số",
                    transform: (value) => {
                      if (value) {
                        return Number(value);
                      }
                    },
                  },
                ]}
              >
                <Input placeholder="Số điểm" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} justify={"space-between"}>
            <Col xl={12} lg={12} md={12} sm={24}>
              <Form.Item
                label="Cửa hàng"
                name="branch_id"
                rules={[{ required: true, message: "Vui lòng chọn cửa hàng" }]}
              >
                <TreeSelect
                  placeholder="Cửa hàng"
                  loading={isLoadStoreAll}
                  disabled={isLoadStoreAll}
                  allowClear
                  showSearch
                  onChange={handleBranchId}
                  filterTreeNode={(inputValue, treeNode) => {
                    return treeNode.title
                      .toLowerCase()
                      .includes(inputValue.toLowerCase());
                  }}
                  treeLine
                  treeData={options}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24}>
              <Form.Item
                label="Chương trình"
                name="campaign_id"
                rules={[
                  { required: true, message: "Vui lòng chọn chương trình" },
                ]}
              >
                <Select
                  // mode="multiple"
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
                  disabled={isLoadAllCoupon}
                  placeholder="Vui lòng chọn chương trình"
                  options={mCoupon}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} justify={"space-between"}>
            <Col xl={12} lg={12} md={12} sm={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại ưu đãi",
                  },
                ]}
                name="preferential_type"
                label="Hình thức ưu đãi"
              >
                <Select
                  onChange={handlePreferentialType}
                  placeholder="Vui lòng chọn loại ưu đãi"
                >
                  <Option value="MONEY">Giảm VNĐ</Option>
                  <Option value="PERCENT_MONEY">Giảm %</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24}>
              {showPreferentialPercentMoney && (
                <Form.Item
                  label="Giảm tối đa"
                  name="maximum_reduction"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số tiền",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập số tiền"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              )}
              {showPreferentialMoney && (
                <Form.Item
                  label="Đơn hàng tối thiểu"
                  name="minimum_value"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số tiền",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập số tiền"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
          <Row gutter={[8, 8]} justify={"space-between"}>
            <Col xl={12} lg={12} md={12} sm={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại ưu đãi",
                  },
                ]}
                name="usage_limit"
                label="Hình thức"
              >
                <Select
                  placeholder="Vui lòng chọn loại ưu đãi"
                  onChange={handleSelect}
                >
                  <Option value="UNLIMITED">Không giới hạn</Option>
                  <Option value="LIMITED">Giới hạn</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24}>
              {showTypeSelect && (
                <Form.Item
                  label="Số lượng sử dụng"
                  name="number_use"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số điểm",
                    },
                    {
                      type: "number",
                      message: "Vui lòng nhập số",
                      transform: (value) => {
                        if (value) {
                          return Number(value);
                        }
                      },
                    },
                  ]}
                >
                  <Input placeholder="Nhập số lượng" />
                </Form.Item>
              )}
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm={24}>
              {" "}
              <Form.Item name="datepicker" label="Hạn sử dụng" {...rangeConfig}>
                <RangePicker
                  style={{ width: "100%" }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24}>
              {" "}
              <Form.Item
                label="Giá trị ưu đãi"
                name="preferential_value"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số tiền",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        getFieldValue("preferential_type") === "PERCENT_MONEY"
                      ) {
                        if (value <= 0) {
                          return Promise.reject(
                            new Error("Giá trị ưu đãi phải lớn hơn 0")
                          );
                        }
                        if (value >= 100) {
                          return Promise.reject(
                            new Error("Giá trị ưu đãi phải nhỏ hơn 100")
                          );
                        }
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber
                  placeholder="Giá trị ưu đãi"
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>
          {user?.data.type !== "STAFF" &&
            user?.data.type !== "BRANCH_MANAGER" && (
              <Form.Item
                name="is_active"
                label="Kích hoạt"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              icon={<PlusCircleOutlined />}
            >
              Thêm mã giảm giá
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
