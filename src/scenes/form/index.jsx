import {
  Box,
  Button,
  Select,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  return (
    <Box m="20px">
      <Header title="CREATE PRODUCT" subtitle="Create a New Product" />

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
                sx={{ gridColumn: "span 2" }}
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
              <FormControl fullWidth variant="filled">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.category}
                name="category"
                error={!!touched.category && !!errors.category}
                helperText={touched.category && errors.category}
                sx={{ gridColumn: "span 4" }}
              />
               </FormControl>
               <FormControl fullWidth variant="filled">
              <InputLabel id="supplements-label">Supplements</InputLabel>
              <Select
                labelId="supplements-label"
                id="supplements"
                onBlur={handleBlur}
                onChange={handleChange}
                multiple
                value={values.supplements}
                name="supplements"
                error={!!touched.supplements && Boolean(errors.supplements)}
                helperText={touched.supplements && errors.supplements}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem disabled value="">Select some supplements</MenuItem>
                {supplements.map((supplement) => (
                  <MenuItem key={supplement} value={supplement}>
                    {supplement}
                  </MenuItem>
                ))}
              </Select>
              </FormControl>
              <FormControl fullWidth variant="filled">
              <InputLabel id="ingrediants-label">Ingrediants</InputLabel>
              <Select
                labelId="ingrediants-label"
                id="ingrediants"
                onBlur={handleBlur}
                onChange={handleChange}
                multiple
                value={values.ingrediants}
                name="ingrediants"
                error={!!touched.ingrediants && !!errors.ingrediants}
                helperText={touched.ingrediants && errors.ingrediants}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem disabled value="">Select some ingrediants</MenuItem>
                {ingrediants.map((ingrediant) => (
                  <MenuItem key={ingrediant} value={ingrediant}>
                    {ingrediant}
                  </MenuItem>
                ))}{" "}
              </Select>
              </FormControl>
              <FormControl fullWidth variant="filled">
              <InputLabel id="noIngrediants-label">NoIngrediants</InputLabel>
              <Select
                labelId="noIngrediants-label"
                id="noIngrediants"
                onBlur={handleBlur}
                onChange={handleChange}
                multiple
                value={values.noIngrediants}
                name="noIngrediants"
                error={!!touched.noIngrediants && !!errors.noIngrediants}
                helperText={touched.noIngrediants && errors.noIngrediants}
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem disabled value="">Select some no ingrediants</MenuItem>
                {noIngrediants.map((noIngrediant) => (
                  <MenuItem key={noIngrediant} value={noIngrediant}>
                    {noIngrediant}
                  </MenuItem>
                ))}{" "}
              </Select>
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="max Ingrediants"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.maxIngrediant}
                name="maxIngrediant"
                error={!!touched.maxIngrediant && !!errors.maxIngrediant}
                helperText={touched.maxIngrediant && errors.maxIngrediant}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Product
              </Button>
            </Box>
          
          </form>
        )}
      </Formik>
    </Box>
  );
};

// const phoneRegExp =
//   /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
const supplements = ["Supplement 1", "Supplement 2", "Supplement 3"];
const ingrediants = ["ingrediant 1", "ingrediant 2", "ingrediant 3"];
const noIngrediants = ["noIngrediant 1", "noIngrediant 2", "noIngrediant 3"];
const productSchema = yup.object().shape({
  name: yup.string().required("required"),
  price: yup.number().required("required"),
  currency: yup.string().required("required"),
  category: yup.array().required("required"),
  supplements: yup.array().required("required"),
  ingrediants: yup.array().required("required"),
  noIngrediants: yup.array(),
  // email: yup.string().email("invalid email").required("required"),
  // contact: yup
  //   .string()
  //   .matches(phoneRegExp, "Phone number is not valid")
  //   .required("required"),
  maxIngrediant: yup.number(),
});
const initialValues = {
  name: "",
  price: "",
  currency: "",
  category: "",
  supplements: [],
  ingrediants: [],
  noIngrediants: [],
  maxIngrediant: "",
};

export default Form;
