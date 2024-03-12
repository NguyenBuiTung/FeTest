import React from "react";
import {
  GiftOutlined,
  HistoryOutlined,
  HomeOutlined,
  MessageOutlined,
  SettingOutlined,
  ShopOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
export const menuItems = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: "Tổng Quan",
    path: "/",
  },
  
  {
    key: "storemanager",
    icon: <UserOutlined />,
    label: "Post Manager",
    path: "/post-manager",
    
  },
  
  
  
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Cài đặt",
    path: "/settings",
  },
 
];
export const rootSubmenuKeys = [
  "home",
  "mcoupon",
  "giaodich",
  "storemanager",
  "customer",
  "settings",
  "info-point-store",
  "customer-see"
];
