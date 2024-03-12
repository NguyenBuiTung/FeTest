import { Form, Input, Select, TreeSelect } from "antd";
import React from "react";

export default function EditTableStaff({
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
          treeData={branchs}
        />
      );
    }
    if (dataIndex === "gender") {
      return (
        <Select
          placeholder="Vui lòng chọn giới tính"
          options={[
            {
              value: "MALE",
              label: "Nam",
            },
            {
              value: "FEMALE",
              label: "Nữ",
            },
            {
              value: "OTHER",
              label: "Khác",
            },
          ]}
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
