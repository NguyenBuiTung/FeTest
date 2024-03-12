import { Spin } from "antd";
import React, { useEffect } from "react";
import NProgress from "nprogress";
import { useNavigate } from "react-router-dom";
import "nprogress/nprogress.css";
import BrandLogo from "../../assets/img/BrandLogo.png";
export default function LoadingProgress() {
  const navigate = useNavigate();
  useEffect(() => {
    NProgress.start();
    NProgress.inc();
    NProgress.configure({
      showSpinner: true,
      easing: "ease",
      speed: 700,
      trickleSpeed: 500,
    });
    NProgress.done();
  }, [navigate]);
  return (
    <div className="loader">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{textAlign:"center"}}>
          {/* <img  style={{ width: 160,display:"block",marginBottom:10 }} src={BrandLogo} alt="" /> */}
          <Spin size="default"></Spin>
        </div>
      </div>
    </div>
  );
}
