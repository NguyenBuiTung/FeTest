import React from "react";
import { useLocation } from "react-router-dom";
import { settings } from "../../utils/config";
import { Navigate, Outlet } from "react-router-dom";

export default function RoutePrivate() {
  const location = useLocation();

  // Các đường dẫn được phép cho khách hàng và không phải khách hàng
  const allowedRoutesForCustomer = ["/customer-see", "/editUser","/info-point-store","/transactions-customer"];
  const allowedRoutesForNotCustomer = ["/customer-see","/info-point-store","/transactions-customer"];

  // Kiểm tra nếu người dùng là khách hàng và có access_token
  const isCustomer = settings?.getCookie("type_user") === "CUSTOMER";
  const hasAccessToken = settings?.getCookie("access_token");
  const currentPath = location.pathname;

  // Kiểm tra và điều hướng người dùng đến các trang phù hợp
  if (isCustomer && hasAccessToken) {
    // Nếu là khách hàng và có access_token
    if (allowedRoutesForCustomer.includes(currentPath)) {
      // Nếu đường dẫn hiện tại trong danh sách đường dẫn cho khách hàng, cho phép truy cập
      return <Outlet />;
    } else {
      // Nếu đường dẫn hiện tại không phù hợp, điều hướng đến trang phù hợp cho khách hàng
      return <Navigate to={"/customer-see"} />;
    }
  } else if (!isCustomer && hasAccessToken) {
    // Nếu không phải là khách hàng
    if (!allowedRoutesForNotCustomer.includes(currentPath)) {
      // Nếu đường dẫn hiện tại không phải là đường dẫn cho người không phải khách hàng, cho phép truy cập
      return <Outlet />;
    } else {
      // Nếu đường dẫn hiện tại là đường dẫn không phù hợp cho người không phải khách hàng, điều hướng về trang chủ
      return <Navigate to={"/"} />;
    }
  } else {
    // Nếu là khách hàng nhưng không có access_token, điều hướng đến trang đăng nhập
    return <Navigate to="/login" />;
  }
}
