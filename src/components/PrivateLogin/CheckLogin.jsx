import React from "react";
import { settings } from "../../utils/config";
import { Navigate, Outlet } from "react-router-dom";

export default function CheckLogin() {
  const isCustomer = settings?.getCookie("type_user") === "CUSTOMER";
  const hasAccessToken = settings?.getCookie("access_token");

  if (hasAccessToken && isCustomer) {
    return <Navigate to="/customer-see" />;
  } else if (hasAccessToken && !isCustomer) {
    return <Navigate to="/" />;
  } else {
    return <Outlet />;
  }
}
