import React, { useEffect, useState } from "react";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserLoading,
  login,
  getUserStatus,
  getUserError,
  updateStatus,
} from "../../features/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
const SignIn = () => {
  const dispatch = useDispatch();
  const userStatus = useSelector(getUserStatus);
  const error = useSelector(getUserError);
  const loading = useSelector(getUserLoading);
  const navigate = useNavigate();
  useEffect(() => {
    if (userStatus === "idle") {
      return;
    }

    if (userStatus === "logedIn") {
      toast.success("Loged in successfully");
      dispatch(updateStatus());

      navigate("/");
    } else if (userStatus === "error") {
      toast.error(error);
    }
  }, [userStatus, error, navigate, dispatch]);
  const initialValues = {
    email: "",
    password: "",
  };
  const productSchema = yup.object().shape({
    password: yup.string().required("This field is required"),
    email: yup
      .string()
      .email("invalid email")
      .required("This field is required"),
  });
  const handleLogin = (values) => {
    const { email, password } = values;
    console.log(email);
    console.log(password);
    dispatch(
      login({
        email: email,
        password: password,
      })
    );
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return loading ? (
    <Loading />
  ) : (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ height: "100dvh", display: "grid", placeItems: "center" }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik
          onSubmit={handleLogin}
          initialValues={initialValues}
          validationSchema={productSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={values.email}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={values.password}
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={handleTogglePasswordVisibility}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default SignIn;
