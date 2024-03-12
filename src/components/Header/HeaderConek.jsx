import React, {  useState } from "react";
import imgGoogle from "../../assets/img/imgGoogle.png";
import { NavLink } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Flex,

  notification,
} from "antd";
import {
  BellOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
export default function HeaderConek() {
  const [open, setOpen] = useState(false);
  const [openHeader, setOpenHeader] = useState(false);
  const showDrawer = () => {
    setOpenHeader(true);
  };
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      message: "Notification Title",
      description:
        "I will never close automatically. This is a purposely very very long description that has many many characters and words.",
      duration: 0,
    });
  };

  return (
    <>
      <Flex gap="middle" align="center" justify="center">
        <img style={{ width: "117px" }} src={imgGoogle} alt="logo" />
      </Flex>
      <Button type="text" onClick={showDrawer} className="menu-button">
        <MenuOutlined style={{ fontSize: 20 }} />
      </Button>
      {/* Responsive */}

      {/* End */}
      <Flex
        className="header-content"
        gap={"middle"}
        align="center"
        justify="space-between"
      >
        <Flex
          align="center"
          justify="space-between"
          gap={"middle"}
          className="header_right"
        >
          {contextHolder}
          <Button type="text" onClick={openNotification}>
            <Badge count={5}>
              <BellOutlined style={{ fontSize: 17, verticalAlign: "middle" }} />
            </Badge>
          </Button>
          <p style={{ color: "#000" }}>
            <NavLink style={{ color: "#1677ff" }} to={"editUser"}>
              Nguyễn Bùi Tùng
            </NavLink>
          </p>
          <Flex align="center" justify="space-between">
            <Avatar
              style={{ cursor: "pointer" }}
              size={40}
              icon={<UserOutlined />}
              src={null}
            />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
