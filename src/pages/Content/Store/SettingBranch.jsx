import {
  Breadcrumb,
  Button,
  Divider,
  Form,
  InputNumber,
  Modal,
  Select,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../../../redux/configStore";
import {
  listSettingStore,
  settingStore,
} from "../../../api/storeManger/settingStore";
import { NavLink } from "react-router-dom";
import { SyncOutlined } from "@ant-design/icons";
import { getListStoreAll } from "../../../api/storeManger/store";

export default function SettingBranch() {
  const [form] = Form.useForm();
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
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListStoreAll());
    };
    fetchData();
  }, []);
  const [isLoadConfigSms, setIsLoadConfigSms] = useState();
  const [isLoading, setIsLoading] = useState();
  const onFinish = async (values) => {
    const data = {
      branch_id: values.branch_id,
      payload: {
        accumulate_point: values.accumulate_point,
        use_point: values.use_point,
      },
    };
    setIsLoadConfigSms(true);
    try {
      const response = await store.dispatch(settingStore(data));
      if (settingStore.fulfilled.match(response)) {
        setIsLoadConfigSms(false);
        // await store.dispatch(getInfoConfig());
        message.success("Cập nhật cấu hình thành công");
        form.resetFields();
      } else if (settingStore.rejected.match(response)) {
        setIsLoadConfigSms(false);
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
      setIsLoadConfigSms(false);
      message.error("Có lỗi xảy ra");
    }
  };
  const showSettingBranch = async () => {
    const fields = ["branch_id"];
    const { branch_id } = form.getFieldsValue(fields);
    try {
      setIsLoading(true);
      await form.validateFields(["branch_id"]);
      const response = await store.dispatch(listSettingStore(branch_id));
      setIsLoading(false);
      if (response && response.payload && response.payload.payload) {
        const { accumulate_point, use_point } = response.payload.payload;
        Modal.info({
          title: "Thông tin cài đặt tích điểm",
          content: (
            <>
              <p style={{ color: "#f5222d", fontWeight: 400, fontSize: 18 }}>
                {" "}
                Điểm tích lũy :
                <span>
                  {" "}
                  {accumulate_point.toLocaleString()}
                </span>
              </p>
              <p style={{ color: "#f5222d", fontWeight: 400, fontSize: 18 }}>
                {" "}
                Điểm dùng :
                <span>
                  {" "}
                  {use_point.toLocaleString()}
                </span>
              </p>
            </>
          ),
        });
      } else {
       message.error("Không có dữ liệu")
      }
    } catch (error) {
      setIsLoading(false);
      // console.log("Error:", error);
      // Handle validation errors or API call failures here
    }
  };
  
  return (
    <>
      <h2>Cài đặt tích điểm</h2>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/setting-branch">Cài đặt tích điểm</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Divider />
      <div className="setting-branch">
        <Form
          form={form}
          name="branch-setting"
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
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
          <Button
            style={{ marginBottom: 10 }}
            type="primary"
            onClick={showSettingBranch}
            loading={isLoading}
          >
            Xem cài đặt
          </Button>
          <Form.Item
            label="Điểm tích lũy"
            name="accumulate_point"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điểm",
              },
            ]}
          >
            <InputNumber
              placeholder="Điểm khách hàng=Số tiền/Điểm tích lũy"
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            label="Điểm dùng"
            name="use_point"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điểm",
              },
            ]}
          >
            <InputNumber placeholder="Số tiền giảm khi sử dụng điểm giao dịch=Điểm dùng*Điểm khách hàng"
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item>
            <Button
              style={{
                padding: "9px 36px",
                height: "auto",
                fontSize: "16px",
                fontWeight: "500",
                width: "100%",
              }}
              icon={<SyncOutlined />}
              loading={isLoadConfigSms}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Lưu cài đặt
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
