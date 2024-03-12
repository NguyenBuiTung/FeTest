import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  message,
} from "antd";
import React, { useState } from "react";
import { store } from "../../../redux/configStore";
import { useSelector } from "react-redux";
import { getLsPrCoupon } from "../../../api/mcoupon/listTable";
import { createProgram } from "../../../api/mcoupon/addProGram";
import { PlusCircleOutlined } from "@ant-design/icons";
import { getListRankAll } from "../../../api/customer/rankcustomer/rankcustomer";
import { getListGroupCustomerALl } from "../../../api/customer/groupCustomer/groupCustomer";
const { RangePicker } = DatePicker;
const { Option } = Select;
export default function FormAdd({
  isModalOpen,
  handleCancel,
  currentPage,
  pageSize,
}) {
  const [form] = Form.useForm();
  // const { user } = useSelector((state) => state.persistedReducer.user);
  const { loading } = useSelector((state) => state.persistedReducer.addProgram);
  const { allListStore, isLoadStoreAll } = useSelector(
    (state) => state.persistedReducer.storeManager
  );
  const { allListGroupCustomer, isLoadAllGroupCustomer } = useSelector(
    (state) => state.persistedReducer.groupCustomer
  );
  const [checkRank, setcheckRank] = useState(false);
  const [checkGroup, setCheckGroup] = useState(false);
  const group_id = allListGroupCustomer?.data.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const { listRankAll, isLoadingAll } = useSelector(
    (state) => state.persistedReducer.rankCustomer
  );
  const allRank = listRankAll?.data.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const branch = allListStore?.data
    .filter((item) => item.parent_id === 0)
    .map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
  const rangeConfig = {
    rules: [
      {
        type: "array",
        required: true,
        message: "Vui lòng chọn thời gian",
      },
    ],
  };
  const onFinish = async (fieldsValue) => {
    const rangeTimeValue = fieldsValue["datepicker"];
    const values = {
      ...fieldsValue,
      start_date: rangeTimeValue[0].format("YYYY-MM-DD HH:mm:ss"),
      end_date: rangeTimeValue[1].format("YYYY-MM-DD HH:mm:ss"),
    };
    // console.log(values);
    try {
      const response = await store.dispatch(createProgram(values));
      if (createProgram.fulfilled.match(response)) {
        message.success("Thêm chương trình thành công");
        handleCancel();
        form.resetFields();
        setCheckGroup(false);
        setcheckRank(false);
        await store.dispatch(getLsPrCoupon({ currentPage, pageSize }));
      } else if (createProgram.rejected.match(response)) {
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
      message.error("Có lỗi xảy ra");
    }
  };
  const handleBranchId = async (value) => {
    try {
      await Promise.all([
        store.dispatch(getListRankAll(value)),
        store.dispatch(getListGroupCustomerALl(value)),
      ]);
      form.resetFields(["membership_class_ids", "group_customer_ids"]);
    } catch (error) {
      message.error("Có lỗi rồi em ơi");
    }
  };

  const handleCheck = (value) => {
    if (value === "RANK_CUSTOMER") {
      setcheckRank(true);
      setCheckGroup(false);
    } else if (value === "GROUP_CUSTOMER") {
      setCheckGroup(true);
      setcheckRank(false);
    } else {
      setCheckGroup(false);
      setcheckRank(false);
    }
  };
  return (
    <div>
      <Modal
        title="Thêm chương trình"
        open={isModalOpen}
        footer={null}
        width={550}
        onCancel={handleCancel}
      >
        <Form
          name="addProgram"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
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
            <Col xl={12} lg={12} md={12} sm>
              {" "}
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
            <Col xl={12} lg={12} md={12} sm>
              {/* {user?.data.type !== "STAFF" &&
                user?.data.type !== "BRANCH_MANAGER" && (
                 
                )} */}
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
                  onChange={handleBranchId}
                  disabled={isLoadStoreAll}
                  placeholder="Vui lòng chọn cửa hàng"
                  options={branch}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại chương trình",
                  },
                ]}
                name="type"
                label="Gắn theo loại"
              >
                <Select
                  onChange={handleCheck}
                  placeholder="Vui lòng chọn loại chương trình"
                >
                  <Option value="ALL">Tất cả khách hàng</Option>
                  <Option value="GROUP_CUSTOMER">Nhóm khách hàng</Option>
                  <Option value="RANK_CUSTOMER">Hạng thành viên</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {checkRank && (
            <Form.Item
              label="Hạng thành viên"
              name="membership_class_ids"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn hạng thành viên",
                },
              ]}
            >
              <Select
                mode="multiple"
                options={allRank}
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
                disabled={isLoadingAll}
                placeholder="Vui lòng chọn loại khách hàng"
              />
            </Form.Item>
          )}
          {checkGroup && (
            <Form.Item
              name="group_customer_ids"
              label="Nhóm khách hàng"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập nhóm khách hàng",
                },
              ]}
            >
              <Select
                showSearch
                mode="multiple"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                  optionA?.label
                    ?.toLowerCase()
                    .localeCompare(optionB?.label?.toLowerCase())
                }
                disabled={isLoadAllGroupCustomer}
                placeholder="Vui lòng chọn nhóm khách hàng"
                options={group_id}
              />
            </Form.Item>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<PlusCircleOutlined />}
            >
              Tạo chương trình
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
