import { SyncOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editGroupCustomer, getListGroupCustomer } from "../../../../api/customer/groupCustomer/groupCustomer";
import { store } from "../../../../redux/configStore";

export default function EditGroupCustomer({
  isModalOpenEdit,
  handleCancelEdit,
  currentPage,
  pageSize,
  record,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isEditLoading, setEditLoading] = useState();
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
  const onFinish = async (values) => {
    const data = {
      id: record.id,
      ...values,
    };
    setEditLoading(true);
    try {
      const response = await dispatch(editGroupCustomer(data));
      if (editGroupCustomer.fulfilled.match(response)) {
        setEditLoading(false);
        await store.dispatch(getListGroupCustomer({ currentPage, pageSize }));
        message.success("Sửa nhóm khách hàng thành công");
        handleCancelEdit();
      } else if (editGroupCustomer.rejected.match(response)) {
        if (response.payload.errors) {
          setEditLoading(false);
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
      setEditLoading(false);
      console.log(error);
      message.error("Có lỗi xảy ra");
    }
  };
  useEffect(() => {
    form.setFieldsValue({
        name: record?.name,
        branch_id: record?.branch_id,
        customer_id: record?.customers.map((item) => item.id),
      });
  }, [record, form]);
  console.log(record)
  return (
    <div>
      <Modal
        title="Sửa nhóm khách hàng"
        open={isModalOpenEdit}
        footer={null}
        onCancel={handleCancelEdit}
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
              loading={isEditLoading}
              icon={<SyncOutlined />}
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
