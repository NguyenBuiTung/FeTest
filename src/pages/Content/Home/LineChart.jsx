import { Tooltip } from "antd";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export default function SubscriptionLineChart() {
  // Giả sử dữ liệu người đăng ký trong 7 ngày gần nhất
  const data = [
    { day: 'Day 1', subscribers: 100 },
    { day: 'Day 2', subscribers: 120 },
    { day: 'Day 3', subscribers: 140 },
    { day: 'Day 4', subscribers: 110 },
    { day: 'Day 5', subscribers: 130 },
    { day: 'Day 6', subscribers: 150 },
    { day: 'Day 7', subscribers: 160 },
  ];

  const chart = () => (
    <ResponsiveContainer height={250} width="100%">
      <RechartsLineChart data={data} margin={{ right: 25, top: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="subscribers" stroke="#8884d8" activeDot={{ r: 8 }} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );

  return (
    <div style={{ width: "100%", height: 400 }}>
      {chart()}
    </div>
  );
}
