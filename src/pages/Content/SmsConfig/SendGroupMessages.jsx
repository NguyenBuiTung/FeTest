import { Breadcrumb, Col, Divider, Radio, Row, Space } from "antd";
import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import SendSmsOne from "./SendSmsOne";
import GroupMessage from "./GroupMessage";
import "../../../assets/css/animation.css";
import message from "../../../assets/img/message.png";
export default function SendGroupMessages() {
  const [value, setValue] = useState(1);
  const nodeRef = useRef(null);
  return (
    <div className="sent-sms">
      <h2>Gửi tin nhắn thông báo</h2>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/sent-smsgroup">Gửi tin nhắn đến khách hàng</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Divider />
      <div className="box-sentsms">
        <Row gutter={[16, 16]} justify="start">
          <Col xl={8} lg={10} md={24} sm={24}>
            <div
              style={{
                backgroundImage: `url(${message})`,
                backgroundSize: "contain",
                height: "100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h4>Chọn loại tin nhắn :</h4>
              <Radio.Group
                onChange={(e) => setValue(e.target.value)}
                value={value}
              >
                <Space direction="vertical">
                  <Radio value={1}>Gửi tin nhắn đến 1 khách hàng</Radio>
                  <Radio value={2}>Gửi tin nhắn đến nhóm khách hàng</Radio>
                </Space>
              </Radio.Group>
            </div>
          </Col>
          <Col xl={10} lg={12} md={24} sm={24}>
            <div
              style={{
                borderRadius: 10,
                boxShadow:
                  "rgba(0, 0, 0, 0.5) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 6px 10px",
                padding: 10,
              }}
            >
              <SwitchTransition>
                <CSSTransition
                  key={value}
                  nodeRef={nodeRef}
                  classNames="fade"
                  timeout={300}
                >
                  <div ref={nodeRef} className={`animation-${value}`}>
                    {value === 1 ? <SendSmsOne /> : <GroupMessage />}
                  </div>
                </CSSTransition>
              </SwitchTransition>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
