import React, { useEffect } from "react";
import Topbar from "./global/Topbar";
import Dashboard from "./screens/dashboard/index";
import Sidebar from "./global/Sidebar";
import Product from "./screens/categories/product/index";
import SignIn from "./screens/auth/signin";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Category from "./screens/categories/category";
import AddCategory from "./screens/categories/category/addCategory";
import AddProduct from "./screens/categories/product/addProduct";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Ingrediant from "./screens/addons/ingrediants";
import Type from "./screens/addons/type";
import Extra from "./screens/extra/extras";
import Desert from "./screens/extra/desserts";
import History from "./screens/history";
import AddType from "./screens/addons/type/addType";
import AddIngrediant from "./screens/addons/ingrediants/addIngrediant";
import ModifyIngrediant from "./screens/addons/ingrediants/modifyIngrediant";
import AddExtra from "./screens/extra/extras/addExtra";
import AddDesert from "./screens/extra/desserts/addDessert";
import ModifyCategory from "./screens/categories/category/modifyCategory";
import ViewProduct from "./screens/categories/category/viewProduct";
import ModifyProduct from "./screens/categories/product/modifyProduct";
import ModifyExtra from "./screens/extra/extras/modifyExtra";
import ModifyDesert from "./screens/extra/desserts/modifyDessert";
import ModifyType from "./screens/addons/type/modifyType";
import Drink from "./screens/extra/drinks";
import AddDrink from "./screens/extra/drinks/addDrink";
import ModifyDrink from "./screens/extra/drinks/modifyDrink";
import jwtDecode from "jwt-decode";
import SettingsManagement from "./screens/settings/settings";
import ModifySettings from "./screens/settings/modifySettings";
import CarouselMedia from "./screens/settings/CarouselMedia";
import AddToCarousel from "./screens/settings/CarouselMedia/addToCarousel";
import AddSousCategory from "./screens/categories/sousCategory/addSousCategory";
import SousCategory from "./screens/categories/sousCategory";
import ModifySousCategory from "./screens/categories/sousCategory/modifySousCategory";

function App() {
  const { theme, colorMode } = useMode();
  const navigate = useNavigate();
  const location = useLocation();
  const output = window.localStorage.getItem("token");
  const token = output ? JSON.parse(output) : null;
  const decodedToken = token ? jwtDecode(token) : null;
  const expirationDate = decodedToken
    ? new Date(decodedToken.exp * 1000)
    : null;
  const isSignInPage = !expirationDate || expirationDate < new Date();
  useEffect(() => {
    if (isSignInPage && location.pathname !== "/signin") {
      navigate("/signin");
    } else if (!isSignInPage && location.pathname === "/signin") {
      navigate("/");
    }
  }, [isSignInPage, location.pathname, navigate]);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <div className={!isSignInPage ? "app-content app" : "app-signin app"}>
          {!isSignInPage && <Sidebar />}

          {!isSignInPage && <Topbar />}
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            {!isSignInPage && (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/settings" element={<SettingsManagement />} />
                <Route path="/modifySettings" element={<ModifySettings />} />
                <Route path="/category" element={<Category />} />
                <Route path="/addCategory" element={<AddCategory />} />
                <Route path="/modifyCategory" element={<ModifyCategory />} />
                <Route path="/sousCategory" element={<SousCategory />} />
                <Route path="/addSousCategory" element={<AddSousCategory />} />
                <Route
                  path="/modifySousCategory"
                  element={<ModifySousCategory />}
                />
                <Route path="/viewProduct" element={<ViewProduct />} />
                <Route path="/product" element={<Product />} />
                <Route path="/modifyProduct" element={<ModifyProduct />} />
                <Route path="/addProduct" element={<AddProduct />} />
                <Route path="/ingrediants" element={<Ingrediant />} />
                <Route path="/addIngrediant" element={<AddIngrediant />} />
                <Route
                  path="/modifyIngrediant"
                  element={<ModifyIngrediant />}
                />
                <Route path="/type" element={<Type />} />
                <Route path="/addType" element={<AddType />} />
                <Route path="/modifyType" element={<ModifyType />} />
                <Route path="/extra" element={<Extra />} />
                <Route path="/addExtra" element={<AddExtra />} />
                <Route path="/modifyExtra" element={<ModifyExtra />} />
                <Route path="/drink" element={<Drink />} />
                <Route path="/addDrink" element={<AddDrink />} />
                <Route path="/modifyDrink" element={<ModifyDrink />} />
                <Route path="/desert" element={<Desert />} />
                <Route path="/addDesert" element={<AddDesert />} />
                <Route path="/modifyDesert" element={<ModifyDesert />} />
                <Route path="/history" element={<History />} />
                <Route path="/carousel" element={<CarouselMedia />} />
                <Route path="/addToCarousel" element={<AddToCarousel />} />
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
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
