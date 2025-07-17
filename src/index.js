import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import store from "./redux/store";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

const App = lazy(() => import("./App"));
const Loader = lazy(() => import("./Buyer/components/SharedComponents/Loader/Loader"));

const root = ReactDOM.createRoot(document.getElementById("root"));
// console.log("Live version 2.2.5 on 17-07-2025")

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
);

reportWebVitals();
