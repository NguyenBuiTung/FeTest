import React, { Suspense } from "react";
import {
  unstable_HistoryRouter as HistoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import "dayjs/locale/vi";
import { createBrowserHistory } from "history";
import { ConfigProvider, Empty } from "antd";
import viVN from "antd/lib/locale/vi_VN";
import { Provider } from "react-redux";
import Page404 from "../pages/404page/Page404";
import LoadingProgress from "../components/Loader/LoadingProgress";
import RoutePrivate from "../components/PrivateLogin/RoutePrivate";

import { store } from "../redux/configStore";
import Body from "../components/Body";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ListAccout from "../pages/Content/Admin/ListAccout";
import LineChart from "../pages/Content/Home/LineChart";
import Barchart from "../pages/Content/Home/Barchart";
const TableRankCustomer = React.lazy(() =>
  import("../pages/Content/Customer/RankCustomer/TableRankCustomer")
);
const TransactionCustomer = React.lazy(() =>
  import(
    "../pages/Content/CustomerAccount/TransactionsCustsomer/TransactionCustomer"
  )
);
const FormAddDonate = React.lazy(() =>
  import("../pages/Content/Mcoupon/FormAddDonate")
);
const TableStoreCustomer = React.lazy(() =>
  import("../pages/Content/CustomerAccount/TableStoreCustomer")
);
const TableGroupCustomer = React.lazy(() =>
  import("../pages/Content/Customer/GroupCustomer/TableGroupCustomer")
);
const CustomerSee = React.lazy(() =>
  import("../pages/Content/CustomerAccount/CustomerSee")
);
const HistorySms = React.lazy(() =>
  import("../pages/Content/SmsConfig/HistorySms")
);
const SendGroupMessages = React.lazy(() =>
  import("../pages/Content/SmsConfig/SendGroupMessages")
);
const SettingBranch = React.lazy(() =>
  import("../pages/Content/Store/SettingBranch")
);

const TabStore = React.lazy(() => import("../pages/Content/Store/TabStore"));
const SmsConfiguration = React.lazy(() =>
  import("../pages/Content/SmsConfig/SmsConfiguration")
);
const TableVoucher = React.lazy(() =>
  import("../pages/Content/Mcoupon/VoucherManagement/TableVoucher")
);
const ClassificationTable = React.lazy(() =>
  import("../pages/Content/Customer/CustomerCategory/ClassificationTable")
);
const TableCustomer = React.lazy(() =>
  import("../pages/Content/Customer/TableCustomer")
);
const EmployeeManager = React.lazy(() =>
  import("../pages/Content/Staff/EmployeeManager")
);
const TableMcoupon = React.lazy(() =>
  import("../pages/Content/Mcoupon/TableMcoupon")
);
const Restore = React.lazy(() =>
  import("../pages/Content/Mcoupon/RestoreProgram/Restore")
);
const Home = React.lazy(() => import("../pages/Content/Home/Home"));
export const history = createBrowserHistory();
export default function RouterApp() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <ConfigProvider
          locale={viVN}
          renderEmpty={Empty}
          theme={{
            token: {
              fontSize: 16,
              borderRadius: 5,
              colorBgContainer: "#fff",
            },

            components: {
              Dropdown: { colorText: "#000" },
              Pagination: {
                colorText: "#000",
                colorPrimary: "#f5222d",
                borderRadius: 4,
              },
              Spin: { colorPrimary: "#d82b87" },
              Modal: { titleFontSize: 20, titleColor: "#52c41a" },
              Tabs: { colorText: "#000" },
              Switch: { colorPrimary: "#0CC679" },
              Button: {
                colorPrimary: "#0CC679",
              },
            },
          }}
        >
          <HistoryRouter history={history}>
            <Suspense fallback={<LoadingProgress />}>
              <Routes>
                <Route path="" element={<RoutePrivate />}>
                  <Route path="" element={<Body />}>
                    <Route path="*" element={<Page404 />} />
                    <Route index element={<Home />} />
                    <Route path="/store-manager" element={<TabStore />} />
                    <Route path="/post-manager" element={<ListAccout />} />
                    <Route path="/setting-branch" element={<SettingBranch />} />
                    <Route
                      path="/employee-manager"
                      element={<EmployeeManager />}
                    />
                    <Route path="/mcoupon" element={<TableMcoupon />} />
                    <Route
                      path="/donate-directly"
                      element={<FormAddDonate />}
                    />
                    <Route path="/voucher" element={<TableVoucher />} />
                    <Route path="/restorePr" element={<Restore />} />
                    <Route path="/customer" element={<TableCustomer />} />
                    <Route path="/customer-see" element={<CustomerSee />} />
                    <Route
                      path="/transactions-customer"
                      element={<TransactionCustomer />}
                    />
                    <Route
                      path="/info-point-store"
                      element={<TableStoreCustomer />}
                    />
                    <Route
                      path="/customertype"
                      element={<ClassificationTable />}
                    />
                    <Route
                      path="/rank-customer"
                      element={<TableRankCustomer />}
                    />
                    <Route
                      path="/customer-group"
                      element={<TableGroupCustomer />}
                    />
                  
                   
                    
                    <Route
                      path="/settings"
                      element={<SmsConfiguration />}
                    />
                    <Route
                      path="/sent-smsgroup"
                      element={<SendGroupMessages />}
                    />
                    <Route
                      path="/line-chart"
                      element={<LineChart />}
                    />
                    <Route
                      path="/bar-chart"
                      element={<Barchart />}
                    />
                    <Route path="/history-sms" element={<HistorySms />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </HistoryRouter>
        </ConfigProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
}
