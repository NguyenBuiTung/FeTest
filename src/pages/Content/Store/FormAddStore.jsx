import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useRef, useState } from "react";
import FormAddress from "../Customer/FormAddress";
import { store } from "../../../redux/configStore";
import { createStore, getListStore } from "../../../api/storeManger/store";
import { useSelector } from "react-redux";

export default function FormAddStore({
  isModalOpen,
  handleCancel,
  currentPage,
  pageSize,
}) {
  const { user } = useSelector((state) => state.persistedReducer.user);
  const { allUser, isLoadAllUser } = useSelector(
    (state) => state.persistedReducer.user
  );
  const { allListStore, isLoadStoreAll } = useSelector(
    (state) => state.persistedReducer.storeManager
  );

  // Lọc ra những cửa hàng có parent_id === 0
  const parent_id = (allListStore?.data || [])
    .filter((item) => item.parent_id === 0)
    .map((item) => ({
      value: item.id,
      label: item.name,
      parent_id: item.parent_id,
    }));

  const user_ids = allUser?.data.map((item) => {
    return {
      value: item.id,
      label: item.info.first_name + " " + item.info.last_name,
    };
  });
  const [formRef] = Form.useForm();
  const formAddressRef = useRef(null);
  const handleResetFormAddress = () => {
    if (formAddressRef.current) {
      formAddressRef.current.resetFields();
    }
  };
  const [isLoading, setIsLoading] = useState();
  const onFinish = async (values) => {
    const formAddressValues = formAddressRef.current?.getFormValues();
    const data = {
      ...values,
      ...formAddressValues,
    };
    setIsLoading(true);
    try {
      await formAddressRef.current?.validateFields();
      const response = await store.dispatch(createStore(data));
      if (createStore.fulfilled.match(response)) {
        setIsLoading(false);
        message.success("Thêm cửa hàng thành công");
        await store.dispatch(getListStore({ currentPage, pageSize }));
        formRef.resetFields();
        handleResetFormAddress();
        handleCancel();
      } else if (createStore.rejected.match(response)) {
        setIsLoading(false);
        console.log(response.payload.message);
        if (response.payload.errors) {
          Object.keys(response.payload.errors).forEach((field) => {
            const errorMessages = response.payload.errors[field];
            errorMessages.forEach((errorMessage) => {
              message.error(`${errorMessage}`);
            });
          });
        } else if (response.payload.message) {
          message.error(response.payload.message);
        }
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Modal
        title="Thêm cửa hàng"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          name="addStore"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formRef}
        >
          <Row gutter={[8, 8]} justify={"space-between"}>
            <Col xl={12} lg={12} md sm>
              <Form.Item
                label="Tên cửa hàng"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên cửa hàng",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md sm>
              <Form.Item
                label="Mã số thuế"
                name="tax_code"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã số thuế",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Cửa hàng (chọn cửa hàng nếu muốn tạo chi nhánh)"
            name="parent_id"
            rules={[{ required: false, message: "Vui lòng chọn cửa hàng" }]}
          >
            <Select
              showSearch
              allowClear
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
              options={parent_id}
            />
          </Form.Item>
          <FormAddress ref={formAddressRef} />
          <Form.Item
            label="Địa chỉ chi tiết"
            name="address_detail"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập chi tiết",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {user?.data.type === "ADMIN" && ( // Kiểm tra quyền admin trước khi hiển thị Form.Item
            <Form.Item
              label="Tài khoản"
              name="user_id"
              rules={[{ required: true, message: "Vui lòng chọn tài khoản" }]}
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
                disabled={isLoadAllUser}
                placeholder="Vui lòng chọn khách hàng"
                options={user_ids}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              icon={<PlusCircleOutlined />}
            >
              Thêm cửa hàng
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
