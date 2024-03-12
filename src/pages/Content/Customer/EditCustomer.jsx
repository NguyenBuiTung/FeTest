import { SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  // TreeSelect,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import FormAddress from "./FormAddress";
import { store } from "../../../redux/configStore";
import { editCustomer, getListCustomer } from "../../../api/customer/customer";
// import { transformData } from "../../../utils/recursive";
const { Option } = Select;
export default function EditCustomer({
  isModalOpenEdit,
  handleCancelEdit,
  currentPage,
  pageSize,
  record,
}) {
  // const { allListStore, isLoadStoreAll } = useSelector(
  //   (state) => state.persistedReducer.storeManager
  // );
  // const { allListCustomerType, isLoadAll } = useSelector(
  //   (state) => state.persistedReducer.customerType
  // );
  // const customertype_id = allListCustomerType?.data.map((item) => {
  //   return {
  //     value: item.id,
  //     label: item.name,
  //   };
  // });
  // const data = transformData(allListStore?.data);
  // const options = data?.filter((item) => item.parent_id === 0);
  const [isLoadEdit, setIsLoadEdit] = useState();
  const dateFormat = "YYYY/MM/DD";
  const [formRef] = Form.useForm();
  useEffect(() => {
    formRef.setFieldsValue({
      name: record?.name,
      phone: record?.phone,
      email: record?.email,
      gender: record?.gender,
      birthday: dayjs(record?.birthday),
      // customertype_id: record?.customertype_id,
      // branch_id: record?.stores.map((item) => item.id),
      address_info: record?.address_info,
    });
  }, [record, formRef]);
  const formAddressRef = useRef(null);
  const onFinish = async (fieldsValue) => {
    const formAddressValues = formAddressRef.current?.getFormValues();
    const values = {
      id: record.id,
      ...formAddressValues,
      ...fieldsValue,
      birthday: fieldsValue["birthday"].format("YYYY-MM-DD"),
    };
    setIsLoadEdit(true);
    try {
      await formAddressRef.current?.validateFields();
      const response = await store.dispatch(editCustomer(values));
      if (editCustomer.fulfilled.match(response)) {
        setIsLoadEdit(false);
        await store.dispatch(getListCustomer({ currentPage, pageSize }));
        message.success("Sửa thông tin khách hàng thành công");
        handleCancelEdit();
      } else if (editCustomer.rejected.match(response)) {
        setIsLoadEdit(false);
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
      setIsLoadEdit(false);
      message.error("Có lỗi xảy ra");
    }
  };
  return (
    <div>
      <Modal
        title="Sửa thông tin khách hàng"
        open={isModalOpenEdit}
        footer={null}
        onCancel={handleCancelEdit}
        width={1000}
      >
        <Form
          name="editCustomer"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formRef}
        >
          <Row gutter={[8, 8]} justify={"space-between"}>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Tên khách hàng"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên khách hàng",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn giới tính",
                  },
                ]}
                name="gender"
                label="Giới tính"
              >
                <Select placeholder="Vui lòng chọn giới tính">
                  <Option value="MALE">Nam</Option>
                  <Option value="FEMALE">Nữ</Option>
                  <Option value="OTHER">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
            <Form.Item
                label="Ngày sinh"
                name="birthday"
                rules={[
                  {
                    type: "object",
                    required: true,
                    message: "Vui lòng chọn ngày sinh",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format={dateFormat}
                  placeholder="Ngày sinh"
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
            <Form.Item
                required={false}
                label="Email"
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "Email chưa đúng định dạng !",
                  },
                  {
                    required: false,
                    message: "Vui lòng nhập email!",
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            {/* <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Loại khách hàng"
                name="customertype_id"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại khách hàng",
                  },
                ]}
              >
                <Select
                  options={customertype_id}
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
                  disabled={isLoadAll}
                  placeholder="Vui lòng chọn loại khách hàng"
                />
              </Form.Item>
            </Col> */}
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                required={false}
                name="phone"
                label="Số điện thoại"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng nhập số điện thoại",
                  },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Số điện thoại chưa đúng định dạng!",
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            
          </Row>
          {/* <Form.Item
            label="Danh sách cửa hàng"
            name="branch_id"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn danh sách cửa hàng",
              },
            ]}
          >
           <TreeSelect
              loading={isLoadStoreAll}
              disabled={isLoadStoreAll}
              showSearch
              filterTreeNode={(inputValue, treeNode) => {
                return treeNode.title
                  .toLowerCase()
                  .includes(inputValue.toLowerCase());
              }}
              treeLine
              treeData={options}
            />
          </Form.Item> */}
          <FormAddress ref={formAddressRef} record={record} />
          <Form.Item
            rules={[
              {
                required: true,
                message: "Vui lòng nhập địa chỉ chi tiết",
              },
            ]}
            name="address_info"
            label="Địa chỉ chi tiết"
          >
            <Input placeholder="Nhập địa chỉ chi tiết" />
          </Form.Item>
          <Form.Item>
            <Button
              loading={isLoadEdit}
              type="primary"
              htmlType="submit"
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
