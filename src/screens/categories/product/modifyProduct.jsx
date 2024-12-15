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
import { useLocation, useNavigate } from "react-router-dom";
import ReorderType from "../../../components/reorderType";
import SelectComponent from "../../../components/selectComponent";
import TextFieldCompnent from "../../../components/textFieldComponent";
const ModifyProduct = () => {
  const location = useLocation();
  const data = location.state.product || {};
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [displayLabel, setDisplayLabel] = useState(true);
  const ingrediantsByType = useSelector(selectAllIngrediants) || {};
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
              <TextFieldCompnent
                type="text"
                label="Nom"
                change={handleChange}
                value={values.name}
                name="name"
                blur={handleBlur}
                touched={touched.name}
                error={errors.name}
                colum="span 2"
                row="1 / span 1"
              />
              <TextFieldCompnent
                type="number"
                label="Prix"
                change={handleChange}
                value={values.price || 0}
                name="price"
                blur={handleBlur}
                touched={touched.price}
                error={errors.price}
                colum="span 1"
                row="1 / span 1"
                num={0}
              />
              <TextFieldCompnent
                type="text"
                label="Currency"
                change={handleChange}
                value={values.currency}
                name="currency"
                blur={handleBlur}
                touched={touched.currency}
                error={errors.currency}
                colum="span 1"
                row="1 / span 1"
              />
              <ImageInput
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                displayLabel={displayLabel}
                setDisplayLabel={setDisplayLabel}
                image={data.image}
              />

              <SelectComponent
                name="category"
                items={categories}
                value={values.category}
                change={handleChange}
              />

              {values.choice === "multiple" && (
                <>
                  <Stack
                    flexWrap="wrap"
                    flexDirection="row"
                    sx={{
                      gridColumn: "span 2",
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
                                      _id: selectedIngredientsOfType[0].type
                                        ._id,
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
                                inputProps={{ min: 0 }}
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
                                inputProps={{ min: 1 }}
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
                     <TextFieldCompnent
                      type="number"
                      label="Max Extras"
                      change={handleChange}
                      value={values.maxExtras}
                      name="maxExtras"
                      blur={handleBlur}
                      touched={touched.maxExtras}
                      error={errors.maxExtras}
                      // sx={{ minWidth: "200px" }}
                      num={1}
                    />
                    <TextFieldCompnent
                      type="number"
                      label="Max Dessert"
                      change={handleChange}
                      value={values.maxDessert}
                      name="maxDessert"
                      blur={handleBlur}
                      touched={touched.maxDessert}
                      error={errors.maxDessert}
                      // sx={{ minWidth: "200px" }}
                      num={1}
                    />
                    <TextFieldCompnent
                      type="number"
                      label="Max Drink"
                      change={handleChange}
                      value={values.maxDrink}
                      name="maxDrink"
                      blur={handleBlur}
                      touched={touched.maxDrink}
                      error={errors.maxDrink}
                      // sx={{ minWidth: "200px" }}
                      num={1}
                    />
                  </Stack>
                  <Stack
                    flexWrap="wrap"
                    flexDirection="row"
                    sx={{
                      gridColumn: "span 1",
                      gridRow: "5 / span 1",
                    }}
                  >
                    <ReorderType
                      onDragEnd={onDragEnd}
                      types={types}
                      sx={{
                        gridColumn: "span 1",
                        gridRow: {
                          gridRow:
                            values.choice === "seul"
                              ? "4 / span 1"
                              : "4 / span 1",
                        },
                      }}
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
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Modifier
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ModifyProduct;
