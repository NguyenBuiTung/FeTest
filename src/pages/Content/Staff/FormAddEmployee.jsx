import React, { useState } from "react";
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
  TreeSelect,
  message,
} from "antd";
import { useSelector } from "react-redux";
import { store } from "../../../redux/configStore";
import { createStaff, getListStaff } from "../../../api/staff/staff";
import { transformData } from "../../../utils/recursive";
const { Option } = Select;

export default function FormAddEmployee({
  isModalOpen,
  handleCancel,
  currentPage,
  pageSize,
}) {
  const [form] = Form.useForm();
  const [isLoadCreateStaff, setIsLoadCreateStaff] = useState(false);
  const { allListStore, isLoadStoreAll } = useSelector(
    (state) => state.persistedReducer.storeManager
  );
  const { user } = useSelector((state) => state.persistedReducer.user);
  const data = transformData(allListStore?.data);
  const options = data?.filter((item) => item.parent_id === 0);
  const onFinish = async (fieldsValue) => {
    const values = {
      ...fieldsValue,
      birth_day: fieldsValue["birth_day"].format("YYYY-MM-DD"),
    };
    console.log(values)
    setIsLoadCreateStaff(true);
    try {
      const response = await store.dispatch(createStaff(values));
      if (createStaff.fulfilled.match(response)) {
        setIsLoadCreateStaff(false);
        message.success("Thêm thành công");
        await store.dispatch(getListStaff({ currentPage, pageSize }));
        form.resetFields();
        handleCancel();
      } else if (createStaff.rejected.match(response)) {
        setIsLoadCreateStaff(false);
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
      setIsLoadCreateStaff(false);
      message.error("Có lỗi xảy ra");
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
  // const [showTypeSelect, setShowTypeSelect] = useState(false);
  // const [selectedBranch, setSelectedBranch] = useState(null);
  // const handleTreeSelectChange = (value, label, extra) => {
  //   const { triggerNode } = extra;
  //   // Kiểm tra nếu người dùng chọn một mục con (children) trong TreeSelect
  //   if (triggerNode.props && triggerNode.props.parent_id !== 0) {
  //     setSelectedBranch(value); // Lưu giá trị cụm con được chọn
  //     setShowTypeSelect(true); // Hiển thị Select type
  //   } else {
  //     setSelectedBranch(null); // Không chọn cụm con, đặt giá trị null
  //     setShowTypeSelect(false); // Ẩn Select type
  //   }
  // };
  return (
    <div>
      <Modal
        title="Thêm nhân viên"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          name="addStaffs"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={form}
        >
          <Row gutter={[8, 8]} justify={"space-between"}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Họ và tên"
                name="full_name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập họ và tên",
                  },
                  // {
                  //   pattern: /^[^\s]+$/,
                  //   message: "Không được chứa dấu cách",
                  // },
                ]}
              >
                <Input placeholder="Họ và tên" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại!",
                },
                {
                  pattern: /^\84[0-9]{9}$/,
                  message: "Số điện thoại chưa đúng định dạng!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={handlePhoneFormatter}
                parser={handlePhoneParser}
                placeholder="Nhập số điện thoại"
              />
            </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]} justify={"space-between"}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                rules={[
                  {
                    type: "email",
                    message: "Email chưa đúng định dạng",
                  },
                  {
                    required: true,
                    message: "Vui lòng email",
                  },
                ]}
                name="email"
                label="Email"
              >
                <Input placeholder="Emai" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Ngày sinh"
                name="birth_day"
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
          </Row>
          <Row gutter={[8, 8]} justify={"space-between"}>
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
                <Select  placeholder="Vui lòng chọn giới tính">
                  <Option value="MALE">Nam</Option>
                  <Option value="FEMALE">Nữ</Option>
                  <Option value="OTHER">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              {user?.data.type !== "BRANCH_MANAGER" && (
                <Form.Item
                  label="Cửa hàng"
                  name="branch_id"
                  rules={[
                    { required: true, message: "Vui lòng chọn cửa hàng" },
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
                    // onChange={handleTreeSelectChange}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
          {/* {showTypeSelect &&
            selectedBranch && */
            (user?.data.type === "ADMIN" || user?.data.type === "SHOP") && (
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn quản lý hoặc nhân viên",
                  },
                ]}
                name="type"
                label="Tài khoản cho"
              >
                <Select placeholder="Vui lòng chọn quản lý hoặc nhân viên">
                  <Select.Option value="BRANCH_MANAGER">Quản lý</Select.Option>
                  <Select.Option value="STAFF">Nhân viên</Select.Option>
                </Select>
              </Form.Item>
            )}
          <Form.Item>
            <Button
              loading={isLoadCreateStaff}
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
