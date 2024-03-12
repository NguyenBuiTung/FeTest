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
import { store } from "../../../redux/configStore";
import {
  getInfoConfig,
  updateConfigSms,
} from "../../../api/ConfigSms/smsConfig";
import { useSelector } from "react-redux";
export default function Config({
  isModalOpen,
  handleCancel,
  currentPage,
  pageSize,
}) {
  const [form] = Form.useForm();
  const [isLoadConfigSms, setIsLoadConfigSms] = useState();
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
  const onFinish = async (values) => {
    console.log(values);
    setIsLoadConfigSms(true);
    try {
      const response = await store.dispatch(updateConfigSms(values));
      const { code } = response.payload;
      const numericCode = parseFloat(code);
      setIsLoadConfigSms(false);
      switch (numericCode) {
        case 0:
          message.success("Cấu hình thành công");
          break;
        case 1:
          message.error("Ngoại lệ hệ thống");
          break;
        case 2:
          message.error("Đầu vào không hợp lệ");
          break;
        case 3:
          message.error("Tên người dùng hoặc mật khẩu không hợp lệ");
          break;
        case 4:
          message.error(" Tài khoản không hoạt động");
          break;
        case 5:
          message.error("Số di động không hợp lệ");
          break;
        case 6:
          message.error("Điện thoại gửi tin nhắn bị lặp");
          break;
        case 7:
          message.error("Tài khoản không đủ hạn ngạch");
          break;
        case 8:
          message.error("Tên thương hiệu không hoạt động theo tài khoản");
          break;
        case 11:
          message.error("Thời gian gửi có định dạng ‘yyyyMMddHHmmss");
          break;
        case 12:
          message.error("Thời gian gửi không được nhỏ hơn thời gian hiện tại");
          break;
        default:
          message.error("Mã lỗi không xác định");
          break;
      }
      form.resetFields()
      handleCancel()
      await store.dispatch(getInfoConfig({currentPage,pageSize}));
    } catch (error) {
      setIsLoadConfigSms(false);
      message.error("Có lỗi xảy ra");
    }
  };

  return (
    <Modal
      title="Thêm tài khoản"
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        name="configsms"
        onFinish={onFinish}
        layout="vertical"
        requiredMark=""
      >
        <Row gutter={[8,8]}>
        <Col xl={12} lg={12} md={12} sm={24}>
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
        </Col>
        <Col xl={12} lg={12} md={12} sm={24}>
        <Form.Item
          label="Tên tài khoản"
          name="username"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên tài khoản",
            },
          ]}
        >
          <Input placeholder="Vui lòng nhập tên tài khoản" />
        </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24}>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu",
            },
          ]}
        >
          <Input.Password placeholder="Vui lòng nhập mật khẩu" />
        </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24}>
        <Form.Item
          name="branchname"
          label="Tên cửa hàng"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên cửa hàng",
            },
          ]}
        >
          <Input  placeholder="Nhập BranchName"/>
        </Form.Item>
        </Col>
        </Row>
        <Form.Item>
          <Button
            style={{
              padding: "9px 36px",
              height: "auto",
              fontSize: "16px",
              fontWeight: "500",
              width: "100%",
            }}
            loading={isLoadConfigSms}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
