import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";
import { menuItems, rootSubmenuKeys } from "./Slider/adminmenu";
import HeaderConek from "./Header/HeaderConek";
const { Header, Sider, Content } = Layout;
const headerStyle = {
  color: "#fff",
  height: 64,
  lineHeight: "64px",
  backgroundColor: "#FFFFFF",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: " 0px 2px 4px 0px rgba(0, 0, 0, 0.10)",
  width: "100%",
  zIndex: 1000,
};

export default function Body() {
  const [collapsed, setCollapsed] = useState(false);
  const onClick = (e) => {
    // navigate(e.key);
  };
  const [openKeys, setOpenKeys] = useState(["home"]);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  return (
    <div className="body">
      <Layout style={{ height: "100vh" }}>
        <Header style={headerStyle}>
          <HeaderConek />
        </Header>
        <Layout style={{ backgroundColor: "white" }}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={210}
            style={{
              backgroundColor: "#FFFFFF",
              overflowY: "auto",
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div className="demo-logo-vertical" />
            <Menu
              onClick={onClick}
              style={{ backgroundColor: "#FFFFFF", borderInlineEnd: "none" }}
              mode="inline"
              inlineIndent={10}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
            >
              {renderMenuItems(menuItems)}
            </Menu>
          </Sider>
          <Content
            style={{
              padding: 10,
              minHeight: 280,
              background: "#f6f6f6",
              overflowY: "auto",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export function renderMenuItems(items) {
  return items
    .map((item) => {
      if (item.children) {
        const subMenuItems = renderMenuItems(item.children);
        if (subMenuItems.some((subItem) => subItem !== null)) {
          return (
            <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
              {subMenuItems}
            </Menu.SubMenu>
          );
        }
      } else {
        return (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        );
      }
      return null;
    })
    .filter((item) => item !== null);
}
