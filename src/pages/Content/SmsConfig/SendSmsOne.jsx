import {
  Button,
  Dropdown,
  Flex,
  Form,
  Input,
  Menu,
  Select,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../../../redux/configStore";
import { sentsmsone } from "../../../api/ConfigSms/smsConfig";
import { FileOutlined, SendOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { getListCustomerAll } from "../../../api/customer/customer";
const { Option } = Select;

export default function SendSmsOne() {
  const { allListCustomer, isLoadAllCustomer } = useSelector(
    (state) => state.persistedReducer.customer
  );

  const customerOptions = allListCustomer?.data.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListCustomerAll());
    };
    fetchData();
  }, []);
  const [form] = Form.useForm();
  const [isLoadSentSms, setIsLoadSentSms] = useState();
  const onFinish = async (values) => {
    if (!parameterValue.trim()) {
      message.error("Vui lòng nhập nội dung tin nhắn ");
      return;
    }
    const updatedValues = { ...values, message: parameterValue };
    console.log("Updated values:", updatedValues);
    setIsLoadSentSms(true);
    try {
      const response = await store.dispatch(sentsmsone(updatedValues));
      if (sentsmsone.fulfilled.match(response)) {
        setIsLoadSentSms(false);
        // await store.dispatch(getInfoConfig());
        message.success("Thao tác thành công");
      } else if (sentsmsone.rejected.match(response)) {
        setIsLoadSentSms(false);
        if (response.payload.error) {
          setIsLoadSentSms(false);
          message.error(response.payload.error);
        }
      }
    } catch (error) {
      setIsLoadSentSms(false);
      message.error("Có lỗi xảy ra");
    }
  };
  const variableLabels = [
    { label: "Số điện thoại khách hàng", value: "{customer_phone}" },
    { label: "Tên khách hàng", value: "{customer_name}" },
    { label: "Ngày sinh khách hàng", value: "{customer_birthday}" },
    { label: "Email khách hàng", value: "{customer_email}" },
  ];
  const [parameterValue, setParameterValue] = useState("");
  const [showVariables, setShowVariables] = useState(false);
  const handleParameterClick = () => {
    setShowVariables(!showVariables);
  };

  const handleVariableClick = (variable) => {
    const newValue = parameterValue
      ? `${parameterValue} ${variable}`
      : variable;
    setParameterValue(newValue.trim()); // Loại bỏ dấu cách ở đầu và cuối chuỗi
    setShowVariables(false);
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setParameterValue(text);
  };
  const menu = (
    <Menu>
      {variableLabels.map((variable, index) => (
        <Menu.Item
          key={index}
          onClick={() => handleVariableClick(variable.value)}
        >
          {variable.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Form
      form={form}
      name="configsms"
      onFinish={onFinish}
      layout="vertical"
      requiredMark=""
    >
      <Form.Item
        name="customer_id"
        label="Khách hàng"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn khách hàng",
          },
        ]}
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
          disabled={isLoadAllCustomer}
          placeholder="Vui lòng chọn khách hàng"
          options={customerOptions}
          virtual
        />
      </Form.Item>
      <Form.Item
        label="Loại"
        name="type"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn loại tin nhắn",
          },
        ]}
      >
        <Select placeholder="Vui lòng chọn loại tin nhắn">
          <Option value={true}>Có dấu</Option>
          <Option value={false}>Không dấu</Option>
        </Select>
      </Form.Item>
      <Flex justify="flex-end">
        <Dropdown overlay={menu} trigger={"click"} placement="top">
          <NavLink onClick={handleParameterClick}>
            <FileOutlined /> Tham số
          </NavLink>
        </Dropdown>
      </Flex>
      <Input.TextArea
        style={{ margin: "20px 0" }}
        value={parameterValue}
        onChange={handleInputChange}
        placeholder="Viết gì đó...."
      />
      <Form.Item>
        <Button
          style={{
            padding: "9px 36px",
            height: "auto",
            fontSize: "16px",
            fontWeight: "500",
            width: "100%",
          }}
          loading={isLoadSentSms}
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          Gửi
          <SendOutlined />
        </Button>
      </Form.Item>
    </Form>
  );
}
