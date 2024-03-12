import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Breadcrumb, Tabs } from "antd";
import LineChart from "./LineChart";
import Barchart from "./Barchart";

const { TabPane } = Tabs;

const Home = () => {
  const [activeTab, setActiveTab] = useState("1");
  const handleTabChange = (key) => {
    setActiveTab(key);
   
  };

  return (
    <div className="home-dashboard">
      <Breadcrumb>
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Tabs activeKey={activeTab} onChange={handleTabChange} type="card">
        <TabPane tab="Line Chart" key="1">
          <LineChart />
        </TabPane>
        <TabPane tab="Bar Chart" key="2">
          <Barchart />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Home;
