import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../../../../redux/configStore";
import {
  createGroupCustomer,
  getListGroupCustomer,
} from "../../../../api/customer/groupCustomer/groupCustomer";

export default function FormAddGroupCustomer({
  isModalOpen,
  handleCancel,
  currentPage,
  pageSize,
}) {
  const { allListCustomer, isLoadAllCustomer } = useSelector(
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
  const customer_id = allListCustomer?.data.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const [isLoading, setIsLoading] = useState();
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    console.log(values);
    setIsLoading(true);
    try {
      const response = await store.dispatch(createGroupCustomer(values));
      if (createGroupCustomer.fulfilled.match(response)) {
        await store.dispatch(getListGroupCustomer({ currentPage, pageSize }));
        setIsLoading(false);
        message.success("Thêm nhóm khách hàng thành công");
        form.resetFields(["name", "description"]);
        handleCancel();
      } else if (createGroupCustomer.rejected.match(response)) {
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
        title="Thêm nhóm khách hàng"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="addGroupCustomer"
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Row gutter={[8, 8]}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Tên nhóm khách hàng"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên nhóm khách hàng",
                  },
                ]}
              >
                <Input placeholder="Vui lòng nhập tên nhóm khách hàng" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Chuỗi cửa hàng"
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
            </Col>
          </Row>

          <Form.Item
            label="Khách hàng"
            name="customer_id"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn khách hàng",
              },
            ]}
          >
            <Select
              options={customer_id}
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
              disabled={isLoadAllCustomer}
              placeholder="Vui lòng chọn khách hàng"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              icon={<PlusCircleOutlined />}
            >
              Thêm nhóm khách hàng
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
