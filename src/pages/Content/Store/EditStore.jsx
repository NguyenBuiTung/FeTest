import { SyncOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import FormAddress from "../Customer/FormAddress";
import { editStore, getListStore } from "../../../api/storeManger/store";
import { store } from "../../../redux/configStore";

export default function EditStore({
  isModalOpenEdit,
  handleCancelEdit,
  currentPage,
  pageSize,
  record,
}) {
  const [formRef] = Form.useForm();
  const [isLoadEdit, setIsLoadEdit] = useState();
  const formAddressRef = useRef(null);
  const { user } = useSelector((state) => state.persistedReducer.user);
  const { allUser, isLoadAllUser } = useSelector(
    (state) => state.persistedReducer.user
  );
  const { allListStore, isLoadStoreAll } = useSelector(
    (state) => state.persistedReducer.storeManager
  );
  const parent_id = (allListStore?.data || []).filter(item => item.parent_id === 0).map(item => ({
    value: item.id,
    label: item.name,
    parent_id: item.parent_id
  }));
  const user_ids = allUser?.data.map((item) => {
    return {
      value: item.id,
      label: item.username,
    };
  });
  useEffect(() => {
    formRef.setFieldsValue({
      name: record?.name,
      tax_code: record?.tax_code,
      parent_id: record?.parent_id,
      address_detail: record?.address_detail,
      user_id: record?.user_id,
    });
  }, [record, formRef]);
  const onFinish = async (fieldsValue) => {
    const formAddressValues = formAddressRef.current?.getFormValues();
    const values = {
      id: record.id,
      ...formAddressValues,
      ...fieldsValue,
    };
    setIsLoadEdit(true);
    try {
      await formAddressRef.current?.validateFields();
      const response = await store.dispatch(editStore(values));
      if (editStore.fulfilled.match(response)) {
        setIsLoadEdit(false);
        handleCancelEdit();
        message.success("Sửa thông tin cửa hàng thành công");
        await store.dispatch(getListStore({ currentPage, pageSize }));
      } else if (editStore.rejected.match(response)) {
        setIsLoadEdit(false);
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
      setIsLoadEdit(false);
      message.error("Có lỗi xảy ra");
    }
  };
  return (
    <div>
      <Modal
        title="Sửa cửa hàng"
        open={isModalOpenEdit}
        footer={null}
        onCancel={handleCancelEdit}
      >
        <Form
          name="editStore"
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
          <FormAddress
            ref={formAddressRef}
            record={record}
          />
          {record?.parent_id !== 0 && (
            <Form.Item
              label="Cửa hàng (chọn cửa hàng nếu muốn sửa chi nhánh)"
              name="parent_id"
              rules={[{ required: false, message: "Vui lòng chọn cửa hàng" }]}
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
                options={parent_id}
              />
            </Form.Item>
          )}
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
              loading={isLoadEdit}
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
