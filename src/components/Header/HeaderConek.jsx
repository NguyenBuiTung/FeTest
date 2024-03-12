import React, { useEffect, useState } from "react";
import imgGoogle from "../../assets/img/imgGoogle.png";
import { NavLink } from "react-router-dom";
import { persistor, store } from "../../redux/configStore";
import { settings } from "../../utils/config";
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Dropdown,
  Flex,
  Popconfirm,
  Spin,
  message,
  notification,
} from "antd";
import {
  BellOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getAllUser, getInfoUser } from "../../api/User/infoUser";
import { useSelector } from "react-redux";
import { logoutUser } from "../../api/login/login";
export default function HeaderConek() {
  const { user, loadUser } = useSelector(
    (state) => state.persistedReducer.user
  );
  const [open, setOpen] = useState(false);
  const [openHeader, setOpenHeader] = useState(false);
  const showDrawer = () => {
    setOpenHeader(true);
  };
  const onClose = () => {
    setOpenHeader(false);
  };
  const handleOpenChange = (flag) => {
    setOpen(flag);
  };
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getInfoUser());
      await store.dispatch(getAllUser());
    };
    fetchData();
  }, []);

  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      message: "Notification Title",
      description:
        "I will never close automatically. This is a purposely very very long description that has many many characters and words.",
      duration: 0,
    });
  };
  const [isLogout,setIsLogout]=useState()
  const logOut = async () => {
    setIsLogout(true)
    try {
      await store.dispatch(logoutUser());
      setIsLogout(false)
      persistor.pause();
      persistor.flush().then(() => {
        settings.delete_cookie("access_token");
        settings.delete_cookie("type_user");
        window.location.href = "/login";
        return persistor.purge();
      });
    } catch (error) {
      setIsLogout(false)
      message.error(error);
    }
  };
  const items = [
    {
      label: <p>{user?.data.email === null ? "Không có email" : user?.data.email}</p>,
      key: "0",
    },
    {
      label: <p>{user?.data.phone}</p>,
      key: "1",
    },
    {
      label: (
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={logOut}
          danger
        >
          Đăng xuất
        </Button>
      ),
      key: "3",
    },
  ];
  const userAvatar = user?.data?.avatar
    ? `${process.env.REACT_APP_API_URL}/${user.data.avatar}`
    : null;
  return (
    <>
      <Flex gap="middle" align="center" justify="center">
        {user?.data.type === "CUSTOMER" ? (
          <NavLink to={"/customer-see"} style={{ display: "flex" }}>
            <img style={{ width: "117px" }} src={imgGoogle} alt="logo" />
          </NavLink>
        ) : (
          <NavLink to={"/"} style={{ display: "flex" }}>
            <img style={{ width: "117px" }} src={imgGoogle} alt="logo" />
          </NavLink>
        )}
      </Flex>
      <Button type="text" onClick={showDrawer} className="menu-button">
        <MenuOutlined style={{ fontSize: 20 }} />
      </Button>
      {/* Responsive */}
      <Drawer
        title="Thông tin người dùng"
        placement="left"
        onClose={onClose}
        open={openHeader}
      >
        <Flex justify="flex-start" gap={"middle"} vertical>
          <Flex align="center" justify="space-between" gap={10}>
            <Avatar
              style={{ cursor: "pointer" }}
              size={40}
              src={userAvatar}
              icon={user?.data?.avatar ? null : <UserOutlined />}
            />
            <p style={{ color: "#000" }}>
              {user?.data.type === "STAFF" ||
              user?.data.type === "BRANCH_MANAGER" ||
              user?.data.type === "CUSTOMER" ? (
                <NavLink style={{ color: "#1677ff" }} to={"editUser"}>
                 Nguyễn Bùi Tùng
                </NavLink>
              ) : (
                <NavLink style={{ color: "#1677ff" }} to={"editUser"}>
                   Nguyễn Bùi Tùng
                </NavLink>
              )}
            </p>
            {contextHolder}
            <Button type="text" onClick={openNotification}>
              <Badge count={5}>
                <BellOutlined
                  style={{ fontSize: 17, verticalAlign: "middle" }}
                />
              </Badge>
            </Button>
          </Flex>
          <Flex align="flex-start" gap={10} justify="center" vertical>
            <p>Email: {user?.data.email}</p>
            <p>Số điện thoại: {user?.data.phone}</p>
            <Popconfirm
              title="Bạn có chắc chắn muốn đăng xuất?"
              onConfirm={logOut}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button type="primary" icon={<LogoutOutlined />} danger>
                Đăng xuất{" "}
              </Button>
            </Popconfirm>
          </Flex>
        </Flex>
      </Drawer>
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
            {loadUser ? (
              <Spin size="small" />
            ) : user?.data.type === "STAFF" ||
              user?.data.type === "BRANCH_MANAGER" ||
              user?.data.type === "CUSTOMER" ? (
              <NavLink style={{ color: "#1677ff" }} to={"editUser"}>
                 Nguyễn Bùi Tùng
              </NavLink>
            ) : (
              <NavLink style={{ color: "#1677ff" }} to={"editUser"}>
                 Nguyễn Bùi Tùng
              </NavLink>
            )}
          </p>
          <Flex align="center" justify="space-between">
            {user?.data && (
              <>
                <Dropdown
                  menu={{
                    items,
                  }}
                  trigger={["click"]}
                  onOpenChange={handleOpenChange}
                  open={open}
                >
                  <div style={{ lineHeight: "20px", marginRight: "10px" }}>
                    <Avatar
                      style={{ cursor: "pointer" }}
                      size={40}
                      icon={user?.data?.avatar ? null : <UserOutlined />}
                      src={userAvatar}
                    />
                  </div>
                </Dropdown>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
