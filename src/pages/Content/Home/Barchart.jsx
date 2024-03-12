import { Tooltip } from "antd";
import React from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export default function Barchart() {
  const data = [
    {
      Tháng: "Tháng 1",
      "Doanh thu": 100000
    },
    {
      Tháng: "Tháng 2",
      "Doanh thu": 200000
    },
    {
      Tháng: "Tháng 3",
      "Doanh thu": 300000
    },
    {
      Tháng: "Tháng 4",
      "Doanh thu": 400000
    },
    {
      Tháng: "Tháng 5",
      "Doanh thu": 500000
    },
    {
      Tháng: "Tháng 6",
      "Doanh thu": 600000
    },
    {
      Tháng: "Tháng 7",
      "Doanh thu": 700000
    },
    {
      Tháng: "Tháng 8",
      "Doanh thu": 800000
    },
    {
      Tháng: "Tháng 9",
      "Doanh thu": 900000
    },
    {
      Tháng: "Tháng 10",
      "Doanh thu": 1000000
    },
    {
      Tháng: "Tháng 11",
      "Doanh thu": 1100000
    },
    {
      Tháng: "Tháng 12",
      "Doanh thu": 1200000
    },
    
    
  ];
  return (
    <div className="chart">
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 50,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis
              dataKey="Tháng"
              label={{
                value: "Thời gian",
                position: "insideBottomRight",
                offset: 0,
              }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar barSize={20} dataKey="Doanh thu" fill="#413ea0" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
