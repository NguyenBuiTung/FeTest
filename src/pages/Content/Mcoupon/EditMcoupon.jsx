import { SyncOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Modal, Select, message } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editPro, getLsPrCoupon } from "../../../api/mcoupon/listTable";
const { RangePicker } = DatePicker;
export default function EditMcoupon({
  isModalOpenEdit,
  handleCancelEdit,
  currentPage,
  pageSize,
  record,
}) {
  const dispatch = useDispatch();
  const [formRef] = Form.useForm();
  const { user } = useSelector((state) => state.persistedReducer.user);
  const { allListStore, isLoadStoreAll } = useSelector(
    (state) => state.persistedReducer.storeManager
  );
  const [isEditLoading, setEditLoading] = useState();
  const { allListGroupCustomer, isLoadAllGroupCustomer } = useSelector(
    (state) => state.persistedReducer.groupCustomer
  );
  const customertype_id = allListGroupCustomer?.data.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
  const branch = allListStore?.data
    .filter((item) => item.parent_id === 0)
    .map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
  const rangeConfig = {
    rules: [
      {
        type: "array",
        required: true,
        message: "Vui lòng chọn thời gian",
      },
    ],
  };
  const onFinish = async (fieldsValue) => {
    const rangeTimeValue = fieldsValue["datepicker"];
    const values = {
      ...fieldsValue,
      datepicker: [
        rangeTimeValue[0].format("YYYY-MM-DD HH:mm:ss"),
        rangeTimeValue[1].format("YYYY-MM-DD HH:mm:ss"),
      ],
    };
    const data = {
      id: record.id,
      name: values.name,
      start_date: values.datepicker[0],
      end_date: values.datepicker[1],
      sms_template: values.sms_template,
      branch_id:values.branch_id,
      customer_category_ids: values.customer_category_ids,
    };
    setEditLoading(true);
    try {
      const response = await dispatch(editPro(data));
      console.log(response)
      if (editPro.fulfilled.match(response)) {
        setEditLoading(false);
        message.success("Sửa chương trình thành công");
        formRef.resetFields();
        handleCancelEdit();
        await dispatch(getLsPrCoupon({ currentPage, pageSize }));
      } else if (editPro.rejected.match(response)) {
        if (response.payload.errors) {
          setEditLoading(false);
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
      setEditLoading(false);
      console.log(error);
      message.error("Có lỗi xảy ra");
    }
  };
  useEffect(() => {
    if (record) {
      formRef.setFieldsValue({
        name: record?.name,
        datepicker: [dayjs(record?.start_date), dayjs(record?.end_date)],
        branch_id: record?.branch_id,
      });
    }
  }, [record, formRef]);
  return (
    <div>
      <Modal
        title="Sửa chương trình"
        open={isModalOpenEdit}
        footer={null}
        onCancel={handleCancelEdit}
      >
        <Form
          name="editProgram"
          onFinish={onFinish}
          layout="vertical"
          requiredMark=""
          form={formRef}
        >
          <Form.Item
            label="Tên chương trình"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên chương trình",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="datepicker"
            label="Chọn ngày bắt đầu - kết thúc "
            {...rangeConfig}
          >
            <RangePicker
              style={{ width: "100%" }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
          {user?.data.type !== "STAFF" &&
            user?.data.type !== "BRANCH_MANAGER" && (
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
            )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isEditLoading}
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
