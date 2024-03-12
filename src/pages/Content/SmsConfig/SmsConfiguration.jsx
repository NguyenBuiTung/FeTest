import React, { useState } from "react";
import { Button, ColorPicker, DatePicker, Form, Input } from "antd";

const { RangePicker } = DatePicker;

export default function SmsConfiguration() {
  const [form] = Form.useForm();
  const [inputColor, setInputColor] = useState(""); // State lưu trữ màu cho input
  const [buttonVisible, setButtonVisible] = useState(false); // State xác định việc hiển thị button Save

  const handleColorChange = (color) => {
    setInputColor(color);
    form.setFieldsValue({ "color-picker": color }); // Thiết lập giá trị màu cho input
  };

  const handleInputChange = () => {
    setButtonVisible(true); // Khi có sự thay đổi trong input, hiển thị button Save
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const validateInput = (_, value) => {
    if (!value) {
      return Promise.reject("Vui lòng nhập giá trị!");
    }
    return Promise.resolve();
  };

  return (
    <div className="editUser">
      <h2 style={{ marginBottom: 20 }}>Cấu hình</h2>
      <Form
        name="validate_other"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
        form={form}
        onValuesChange={handleInputChange} // Khi có sự thay đổi trong form, gọi hàm handleInputChange
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ validator: validateInput }]}
        >
          <Input placeholder="Plain Text" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email", message: "Email không hợp lệ!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item required={true} label="Thời gian">
          <RangePicker />
        </Form.Item>
        <Form.Item
          name="color-picker"
          label="ColorPicker"
          rules={[
            {
              required: true,
              message: "color is required!",
            },
          ]}
        >
          <ColorPicker onChange={handleColorChange} />
        </Form.Item>
        <Form.Item>
          {buttonVisible && ( // Hiển thị button Save nếu buttonVisible là true
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}
