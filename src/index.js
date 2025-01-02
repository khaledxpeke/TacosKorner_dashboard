import React from "react";
// import ReactDOM from "react-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { ResponsiveProvider } from './hooks/uiHook';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ResponsiveProvider>
          <App />
        </ResponsiveProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// ReactDOM.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Provider store={store}>
//         <ResponsiveProvider>
//           <App />
//         </ResponsiveProvider>
//       </Provider>
//     </BrowserRouter>
//   </React.StrictMode>,
//   document.getElementById("root")
// );
