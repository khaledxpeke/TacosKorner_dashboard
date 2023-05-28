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
      
        <div className="app-signin app" >
          {!isSignInPage && <Sidebar/>}
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
                  <Route path="/addProduct" element={<AddProduct />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
