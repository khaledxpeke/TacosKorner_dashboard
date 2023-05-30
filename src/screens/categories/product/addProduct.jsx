import { Box, Button, MenuItem, Select, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import ImageInput from "../../../components/imageInput";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../components/loading";
import {
  addProduct,
  getProductsError,
  getProductsStatus,
  updateStatus,
  getProductsisLoading,
} from "../../../features/productSlice";
import {
  selectAllCategories,
  fetchCategories,
} from "../../../features/categorySlice";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [displayLabel, setDisplayLabel] = useState(true);
  const dispatch = useDispatch();
  const status = useSelector(getProductsStatus);
  const error = useSelector(getProductsError);
  const loading = useSelector(getProductsisLoading);
  const navigate = useNavigate();
  const categories = useSelector(selectAllCategories);

  const productSchema = yup.object().shape({
    name: yup.string().required("required"),
    image: yup.string().required("required"),
    category: yup.string().required("required"),
    currency: yup.string().required("required"),
    price: yup.number().required("required"),
    maxIngrediant: yup.number(),
  });
  const initialValues = {
    name: "",
    image: "",
    category: categories.length > 0 ? categories[0]._id : "",
    currency: "",
    price: "",
    maxIngrediant: "",
  };
  const handleFormSubmit = (values) => {
    dispatch(
      addProduct({
        body: {
          name: values.name,
          image: previewImage,
          currency: values.currency,
          price: values.price,
          maxIngrediant: values.maxIngrediant,
        },
        categoryId: values.category._id,
      })
    );
  };
  useEffect(() => {
    dispatch(fetchCategories());
    if (status === "addSuccess") {
      toast.success("Produit ajoutée avec succées");
      dispatch(updateStatus());
      navigate("/product");
    } else if (status === "addError") {
      toast.error(error);
    }
  }, [status, error, dispatch, navigate, categories]);

  return loading ? (
    <Loading />
  ) : (
    <Box m="20px">
      <Header title="AJOUTER PRODUIT" subtitle="Créer une nouvelle produit" />

      <Formik
        onSubmit={handleFormSubmit}
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
                sx={{ gridColumn: "span 8" }}
              />
              <ImageInput
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                displayLabel={displayLabel}
                setDisplayLabel={setDisplayLabel}
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
                sx={{ gridColumn: "span 2" }}
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
                sx={{ gridColumn: "span 2" }}
              />
              <Select
                name="category"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={values.category}
                label="Category"
                onChange={handleChange}
                sx={{ gridColumn: "span 4" }}
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Max Ingrediant"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.maxIngrediant}
                name="maxIngrediant"
                error={!!touched.maxIngrediant && !!errors.maxIngrediant}
                helperText={touched.maxIngrediant && errors.maxIngrediant}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Créer une nouvelle produit
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddProduct;
