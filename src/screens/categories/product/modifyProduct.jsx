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
  Stack,
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
  getIngrediantsByType,
} from "../../../features/ingrediantSlice";
import {
  selectAllSupplements,
  getSupplements,
} from "../../../features/supplementSlice";
import { useLocation, useNavigate } from "react-router-dom";
import ReorderType from "../../../components/reorderType";
// import * as uuid from "uuid";

const ModifyProduct = () => {
  const location = useLocation();
  const data = location.state.product || {};
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [displayLabel, setDisplayLabel] = useState(true);
  const ingrediantsByType = useSelector(selectAllIngrediants) || {};
  const supplements = useSelector(selectAllSupplements);
  const dispatch = useDispatch();
  const status = useSelector(getProductsStatus);
  const error = useSelector(getProductsError);
  const loading = useSelector(getProductsisLoading);
  const success = useSelector(getProductsSuccess);
  const navigate = useNavigate();
  const categories = useSelector(selectAllCategories);
  const productSchema = yup.object().shape({
    name: yup.string().required("Nom est requis"),
    category: yup.string().required("categorie est requis"),
    ingrediant: yup.array().default(() => []),
    supplement: yup.array().default(() => []),
    types: yup.array().default(() => []),
    currency: yup.string().required("Currency est requis"),
    price: yup.number().required("Prix est requis"),
    choice: yup.string().required("Choix est requis"),
    maxExtras: yup.number(),
    maxDessert: yup.number(),
    maxDrink: yup.number(),
  });
  const typesWithRules = data?.type.map((typ) => {
    const rule = data?.rules.find((rule) => rule?.type === typ._id);
    return {
      name: typ.name,
      _id: typ._id,
      free: rule?.free || 0,
      quantity: rule?.quantity || 1,
    };
  });
  const initialValues = {
    name: data.name,
    category: categories.some((category) => category._id === data.category)
      ? data.category
      : "",
    ingrediant: data.ingrediants,
    supplement: data.supplements,
    currency: data.currency,
    price: data.price,
    choice: data.choice,
    types: typesWithRules,
    free: 0,
    quantity: 1,
    rules: data.rules,
    maxExtras: data.maxExtras || 1,
    maxDessert: data.maxDessert || 1,
    maxDrink: data.maxDrink || 1,
  };
  const handleFormSubmit = (values) => {
    const ingrediants =
      values.choice === "multiple"
        ? values.ingrediant.length > 0
          ? values.ingrediant.map((ingredient) => ingredient._id).join(",")
          : []
        : [];
    const supplements =
      values.choice === "multiple"
        ? values.supplement.length > 0
          ? values.supplement.join(",")
          : []
        : [];
    const reorderedRules = types.map((type) => {
      const rule = values.rules.find((rule) => rule.type === type._id);
      return {
        ...rule,
        type: type._id,
      };
    });
    const requestBody = {
      name: values.name,
      currency: values.currency,
      price: values.price,
      category: values.category,
      ingrediants,
      supplements,
      choice: values.choice,
      ...(previewImage && { image: previewImage }),
      type: types.map((item) => item._id).join(","),
      rules: reorderedRules,
      maxExtras: values.maxExtras,
      maxDessert: values.maxDessert,
      maxDrink: values.maxDrink,
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
    dispatch(getIngrediantsByType());
    dispatch(getSupplements());
    if (status === "modifySuccess") {
      toast.success(success);
      dispatch(updateStatus());
      navigate("/product");
    } else if (status === "modifyError") {
      toast.error(error);
    }
  }, [status, error, dispatch, navigate, success]);
  const [types, updateTypes] = useState(
    data.type.map((typ) => ({
      name: typ.name,
      _id: typ._id,
    }))
  );
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
              gridTemplateColumns="repeat(1fr, 1fr)"
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
                <Stack
                    flexWrap="wrap"
                    flexDirection="row"
                    sx={{
                      gridColumn: "span 4",
                      gridRow: "5 / span 1",
                      gap: "30px",
                    }}
                  >
                  {Object.entries(ingrediantsByType).map(
                    ([typeName, ingredients], index) => (
                      <FormControl
                        key={typeName}
                        variant="filled"
                        sx={{ minWidth: "200px" }}
                      >
                        <InputLabel id="ingrediants">
                          Selectioner les {typeName}
                        </InputLabel>
                        <Select
                          name="ingrediant"
                          labelId="ingrediants"
                          id="ingrediant"
                          value={values.ingrediant.map(
                            (ingredient) => ingredient._id
                          )}
                          multiple
                          label="ingrediant"
                          onChange={(event) => {
                            const selectedIngredientIds = event.target.value;
                            const selectedTypes = [];
                            const selectedIngredients = [];
                            Object.entries(ingrediantsByType).forEach(
                              ([typeName, ingredients]) => {
                                const selectedIngredientsOfType =
                                  ingredients.filter((ingredient) =>
                                    selectedIngredientIds.includes(
                                      ingredient._id
                                    )
                                  );
                                selectedIngredients.push(
                                  ...selectedIngredientsOfType
                                );
                                if (selectedIngredientsOfType.length > 0) {
                                  selectedTypes.push({
                                    name: typeName,
                                    _id: selectedIngredientsOfType[0].type._id,
                                  });
                                }
                              }
                            );
                            updateTypes(selectedTypes);
                            handleChange({
                              target: {
                                name: "ingrediant",
                                value: selectedIngredients.map(
                                  (ingredient) => ({
                                    _id: ingredient._id,
                                    type: ingredient.type._id,
                                  })
                                ),
                              },
                            });
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
                          {Array.isArray(ingredients) &&
                            ingredients.map((ingredient) => (
                              <MenuItem
                                key={ingredient._id}
                                value={ingredient._id}
                              >
                                {ingredient.name}
                              </MenuItem>
                            ))}
                        </Select>
                        {types.some(
                          (type) => type._id === ingredients[0].type._id
                        ) && (
                          <>
                            <TextField
                              label="Nombre d'ingrediant gratuit"
                              type="number"
                              defaultValue={
                                data.rules.find(
                                  (type) =>
                                    type.type === ingredients[0].type._id
                                )?.free || 0
                              }
                              onChange={(e) => {
                                const updatedRules = [...values.rules];
                                const ruleIndex = updatedRules.findIndex(
                                  (rule) =>
                                    rule.type === ingredients[0].type._id
                                );
                                console.log(values.rules);
                                if (ruleIndex !== -1) {
                                  updatedRules[ruleIndex] = {
                                    ...updatedRules[ruleIndex],
                                    free: parseInt(e.target.value),
                                  };
                                } else {
                                  updatedRules.push({
                                    _id: null,
                                    type: ingredients[0].type._id,
                                    free: parseInt(e.target.value),
                                    quantity: 1,
                                  });
                                }

                                handleChange({
                                  target: {
                                    name: "rules",
                                    value: updatedRules,
                                  },
                                });
                              }}
                            />
                            <TextField
                              label="Quantité d'ingrediant"
                              type="number"
                              defaultValue={
                                data.rules.find(
                                  (type) =>
                                    type.type === ingredients[0].type._id
                                )?.quantity || 1
                              }
                              onChange={(e) => {
                                const updatedRules = [...values.rules];
                                // hadhyy rule.type ta3mel f error lazem nchoofoolha 7all
                                const ruleIndex = updatedRules.findIndex(
                                  (rule) =>
                                    rule?.type === ingredients?.[0]?.type._id
                                );
                                console.log(values.rules);
                                if (ruleIndex !== -1) {
                                  updatedRules[ruleIndex] = {
                                    ...updatedRules[ruleIndex],
                                    quantity: parseInt(e.target.value),
                                  };
                                } else {
                                  updatedRules.push({
                                    _id: null,
                                    type: ingredients[0].type._id,
                                    free: 0,
                                    quantity: parseInt(e.target.value),
                                  });
                                }
                                handleChange({
                                  target: {
                                    name: "rules",
                                    value: updatedRules,
                                  },
                                });
                              }}
                            />
                          </>
                        )}
                      </FormControl>
                    )
                  )}
                  </Stack>
                  <Stack
                    flexDirection="row"
                    flexWrap="wrap"
                    sx={{
                      gridColumn: "span 4",
                      gridRow: "6 / span 1",
                      gap: "30px",
                    }}
                  >
                  <TextField
                    variant="filled"
                    type="number"
                    label="Max Extras"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.maxExtras}
                    name="maxExtras"
                    error={!!touched.maxExtras && !!errors.maxExtras}
                    helperText={touched.maxExtras && errors.maxExtras}
                    sx={{ minWidth: "200px" }}
                  />
                  <TextField
                    variant="filled"
                    type="number"
                    label="Max Dessert"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.maxDessert}
                    name="maxDessert"
                    error={!!touched.maxDessert && !!errors.maxDessert}
                    helperText={touched.maxDessert && errors.maxDessert}
                    sx={{ minWidth: "200px" }}
                  />
                  <TextField
                    variant="filled"
                    type="number"
                    label="max Drink"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.maxDrink}
                    name="maxDrink"
                    error={!!touched.maxDrink && !!errors.maxDrink}
                    helperText={touched.maxDrink && errors.maxDrink}
                    sx={{ minWidth: "200px" }}
                  />
                  </Stack>
                </>
              )}
              <FormControl
                variant="filled"
                fullWidth
                sx={{
                  gridColumn: "span 1",
                  gridRow: {
                    gridRow:
                      values.choice === "seul" ? "4 / span 1" : "4 / span 1",
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
              {values.choice === "multiple" && (
                <ReorderType
                  onDragEnd={onDragEnd}
                  types={types}
                  sx={{
                    gridColumn: "span 1",
                    gridRow: {
                      gridRow:
                        values.choice === "seul" ? "4 / span 1" : "4 / span 1",
                    },
                  }}
                />
              )}
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
