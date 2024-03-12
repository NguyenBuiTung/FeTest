import {
  CloudUploadOutlined,
  InboxOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
  Upload,
  message,
} from "antd";
import React, { useState } from "react";
import { store } from "../../../../redux/configStore";
import { useSelector } from "react-redux";
import {
  createRankCustomer,
  getListRank,
} from "../../../../api/customer/rankcustomer/rankcustomer";
import { settings } from "../../../../utils/config";

export default function FormAddRankCustomer({
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
  const baseUrl = process.env.REACT_APP_API_URL;
  const [isLoading, setIsLoading] = useState();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [form] = Form.useForm();
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Bạn chỉ có thể tải lên tệp JPG/PNG!");
    }
    const isLt2M = file.size / 1024 < 100;
    if (!isLt2M) {
      message.error("Hình ảnh phải nhỏ hơn 100KB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = async (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, async (url) => {
        setLoading(false);
        setImageUrl(url);
        try {
          message.success("Tải ảnh lên thành công");
        } catch (error) {
          // Xử lý lỗi khi getInfoUser() thất bại
        }
      });
    } else if (info.file.status === "error") {
      setLoading(false);
      message.error("Lỗi khi tải ảnh lên");
      // Xử lý các hành động cần thiết khi upload thất bại
    }
  };
  const onFinish = async (values) => {
    setIsLoading(true);
    const data = {
      avatar: values.avatar.file.response.file,
      branch_id: values.branch_id,
      name: values.name,
      purchase_amount: values.purchase_amount,
    };
    try {
      const response = await store.dispatch(createRankCustomer(data));
      if (createRankCustomer.fulfilled.match(response)) {
        await store.dispatch(getListRank({ currentPage, pageSize }));
        setIsLoading(false);
        message.success("Thêm phân hạng thành công");
        form.resetFields();
        setImageUrl(null)
        handleCancel();
      } else if (createRankCustomer.rejected.match(response)) {
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
        title="Tạo hạng thành viên"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="addRankCustomer"
          onFinish={onFinish}
          layout="vertical"
        >
          <Row gutter={[8, 8]} justify={"space-between"}>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                label="Tên hạng"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên hạng",
                  },
                ]}
              >
                <Input placeholder="Vui lòng nhập loại khách hàng" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm>
              <Form.Item
                name="purchase_amount"
                label="Số tiền giao dịch"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số tiền",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Số tiền"
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="avatar" showUploadList={false} noStyle>
            <Upload.Dragger
              name="file"
              showUploadList={false}
              action={`${baseUrl}/mcoupon/api/v1/upload`}
              headers={{
                Authorization: `Bearer ${settings.getCookie("access_token")}`,
              }}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              <Flex justify="space-around">
                <Flex align="center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{
                        width: "102px",
                        height: "102px",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <Button type="primary" icon={<CloudUploadOutlined />}>
                      Tải lên{" "}
                    </Button>
                  )}
                  {loading && <Spin className="spin-overlay" />}
                </Flex>
                <Flex vertical align="center">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p> Kéo thả ảnh vào đây hoặc tải lên</p>
                </Flex>
              </Flex>
            </Upload.Dragger>
          </Form.Item>
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
              Thêm hạng thành viên
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
