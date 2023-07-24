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
  addProduct,
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
  getIngrediantsByType,
} from "../../../features/ingrediantSlice";
import {
  selectAllSupplements,
  getSupplements,
} from "../../../features/supplementSlice";
import { useNavigate } from "react-router-dom";
import ReorderType from "../../../components/reorderType";
const AddProduct = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [displayLabel, setDisplayLabel] = useState(true);
  const [selectedMeatIngredients, setSelectedMeatIngredients] = useState([]);
  const dispatch = useDispatch();
  const status = useSelector(getProductsStatus);
  const error = useSelector(getProductsError);
  const loading = useSelector(getProductsisLoading);
  const success = useSelector(getProductsSuccess);
  const navigate = useNavigate();
  const categories = useSelector(selectAllCategories);
  const ingrediantsByType = useSelector(selectAllIngrediants);
  const supplements = useSelector(selectAllSupplements);
  const productSchema = yup.object().shape({
    name: yup.string().required("Nom est requis"),
    category: yup.string().required("categorie est requis"),
    ingrediant: yup.array().default(() => []),
    supplement: yup.array().default(() => []),
    currency: yup.string().required("Currency est requis"),
    price: yup.number().required("Prix est requis"),
    maxIngrediant: yup.number(),
    choice: yup.string().required("Choix est requis"),
  });
  const initialValues = {
    name: "",
    image: "",
    category: categories.length > 0 ? categories[0]._id : "",
    ingrediant: [],
    supplement: [],
    currency: "",
    price: "",
    maxIngrediant: "",
    choice: "seul",
  };
  const handleFormSubmit = (values) => {
    const ingrediants =
      values.choice === "multiple"
        ? values.ingrediant.length > 0
          ? values.ingrediant.join(",")
          : []
        : [];
    const supplements =
      values.choice === "multiple"
        ? values.supplement.length > 0
          ? values.supplement.join(",")
          : []
        : [];
    dispatch(
      addProduct({
        body: {
          name: values.name,
          image: previewImage,
          currency: values.currency,
          price: values.price,
          maxIngrediant: Number(values.maxIngrediant),
          ingrediants,
          supplements,
          choice: values.choice,
          type:types.map((item) => item._id)
        },
        categoryId: values.category,
      })
    );
  };
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(getIngrediantsByType());
    dispatch(getSupplements());
    if (status === "addSuccess") {
      toast.success(success);
      dispatch(updateStatus());
      navigate("/product");
    } else if (status === "addError") {
      toast.error(error);
    }
  }, [status, error, dispatch, navigate, success]);

  const [types, updateTypes] = useState([]);
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const updatedTypes = Array.from(types);
    const [reorderedItem] = updatedTypes.splice(result.source.index, 1);
    updatedTypes.splice(result.destination.index, 0, reorderedItem);

    updateTypes(updatedTypes);
  };

  return loading ? (
    <Loading />
  ) : (
    <Box m="20px" className="main-application">
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
              gridTemplateColumns="repeat(3, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nom"
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
                label="Prix"
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
              {values.choice === "multiple" && (
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
              )}
              {values.choice === "multiple" && (
                <>
                  {Object.entries(ingrediantsByType).map(
                    ([typeName, ingredients]) => (
                      <FormControl
                        key={typeName}
                        variant="filled"
                        fullWidth
                        sx={{ gridColumn: "span 1", gridRow: "4 / span 1" }}
                      >
                        <InputLabel id="ingrediants">
                          Selectioner les {typeName}
                        </InputLabel>
                        <Select
                          name="ingrediant"
                          labelId="ingrediants"
                          id="ingrediant"
                          value={values.ingrediant}
                          multiple
                          label="ingrediant"
                          onChange={(event) => {
                            const selectedIngredientIds = event.target.value;
                            const selectedMeatIngredients = [];
                            const selectedTypes = [];
                            Object.entries(ingrediantsByType).forEach(
                              ([typeName, ingredients]) => {
                                const selectedIngredientsOfType =
                                  ingredients.filter((ingredient) =>
                                    selectedIngredientIds.includes(
                                      ingredient._id
                                    )
                                  );
                                if (typeName.toLowerCase() === "meat") {
                                  selectedMeatIngredients.push(
                                    ...selectedIngredientsOfType
                                  );
                                }
                                if (selectedIngredientsOfType.length > 0) {
                                  selectedTypes.push({
                                    name: typeName,
                                    _id: selectedIngredientsOfType[0].type._id,
                                  });
                                }
                              }
                            );
                            updateTypes(selectedTypes);
                            console.log(selectedTypes);
                            setSelectedMeatIngredients(selectedMeatIngredients);
                            handleChange(event);
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
                          {ingredients.map((ingredient) => (
                            <MenuItem
                              key={ingredient._id}
                              value={ingredient._id}
                            >
                              {ingredient.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )
                  )}
                </>
              )}
              {values.choice === "multiple" && (
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Nombre de Viande"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.maxIngrediant}
                  name="maxIngrediant"
                  error={!!touched.maxIngrediant && !!errors.maxIngrediant}
                  helperText={touched.maxIngrediant && errors.maxIngrediant}
                  sx={{
                    gridColumn: "span 1",
                    gridRow: "5 / span 1",
                    display:
                      selectedMeatIngredients.length > 0 ? "block" : "none",
                  }}
                />
              )}
              <ReorderType onDragEnd={onDragEnd} types={types} />
              <FormControl
                variant="filled"
                fullWidth
                sx={{
                  gridColumn: "span 1",
                  gridRow: {
                    gridRow:
                      values.choice === "seul" ? "4 / span 1" : "6 / span 1",
                  },
                }}
              >
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
                    label="Composée"
                  />
                </RadioGroup>
              </FormControl>
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
