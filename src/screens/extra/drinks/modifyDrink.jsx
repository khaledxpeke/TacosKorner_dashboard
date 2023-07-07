import {
    Box,
    Button,
    TextField,
  } from "@mui/material";
  import { Formik } from "formik";
  import * as yup from "yup";
  import useMediaQuery from "@mui/material/useMediaQuery";
  import Header from "../../../components/Header";
  import ImageInput from "../../../components/imageInput";
  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { toast } from "react-toastify";
  import Loading from "../../../components/loading";
  import {getDrinksError,getDrinksStatus,getDrinksSuccess,updateStatus,getDrinksLoading,modifyDrink
 } from "../../../features/drinkSlice";
 import { useLocation, useNavigate } from "react-router-dom";
  
  const ModifyDrink = () => {
    const location = useLocation();
    const data = location.state.drink;
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [previewImage, setPreviewImage] = useState(null);
    const [displayLabel, setDisplayLabel] = useState(true);
    const dispatch = useDispatch();
    const status = useSelector(getDrinksStatus);
    const error = useSelector(getDrinksError);
    const loading = useSelector(getDrinksLoading);
    const success = useSelector(getDrinksSuccess);
    const navigate = useNavigate();
  
    const drinkSchema = yup.object().shape({
      name: yup.string().required("name is required"),
      currency: yup.string().required("required"),
      price: yup.number().required("required"),
    });
    const initialValues = {
      name: data.name,
      currency: data.currency,
      price: data.price,
    };
    const handleFormSubmit = (values) => {
      const requestBody = {
        name: values.name,
        currency: values.currency,
        price: values.price,
        ...(previewImage && { image: previewImage }),
      };
      dispatch(
        modifyDrink({
          body: requestBody,
          drinkId: data._id
        })
      );
    };
    useEffect(() => {
      if (status === "modifySuccess") {
        toast.success(success);
        dispatch(updateStatus());
        navigate("/drink");
      } else if (status === "modifyError") {
        toast.error(error);
      }
    }, [status, error, dispatch, navigate, success]);
  
    return loading ? (
      <Loading />
    ) : (
      <Box m="20px">
        <Header title="MODIFIER BOISSON" subtitle="Modifier boisson" />
  
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={drinkSchema}
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
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 4", gridRow: "1 / span 1" }}
                />
                <ImageInput
                  sx={{ gridColumn: "span 2", gridRow: "2 / span 2" }}
                  previewImage={previewImage}
                  setPreviewImage={setPreviewImage}
                  displayLabel={displayLabel}
                  setDisplayLabel={setDisplayLabel}
                  image={data.image}
                />
                 <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                error={!!touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                sx={{ gridColumn: "span 1", gridRow: "1 / span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Currency"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.currency}
                name="currency"
                error={!!touched.currency && !!errors.currency}
                helperText={touched.currency && errors.currency}
                sx={{ gridColumn: "span 1", gridRow: "1 / span 1" }}
              />
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Créer une nouvelle dessert
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    );
  };
  
  export default ModifyDrink;
  