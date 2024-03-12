import { Button, Result } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

export default function Page404() {
  const { user } = useSelector((state) => state.persistedReducer.user);
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi,trang không tồn tại"
      extra={
        user?.data.type === "CUSTOMER" ? (
          <NavLink to={"/customer-see"}>
            <Button type="primary">Quay về trang chủ</Button>
          </NavLink>
        ) : (
          <NavLink to={"/"}>
            <Button type="primary">Quay về trang chủ</Button>
          </NavLink>
        )
      }
    />
  );
}
