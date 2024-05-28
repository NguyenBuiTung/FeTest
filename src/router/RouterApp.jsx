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
const Home = React.lazy(() => import("../pages/Content/Home/Home"));
export const history = createBrowserHistory();
export default function RouterApp() {
  return (
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
            <Route path="" element={<Body />}>
              <Route path="*" element={<Page404 />} />
              <Route index element={<Home />} />
              
            </Route>
          </Routes>
        </Suspense>
      </HistoryRouter>
    </ConfigProvider>
  </Provider>
  );
}
