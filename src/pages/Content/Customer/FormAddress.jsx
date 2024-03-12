import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { Form, Select, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getDistrict,
  getProvince,
  getWard,
} from "../../../api/customer/listAddress";

const FormAddress = forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { options, option2, option3, loading, loading2, loading3 } =
    useSelector((state) => state.persistedReducer.listAddress);
  const [disableDistrict, setDisableDistrict] = useState(true);
  const [disableWard, setdisableWard] = useState(true);
  const { record } = props;
  useEffect(() => {
    if (!options || options.length === 0) {
      dispatch(getProvince());
    }
  }, [dispatch, options]);
  useEffect(() => {
    if (record && record.address && record.address.province_id) {
      dispatch(getDistrict(record.address.province_id));
    }
  }, [dispatch, record]);

  useEffect(() => {
    if (record && record.address && record.address.district_id) {
      dispatch(getWard(record.address.district_id));
    }
  }, [dispatch, record]);

  useEffect(() => {
    form.setFieldsValue({
      province_id: record?.address.province_id,
      district_id: record?.address.district_id,
      ward_id: record?.address.ward_id,
    });
  }, [record, form]);

  const handleChange = (value) => {
    dispatch(getDistrict(value));
    form.resetFields(["district_id", "ward_id"]);
    setDisableDistrict(false);
    setdisableWard(true);
  };
  const handleChange2 = (value) => {
    dispatch(getWard(value));
    form.setFieldsValue({ ward_id: undefined });
    setdisableWard(false);
  };
  const resetFields = useCallback(() => {
    form.resetFields();
    setDisableDistrict(true);
    setdisableWard(true);
  }, [form]);
  useImperativeHandle(
    ref,
    () => ({
      getFormValues: () => {
        return form.getFieldsValue();
      },
      validateFields: async () => {
        try {
          const values = await form.validateFields();
          return values;
        } catch (errorInfo) {
          return Promise.reject(errorInfo.errorFields);
        }
      },
      resetFields,
    }),
    [form, resetFields]
  );

  return (
    <div>
      <Form form={form} layout="vertical" requiredMark="">
        <Form.Item
          label="Tỉnh/Thành"
          name="province_id"
          rules={[{ required: true, message: "Vui lòng chọn tỉnh thành" }]}
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
            onChange={handleChange}
            placeholder="Vui lòng chọn tỉnh thành phố"
            disabled={loading}
            options={options}
          ></Select>
          {loading2 && (
            <Spin tip="Loading">
              <div className="content" />
            </Spin>
          )}
        </Form.Item>
        <Form.Item
          label="Quận/Huyện"
          name="district_id"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn quận huyện",
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
            onChange={handleChange2}
            placeholder="Vui lòng chọn quận huyện"
            disabled={disableDistrict || loading}
            options={option2}
          ></Select>
          {loading3 && (
            <Spin tip="Loading">
              <div className="content" />
            </Spin>
          )}
        </Form.Item>
        <Form.Item
          label="Xã/Phường"
          name="ward_id"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn xã phường",
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
            placeholder="Vui lòng chọn xã phường"
            disabled={disableWard || loading}
            options={option3}
          ></Select>
        </Form.Item>
      </Form>
    </div>
  );
});

export default FormAddress;
