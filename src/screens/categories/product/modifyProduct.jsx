import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
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
import {
  modifyProduct,
  getProductsError,
  getProductsStatus,
  updateStatus,
  getProductsisLoading,
  getProductsSuccess,
} from "../../../features/productSlice";
import {
  selectAllCategories,
  fetchCategories,
} from "../../../features/categorySlice";
import {
  selectAllIngrediants,
  getIngrediants,
} from "../../../features/ingrediantSlice";
import {
  selectAllSupplements,
  getSupplements,
} from "../../../features/supplementSlice";
import { useLocation, useNavigate } from "react-router-dom";

const ModifyProduct = () => {
  const location = useLocation();
  const data = location.state.product;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [displayLabel, setDisplayLabel] = useState(true);
  const ingrediants = useSelector(selectAllIngrediants);
  const supplements = useSelector(selectAllSupplements);
  const max = ingrediants.filter(
    (ingredient) =>
      data.ingrediants.includes(ingredient._id) &&
      ingredient.type.name.toLowerCase() === "meat"
  );
  const [selectedMeatIngredients, setSelectedMeatIngredients] = useState(max);
  const dispatch = useDispatch();
  const status = useSelector(getProductsStatus);
  const error = useSelector(getProductsError);
  const loading = useSelector(getProductsisLoading);
  const success = useSelector(getProductsSuccess);
  const navigate = useNavigate();
  const categories = useSelector(selectAllCategories);

  const productSchema = yup.object().shape({
    name: yup.string().required("name is required"),
    category: yup.string().required("required"),
    ingrediant: yup.array().default(() => []),
    supplement: yup.array().default(() => []),
    currency: yup.string().required("required"),
    price: yup.number().required("required"),
    maxIngrediant: yup.number(),
    choice: yup.string().required("required"),
  });
  const initialValues = {
    name: data.name,
    category: data.category || "",
    ingrediant: data.ingrediants,
    supplement: data.supplements,
    currency: data.currency,
    price: data.price,
    maxIngrediant: data.maxIngrediant,
    choice: data.choice,
  };
  const handleFormSubmit = (values) => {
    const ingrediants =
      values.ingrediant.length > 0 ? values.ingrediant.join(",") : [];
    const supplements =
      values.supplement.length > 0 ? values.supplement.join(",") : [];
    const requestBody = {
      name: values.name,
      currency: values.currency,
      price: values.price,
      category: values.category,
      maxIngrediant: Number(values.maxIngrediant),
      ingrediants,
      supplements,
      choice: values.choice,
      ...(previewImage && { image: previewImage }),
    };
    dispatch(
      modifyProduct({
        body: requestBody,
        productId: data._id,
      })
    );
  };
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(getIngrediants());
    dispatch(getSupplements());
    if (status === "modifySuccess") {
      toast.success(success);
      dispatch(updateStatus());
      navigate("/product");
    } else if (status === "modifyError") {
      toast.error(error);
    }
  }, [status, error, dispatch, navigate, success]);

  return loading ? (
    <Loading />
  ) : (
    <Box m="20px" class="main-application">
      <Header title="MODIFIER PRODUIT" subtitle="Modifier un produit" />

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
              gridTemplateColumns="repeat(3, minmax(0, 1fr))"
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
                sx={{ gridColumn: "span 2", gridRow: "1 / span 1" }}
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
              <ImageInput
                sx={{ gridColumn: "span 4", gridRow: "2 / span 1" }}
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                displayLabel={displayLabel}
                setDisplayLabel={setDisplayLabel}
                image={data.image}
              />
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 1", gridRow: "3 / span 1" }}
              >
                <InputLabel id="category">Selectioner une categorie</InputLabel>
                <Select
                  name="category"
                  labelId="category"
                  id="category"
                  value={values.category}
                  label="Category"
                  onChange={handleChange}
                  sx={{ gridColumn: "span 1" }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 1", gridRow: "3 / span 1" }}
              >
                <InputLabel id="supplements">
                  Selectioner les supplement
                </InputLabel>
                <Select
                  name="supplement"
                  labelId="supplements"
                  id="supplement"
                  value={values.supplement}
                  multiple
                  label="supplement"
                  onChange={handleChange}
                  sx={{ gridColumn: "span 1" }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: "300px",
                      },
                    },
                  }}
                >
                  {supplements.map((supplement) => (
                    <MenuItem key={supplement._id} value={supplement._id}>
                      {supplement.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 1", gridRow: "3 / span 1" }}
              >
                <InputLabel id="ingrediants">
                  Selectioner les ingrédiants
                </InputLabel>
                <Select
                  name="ingrediant"
                  labelId="ingrediants"
                  id="ingrediant"
                  value={values.ingrediant}
                  multiple
                  label="ingrediant"
                  onChange={(event) => {
                    handleChange(event);
                    const selectedIngredientIds = event.target.value;
                    const selectedMeatIngredients = ingrediants.filter(
                      (ingredient) => {
                        return (
                          selectedIngredientIds.includes(ingredient._id) &&
                          ingredient.type.name.toLowerCase() === "meat"
                        );
                      }
                    );

                    setSelectedMeatIngredients(selectedMeatIngredients);
                  }}
                  sx={{ gridColumn: "span 1" }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: "300px",
                      },
                    },
                  }}
                >
                  {ingrediants.map((ingrediant) => (
                    <MenuItem key={ingrediant._id} value={ingrediant._id}>
                      {ingrediant.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Max Meat"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.maxIngrediant}
                name="maxIngrediant"
                error={!!touched.maxIngrediant && !!errors.maxIngrediant}
                helperText={touched.maxIngrediant && errors.maxIngrediant}
                sx={{
                  gridColumn: "span 1",
                  gridRow: "3 / span 1",
                  display:
                    selectedMeatIngredients.length > 0 ? "block" : "none",
                }}
              />
              <FormControl variant="filled"
                fullWidth
                sx={{ gridColumn: "span 1", gridRow: "4 / span 1" }}>
                <FormLabel>Choix de produit</FormLabel>
                <RadioGroup
                  defaultValue="seul"
                  name="choice"
                  value={values.choice}
                  onChange={handleChange}
                  sx={{ my: 1 }}
                >
                  <FormControlLabel
                    value="seul"
                    control={<Radio />}
                    label="Seul"
                  />
                  <FormControlLabel
                    value="multiple"
                    control={<Radio />}
                    label="Multiple"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Modifier un produit
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ModifyProduct;
