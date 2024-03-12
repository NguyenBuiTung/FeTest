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
  // TreeSelect,
  message,
} from "antd";
import React, { useRef, useState } from "react";
import FormAddress from "./FormAddress";
import { store } from "../../../redux/configStore";
import {
  checkPhoneCustomer,
  createCustomer,
  getListCustomer,
} from "../../../api/customer/customer";
import { debounce } from "lodash";
const { Option } = Select;
export default function FormAddCustomer({
  isModalOpen,
  handleCancel,
  currentPage,
  pageSize,
}) {
  // const { listRankAll, isLoadingAll } = useSelector(
  //   (state) => state.persistedReducer.rankCustomer
  // );
  const [isLoadCreate, setIsLoadCreate] = useState();
  // const allRank = listRankAll?.data.map((item) => {
  //   return {
  //     value: item.id,
  //     label: item.name,
  //   };
  // });
  // const data = transformData(allListStore?.data);
  // const options = data?.filter((item) => item.parent_id === 0);
  const [formRef] = Form.useForm();
  const handleResetFormAddress = () => {
    if (formAddressRef.current) {
      formAddressRef.current.resetFields();
    }
  };
  const formAddressRef = useRef(null);
  const onFinish = async (fieldsValue) => {
    const formAddressValues = formAddressRef.current?.getFormValues();
    const values = {
      ...formAddressValues,
      ...fieldsValue,
      birthday: fieldsValue["birthday"].format("YYYY-MM-DD"),
    };
    console.log(values);
    setIsLoadCreate(true);
    try {
      await formAddressRef.current?.validateFields();
      const response = await store.dispatch(createCustomer(values));
      if (createCustomer.fulfilled.match(response)) {
        if (response.payload.data.original) {
          setIsLoadCreate(false);
          message.error(response.payload.data.original.message);
        } else {
          message.success("Thêm khách hàng thành công");
          await store.dispatch(getListCustomer({ currentPage, pageSize }));
          formRef.resetFields();
          handleResetFormAddress();
          handleCancel();
          setIsLoadCreate(false);
        }
      } else if (createCustomer.rejected.match(response)) {
        setIsLoadCreate(false);
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
      setIsLoadCreate(false);
    }
  };
  const handlePhoneFormatter = (value) => {
    // Thay thế chữ số 0 bằng 84 nếu giá trị bắt đầu bằng 0
    return value.replace(/^0/, "84");
  };

  const handlePhoneParser = (value) => {
    // Loại bỏ tất cả các dấu phẩy và ký tự không phải số
    return value.replace(/[^0-9]/g, "");
  };
  const destroyAll = () => {
    Modal.destroyAll();
  };
  const handleCheckPhone = async (value) => {
    // console.log(value);
    if (!value) {
      return; // Skip validation for empty values
    }
    const data = { phone: value };
    const response = await store.dispatch(checkPhoneCustomer(data));
    // console.log(response);
    const createCustomerCheck = async () => {
      const {
        name,
        phone,
        email,
        gender,
        birthday,
        customertype_id,
        address_info,
        address: { province_id, district_id, ward_id },
      } = response.payload;
      const customerData = {
        name,
        phone,
        email,
        gender,
        birthday,
        customertype_id,
        address_info,
        province_id,
        district_id,
        ward_id,
      };
      try {
        const responseData = await store.dispatch(createCustomer(customerData));
        if (createCustomer.fulfilled.match(responseData)) {
          message.success("Thêm khách hàng thành công");
          await store.dispatch(getListCustomer({ currentPage, pageSize }));
          formRef.resetFields();
          handleCancel();
          destroyAll();
        } else if (createCustomer.rejected.match(responseData)) {
          if (responseData.payload.errors) {
            Object.entries(responseData.payload.errors).forEach(
              ([field, errorMessages]) => {
                errorMessages.forEach((errorMessage) => {
                  message.error(errorMessage);
                });
              }
            );
          }

          if (responseData.payload.message) {
            message.error(responseData.payload.message);
          }
        }
      } catch (error) {
        message.error("Có lỗi xảy ra");
      }
    };
    if (response.payload !== false) {
      Modal.warning({
        title: "Khách hàng đã có trên hệ thống ?",
        content: (
          <Button
            onClick={createCustomerCheck}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Thêm khách hàng
          </Button>
        ),
        footer: (
          <div style={{ textAlign: "end" }}>
            <Button type="primary" danger onClick={destroyAll}>
              Tắt
            </Button>
          </div>
        ),
      });
    }
  };
  const debouncedHandleCheckPhone = debounce(handleCheckPhone, 100);
  return (
    <div>
      <Modal
        title="Thêm khách hàng"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        width={700}
      >
        <Form
          name="addCustomer"
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
                <Input placeholder="Tên" />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại",
                  },
                  {
                    pattern: /^\84[0-9]{9}$/,
                    message: "Số điện thoại chưa đúng định dạng!",
                  },
                ]}
              >
                <InputNumber
                  onChange={(value) => {
                    const fieldValue = formRef.getFieldValue("phone");
                    if (
                      fieldValue &&
                      fieldValue.toString().match(/^\84[0-9]{9}$/)
                    ) {
                      debouncedHandleCheckPhone(value);
                    }
                  }}
                  style={{ width: "100%" }}
                  formatter={handlePhoneFormatter}
                  parser={handlePhoneParser}
                  placeholder="Nhập số điện thoại"
                />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "Email chưa đúng định dạng !",
                  },
                  {
                    required: false,
                    // message: "Vui lòng nhập email!",
                  },
                ]}
              >
                <Input placeholder="email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} justify={"space-between"}>
            {/* <Col xl={8} lg={8} md={8} sm>
              <Form.Item
                label="Hạng thành viên"
                name="customertype_id"
                rules={[
                  {
                    required: false,
                    message: "Vui lòng chọn loại khách hàng",
                  },
                ]}
              >
                <Select
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
            </Col> */}
            <Col xl={12} lg={12} md={12} sm>
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
                <DatePicker style={{ width: "100%" }} placeholder="Ngày sinh" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
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
          </Row>
          {/* <Form.Item
            label="Cửa hàng"
            name="branch_id"
            rules={[{ required: true, message: "Vui lòng chọn cửa hàng" }]}
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
          <FormAddress ref={formAddressRef} />
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
              loading={isLoadCreate}
              type="primary"
              htmlType="submit"
              icon={<PlusCircleOutlined />}
            >
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
