import React, { useState } from "react";
import Topbar from "./global/Topbar";
import Dashboard from "./screens/dashboard/index";
import Sidebar from "./global/Sidebar";
import Product from "./screens/categories/product/index";
import AddProduct from "./screens/categories/product/addProduct";
import SignIn from "./screens/auth/signin";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Category from "./screens/categories/category";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Supplement from "./screens/addons/supplements";
import Ingrediant from "./screens/addons/ingrediants";
import Type from "./screens/addons/type";
import Pack from "./screens/extra/formule";
import Desert from "./screens/extra/desserts";

function App() {
  const { theme, colorMode } = useMode();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    setUserLoggedIn(true);
    navigate("/");
  };

  const isSignInPage = location.pathname === "/signin";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <div className={!isSignInPage ? "app-signin app" : ""}>
          {!isSignInPage && <Sidebar />}
          <main className="content">
            {!isSignInPage && (
              <Topbar
                userLoggedIn={userLoggedIn}
                onToggleColorMode={() => {
                  // handle theme mode toggle logic
                }}
                onLoginClick={() => {
                  navigate("/signin");
                }}
              />
            )}
            <Routes>
              <Route
                path="/signin"
                element={<SignIn onLogin={handleLogin} />}
              />
              {!isSignInPage && (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/category" element={<Category />} />
                  <Route path="/product" element={<Product />} />
                  <Route path="/supplements" element={<Supplement />} />
                  <Route path="/ingrediants" element={<Ingrediant />} />
                  <Route path="/type" element={<Type />} />
                  <Route path="/formule" element={<Pack />} />
                  <Route path="/desert" element={<Desert />} />
                  <Route path="/addProduct" element={<AddProduct />} />
                </>
              )}
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              closeOnClick={true}
              pauseOnHover={true}
              draggable={true}
              progress={undefined}
              theme="colored"
            />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
