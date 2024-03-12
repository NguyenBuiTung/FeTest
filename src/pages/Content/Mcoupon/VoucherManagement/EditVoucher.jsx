import { SyncOutlined } from "@ant-design/icons";
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
  TreeSelect,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { editVoucher, getListVoucher } from "../../../../api/voucher/voucher";
import { useDispatch, useSelector } from "react-redux";
import { getLsPrCouponAll } from "../../../../api/mcoupon/listTable";
import { store } from "../../../../redux/configStore";
import dayjs from "dayjs";
import { transformData } from "../../../../utils/recursive";
const { Option } = Select;
const { RangePicker } = DatePicker;
export default function EditVoucher({
  isModalOpenEdit,
  handleCancelEdit,
  mCoupon,
  currentPage,
  pageSize,
  record,
  isLoadAllCoupon,
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
  const dispatch = useDispatch();
  const [formRef] = Form.useForm();
  // const { user } = useSelector((state) => state.persistedReducer.user);
  const { allListStore, isLoadStoreAll } = useSelector(
    (state) => state.persistedReducer.storeManager
  );
  const data = transformData(allListStore?.data);
  const options = data?.filter((item) => item.parent_id === 0);
  const [showTypeSelect, setShowTypeSelect] = useState(false);
  const [showPreferentialPercentMoney, setShowPreferentialPercentMoney] =
    useState(false);
  const [showPreferentialMoney, setShowPreferentialMoney] = useState(false);
  const [isEditLoading, setEditLoading] = useState(false);
  useEffect(() => {
    formRef.setFieldsValue({
      code: record?.code,
      exchange_point: record?.exchange_point,
      preferential_type: record?.preferential_type,
      preferential_value: record?.preferential_value,
      branch_id: record?.branch_id,
      datepicker: [dayjs(record?.start_date), dayjs(record?.end_date)],
      maximum_reduction: record?.maximum_reduction,
      minimum_value: record?.minimum_value,
      usage_limit: record?.usage_limit,
      number_use: record?.number_use,
      campaign_id: record?.campaign_id,
    });
  }, [record, formRef]);
  const onFinish = async (fieldsValue) => {
    const rangeTimeValue = fieldsValue["datepicker"];
    const values = {
      ...fieldsValue,
      id: record.id,
      start_date: rangeTimeValue[0].format("YYYY-MM-DD HH:mm:ss"),
      end_date: rangeTimeValue[1].format("YYYY-MM-DD HH:mm:ss"),
    };
    // console.log(values)
    setEditLoading(true);
    try {
      const response = await dispatch(editVoucher(values));
      if (editVoucher.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Cập nhật thành công");
        handleCancelEdit();
        await dispatch(getListVoucher({ currentPage, pageSize }));
      } else if (editVoucher.rejected.match(response)) {
        setEditLoading(false);
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
      setEditLoading(false);
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
      formRef.resetFields(["campaign_id"]);
    } catch (error) {
      message.error("Có lỗi khi lấy chương trình");
    }
  };
  useEffect(() => {
    if (record?.usage_limit === "LIMITED") {
      setShowTypeSelect(true);
    } else {
      setShowTypeSelect(false);
    }
    // Thiết lập trạng thái ban đầu cho các input dựa trên preferential_type
    if (record?.preferential_type === "PERCENT_MONEY") {
      setShowPreferentialPercentMoney(true);
      setShowPreferentialMoney(false);
    } else if (record?.preferential_type === "MONEY") {
      setShowPreferentialPercentMoney(false);
      setShowPreferentialMoney(true);
    }
  }, [record?.usage_limit, record?.preferential_type]);
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
        title="Sửa mã giảm giá"
        open={isModalOpenEdit}
        footer={null}
        onCancel={handleCancelEdit}
      >
        <Form
          name="editVoucher"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formRef}
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
                    pattern: /^[A-Z0-9]*$/,
                    message: "Tên mã giảm giá chỉ được chứa chữ in hoa và số",
                  },
                ]}
              >
                <Input />
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
                <Input />
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
                  <Input />
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
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isEditLoading}
              icon={<SyncOutlined />}
            >
              Cập nhật mã giảm giá
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
