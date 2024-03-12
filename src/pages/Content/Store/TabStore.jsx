import { Breadcrumb } from "antd";
import React from "react";
import { NavLink } from "react-router-dom";
import StoreManger from "./StoreManger";

export default function TabStore() {
  return (
    <div className="tabStore">
      <h2>Quản lý cửa hàng</h2>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/store-manager">Cửa hàng</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <StoreManger />
    </div>
  );
}
