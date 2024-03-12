import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  message,
} from "antd";
import React, { useState } from "react";
import { store } from "../../../../redux/configStore";
import {
  createCustomerType,
  getListCustomerType,
} from "../../../../api/customer/customertype/listCustomerType";
import { useSelector } from "react-redux";


export default function FormAddCustomerType({
  isModalOpen,
  handleCancel,
  currentPage,
  pageSize,
}) {
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
  const [isLoading, setIsLoading] = useState();
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await store.dispatch(createCustomerType(values));
      if (createCustomerType.fulfilled.match(response)) {
        await store.dispatch(getListCustomerType({ currentPage, pageSize }));
        setIsLoading(false);
        message.success("Thêm phân loại khách hàng thành công");
        form.resetFields(["name", "description"]);
        handleCancel();
      } else if (createCustomerType.rejected.match(response)) {
        setIsLoading(false);
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
        }
        if (response.payload.message) {
          message.error(response.payload.message);
        }
      }
    } catch (error) {
      setIsLoading(false);
      message.error("Có lỗi xảy ra");
    }
  };
  return (
    <div>
      <Modal
        title="Thêm loại khách hàng"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="addCustomerType"
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Row gutter={[8, 8]} justify={"space-between"}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Loại khách hàng"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập loại khách hàng",
                  },
                ]}
              >
                <Input placeholder="Vui lòng nhập loại khách hàng" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="description"
                label="Mô tả cho loại khách hàng này"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Vui lòng nhập mô tả "
                />
              </Form.Item>
            </Col>
          </Row>
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
            disabled={isLoadStoreAll}
            placeholder="Vui lòng chọn cửa hàng"
            options={branch}
          />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              icon={<PlusCircleOutlined />}
            >
              Thêm loại khách hàng
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
