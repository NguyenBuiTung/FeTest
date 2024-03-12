import { Form, Input, InputNumber, Select } from "antd";
import React from "react";

export default function EditTableRank({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  branchs,
  isLoadStoreAll,
  ...restProps
}) {
  const renderCellContent = (dataIndex) => {
    if (dataIndex === "branch") {
      return (
        <Select
          loading={isLoadStoreAll}
          disabled={isLoadStoreAll}
          showSearch
          filterTreeNode={(inputValue, treeNode) => {
            return treeNode.title
              .toLowerCase()
              .includes(inputValue.toLowerCase());
          }}
          //   treeLine
          options={branchs}
        />
      );
    }
    if (dataIndex === "purchase_amount") {
      return (
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        />
      );
    }
    return <Input />;
  };
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Vui lòng nhập ${title}!`,
            },
          ]}
        >
          {renderCellContent(dataIndex)}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}
