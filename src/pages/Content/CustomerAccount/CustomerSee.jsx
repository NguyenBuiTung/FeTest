import {
  Badge,
  Breadcrumb,
  Button,
  Col,
  Form,
  Modal,
  Popover,
  Row,
  Select,
  Table,
  Tour,
  TreeSelect,
  message,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { store } from "../../../redux/configStore";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  exchangePoint,
  getListCustomerSee,
  getListStoreCustomerAll,
  getPointCustomerSee,
} from "../../../api/customerSee/customerSee";
import { calculateTimeDifference } from "../../../utils/dateTime";
import { SearchOutlined, SwapOutlined } from "@ant-design/icons";
import { transformData } from "../../../utils/recursive";
export default function CustomerSee() {
  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const [open, setOpen] = useState(false);
  const steps = [
    {
      title: "Xem chi tiết mã giảm giá",
      description: "Hiển thị chi tiết và điều kiện bạn có thể áp dụng được mã",
      target: () => ref0.current,
    },
    {
      title: "Tra cứu",
      description: "Hiển thị điểm của bạn",
      target: () => ref1.current,
    },
    {
      title: "Chọn cửa hàng đổi mã",
      description:
        "Những mã áp dụng toàn chuỗi bạn có thể chọn cửa hàng trong những chi nhánh để đổi",
      target: () => ref2.current,
    },
    {
      title: "Đổi mã",
      description: "Bấm đổi mã để bắt đầu sử dụng",
      target: () => ref3.current,
    },
  ];
  const [form] = Form.useForm();
  const { listCustomerSee, isLoading } = useSelector(
    (state) => state.persistedReducer.customerSee
  );
  const { listStoreCustomerAll, isLoadingStore } = useSelector(
    (state) => state.persistedReducer.storeCustomer
  );
  const dataTree = transformData(listStoreCustomerAll?.data);
  const options = dataTree?.filter((item) => item.parent_id === 0);
  // const { user } = useSelector((state) => state.persistedReducer.user);
  const [isLoadingSearch, setIsLoadingSearch] = useState();
  const [isLoadExchange, setIsLoadExchange] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const handleSizeChange = useCallback(
    (current, size) => {
      setPageSize(size);
    },
    [setPageSize]
  );
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListStoreCustomerAll());
    };
    fetchData();
  }, []);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(getListCustomerSee({ currentPage, pageSize }));
    };
    fetchData();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const dataNew = listCustomerSee?.data.map((items, index) => {
      const currentDate = new Date();
      const endDate = items?.end_date;
      const formattedTimeDifference = calculateTimeDifference(
        currentDate,
        endDate
      );
      return {
        key: index + 1,
        id: items.id,
        code: items.code,
        preferential_type: items.preferential_type,
        preferential_value: items.preferential_value.toLocaleString(),
        timeuse: formattedTimeDifference,
        branch: items.branch.name,
        campaign: items.campaign,
        branchs: items.branch,
        exchange_point: items.exchange_point,
        maximum_reduction: items.maximum_reduction,
        minimum_value: items.minimum_value,
        status: items.customers,
      };
    });
    setData(dataNew);
  }, [listCustomerSee]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [branch_id, setBranchId] = useState();
  const [selected, setSelected] = useState(false);

  const handleStore = (value) => {
    setBranchId(value);
    setSelected(true);
  };
  const handleExchangePoint = async (value) => {
    // console.log(value);
    setIsLoadExchange((preLoading) => ({
      ...preLoading,
      [value.id]: true,
    }));
    if (!selected && value.branchs.children.length > 0) {
      message.error("Vui lòng chọn cửa hàng");
      setIsLoadExchange((preLoading) => ({
        ...preLoading,
        [value.id]: false,
      }));
    }
    const data = {
      branch_id:
        value.branchs.children.length === 0 ? value.branchs.id : branch_id,
      code_id: value.id,
    };
    console.log(data);
    try {
      if (data.branch_id !== undefined) {
        const response = await store.dispatch(exchangePoint(data));
        // console.log(response);
        if (response.payload.data === true) {
          message.success("Đổi mã thành công");
          await store.dispatch(getListCustomerSee({ currentPage, pageSize }));
          setIsLoadExchange((preLoading) => ({
            ...preLoading,
            [value.id]: false,
          }));
        } else {
          setIsLoadExchange((preLoading) => ({
            ...preLoading,
            [value.id]: false,
          }));
          message.error(response.payload.data.original.message);
        }
      } else {
        setIsLoadExchange((preLoading) => ({
          ...preLoading,
          [value.id]: false,
        }));
      }
    } catch (error) {
      setIsLoadExchange((preLoading) => ({
        ...preLoading,
        [value.id]: false,
      }));
      message.error("Có lỗi xảy ra");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
    },
    {
      title: "Tên mã",
      dataIndex: "code",
      render: (_, record) => {
        const content = (
          <>
            <p>
              Chương trình:{" "}
              <b style={{ color: "#ff4d4f" }}>{record?.campaign?.name}</b>{" "}
            </p>
            <p>
              Số điểm cần đổi:{" "}
              <b style={{ color: "#ff4d4f" }}>{record.exchange_point}</b>{" "}
            </p>
            <p>
              Giá trị ưu đãi:{" "}
              <b style={{ color: "#ff4d4f" }}>
                {record.preferential_value.toLocaleString()}
              </b>{" "}
              {record.preferential_type === "MONEY" ? "VNĐ" : "%"}
            </p>
            {record.preferential_type === "MONEY" ? (
              <p>
                Áp dụng cho đơn hàng tối thiểu:
                <b style={{ color: "#ff4d4f" }}>
                  {" "}
                  {record.minimum_value.toLocaleString()}
                </b>{" "}
                VNĐ
              </p>
            ) : (
              <p>
                Giảm tối đa:{" "}
                <b style={{ color: "#ff4d4f" }}>
                  {record.maximum_reduction.toLocaleString()}
                </b>{" "}
                VNĐ
              </p>
            )}
          </>
        );
        return (
          <Popover
            content={content}
            title="Chi tiết mã giảm giá"
            trigger="click"
          >
            <Button type="link" ref={ref0}>
              {record.code}
            </Button>
          </Popover>
        );
      },
    },
    {
      title: "Thời gian còn lại",
      dataIndex: "timeuse",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) =>
        record.status[0].pivot.status === "CAN_USE" ? (
          <Badge status="processing" text="Có thể đổi" />
        ) : record.status[0].pivot.status === "UN_USED" ? (
          <Badge status="success" text="Chưa sử dụng" />
        ) : (
          <Badge status="error" text="Đã sử dụng" />
        ),
    },
    {
      title: "Áp dụng cho cửa hàng và chi nhánh",
      dataIndex: "branch",
      render: (_, record) => {
        const branchs = record.branchs || {};
        const children = branchs.children || [];
        const branchsArray = [
          { value: branchs.id, label: branchs.name },
          ...children.map((item) => ({ value: item.id, label: item.name })),
        ];
        const branches = branchsArray.map((item) => {
          return {
            value: item.value, // Sử dụng item.value thay vì item.id
            label: item.label, // Sử dụng item.label thay vì item.name
          };
        });
        const content = (
          <>
            <p>
              {record.branchs.children.map((items, index) => {
                return (
                  <b style={{ color: "#722ed1", display: "block" }} key={index}>
                    {items.name}
                  </b>
                );
              })}
            </p>
            <Select
              showSearch
              style={{ width: 300, margin: "10px 0" }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
              filterSort={(optionA, optionB) =>
                optionA?.label
                  ?.toLowerCase()
                  .localeCompare(optionB?.label?.toLowerCase())
              }
              onChange={handleStore}
              disabled={isLoading}
              placeholder="Chọn cửa hàng để đổi mã"
              options={branches}
            />
          </>
        );
        return (
          <Popover
            content={content}
            title="Danh sách chi nhánh"
            trigger="click"
          >
            <Button
              style={{ padding: 0, color: "#1677ff" }}
              type="text"
              ref={ref2}
            >
              {record.branchs.children?.length === 0 ? (
                <Button
                  style={{ padding: 0, color: "#1677ff" }}
                  disabled
                  type="text"
                >
                  {record.branch}
                </Button>
              ) : (
                <span>{record?.branch} (toàn chuỗi) </span>
              )}
            </Button>
          </Popover>
        );
      },
    },
    {
      title: "Số điểm cần đổi",
      dataIndex: "exchange_point",
    },
    {
      title: "Thao tác",
      dataIndex: "operation",
      align: "center",
      render: (_, record) => {
        return (
          <Button
            ref={ref3}
            type="primary"
            disabled={
              record.status[0].pivot.status === "UN_USED" ||
              record.status[0].pivot.status === "USED"
            }
            icon={<SwapOutlined />}
            loading={isLoadExchange[record.id]}
            onClick={() => {
              handleExchangePoint(record);
            }}
          >
            Đổi mã
          </Button>
        );
      },
    },
  ];

  const [selectedStore, setSelectedStore] = useState();
  const handleSearch = async () => {
    setIsLoadingSearch(true);
    if (selectedStore !== undefined) {
      const { value } = selectedStore;
      try {
        const response = await store.dispatch(getPointCustomerSee(value));
        const newPoint = response.payload.data;
        Modal.info({
          title: "Bạn đang có :",
          content: (
            <>
              <p style={{ color: "#1677ff", fontWeight: 400, fontSize: 18 }}>
                {newPoint} điểm
              </p>
              <p>
                Tại cửa hàng <b>{selectedStore?.label[0]}</b>
              </p>
            </>
          ),
        });
        setIsLoadingSearch(false);
      } catch (error) {
        setIsLoadingSearch(false);
        // Xử lý lỗi nếu có
      }
    } else {
      setIsLoadingSearch(false);
      message.error("Bạn chưa chọn cửa hàng !");
    }
  };

  return (
    <div
    // style={{
    //   backgroundImage: `url(${undrawGift})`,
    //   backgroundPosition: "center",
    //   height: "100vh",
    //   backgroundRepeat: "no-repeat",
    //   backgroundSize: "cover",
    //   padding: 10,
    // }}
    >
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/customer-see">Danh sách mã giảm giá</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[16, 16]}>
        <Col xl lg md sm>
          <TreeSelect
            style={{ width: 300, marginBottom: 20 }}
            disabled={isLoadingStore}
            placeholder="Tìm kiếm theo cửa hàng"
            showSearch
            filterTreeNode={(inputValue, treeNode) => {
              return treeNode.title
                .toLowerCase()
                .includes(inputValue.toLowerCase());
            }}
            value={selectedStore}
            onChange={(value, label) => setSelectedStore({ value, label })}
            treeLine
            treeData={options}
          />
        </Col>
        <Col xl lg md sm>
          <Button
            ref={ref1}
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={isLoadingSearch}
          >
            Tra cứu
          </Button>
        </Col>
        <Col xl lg md sm>
          <Button
            type="primary"
            disabled={data?.length === 0}
            onClick={() => setOpen(true)}
          >
            Hướng dẫn
          </Button>
          <Tour
            open={open}
            onClose={() => setOpen(false)}
            steps={steps}
            indicatorsRender={(current, total) => (
              <span>
                {current + 1} / {total}
              </span>
            )}
          />
        </Col>
      </Row>
      <Form form={form} component={false}>
        <Table
          dataSource={data}
          columns={columns}
          pagination={{
            showTotal: (total, range) =>
              `Hiển thị từ ${range[0]} -> ${range[1]} trong tổng ${total} giá trị`,
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: handleSizeChange,
            total: listCustomerSee?.total,
            current: currentPage,
            onChange: handlePageChange,
          }}
          loading={isLoading}
          bordered
          scroll={{ x: "500px" }}
        />
      </Form>
    </div>
  );
}
