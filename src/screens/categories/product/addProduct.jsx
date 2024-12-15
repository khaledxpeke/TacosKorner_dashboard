import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  InputLabel,
  MenuItem,
  Select,
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
  getIngrediantsByType,
} from "../../../features/ingrediantSlice";
import {
  selectAllSupplements,
  getSupplements,
} from "../../../features/supplementSlice";
import { useNavigate } from "react-router-dom";
import ReorderType from "../../../components/reorderType";
import SelectComponent from "../../../components/selectComponent";
import TextFieldCompnent from "../../../components/textFieldComponent";
import MultipleSelectComponent from "../../../components/multipleSelectComponent";
import { getTypes, selectAllTypes } from "../../../features/typeSlice";

const AddProduct = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [displayLabel, setDisplayLabel] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const dispatch = useDispatch();
  const status = useSelector(getProductsStatus);
  const error = useSelector(getProductsError);
  const loading = useSelector(getProductsisLoading);
  const success = useSelector(getProductsSuccess);
  const navigate = useNavigate();
  const categories = useSelector(selectAllCategories);
  const typesWithIngrediants = useSelector(selectAllTypes);
  const supplements = useSelector(selectAllSupplements);
  const productSchema = yup.object().shape({
    name: yup.string().required("Nom est requis"),
    category: yup.string().required("categorie est requis"),
    ingrediant: yup.array().default(() => []),
    supplement: yup.array().default(() => []),
    currency: yup.string().required("Currency est requis"),
    price: yup.number().required("Prix est requis"),
    choice: yup.string().required("Choix est requis"),
    maxExtras: yup.number(),
    maxDessert: yup.number(),
    maxDrink: yup.number(),
  });
  const initialValues = {
    name: "",
    image: "",
    category: categories.length > 0 ? categories[0]._id : "",
    ingrediant: [],
    supplement: [],
    type: [],
    currency: "",
    price: "",
    choice: "seul",
    maxExtras: 1,
    maxDessert: 1,
    maxDrink: 1,
  };
  const [types, updateTypes] = useState([]);
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const updatedTypes = Array.from(selectedTypes);
    const [reorderedItem] = updatedTypes.splice(result.source.index, 1);

    updatedTypes.splice(result.destination.index, 0, reorderedItem);

    setSelectedTypes(updatedTypes);
  };
  const handleFormSubmit = (values) => {
    const selectedTypeIds = types.map((type) => type._id);
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
    const rules = types.map((type) => ({
      type: type._id,
      free: type.free || 1,
      quantity: type.quantity || 1,
    }));

    dispatch(
      addProduct({
        body: {
          name: values.name,
          image: previewImage,
          currency: values.currency,
          price: values.price,
          ingrediants,
          supplements,
          choice: values.choice,
          type: selectedTypeIds,
          rules: JSON.stringify(rules),
          maxExtras: values.maxExtras,
          maxDessert: values.maxDessert,
          maxDrink: values.maxDrink,
        },
        categoryId: values.category,
      })
    );
  };

  const handleTypeSelect = (event) => {
    const selectedTypeIds = event.target.value; 
    setSelectedTypes((prevTypes) => {
      return typesWithIngrediants.filter((type) =>
        selectedTypeIds.includes(type._id)
      );
    });
  };
  useEffect(() => {
    dispatch(getTypes());
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
              />
              <SelectComponent
                name="category"
                items={categories}
                value={values.category}
                change={handleChange}
              />
              {values.choice === "multiple" && (
                <>
                  <MultipleSelectComponent
                    change={handleChange}
                    items={supplements}
                    name="supplement"
                    value={values.supplement}
                  />
                  <Stack
                    flexWrap="wrap"
                    flexDirection="row"
                    sx={{
                      gridColumn: "span 2",
                      gridRow: "5 / span 1",
                      gap: "30px",
                    }}
                  >
                    <FormControl fullWidth  variant="filled">
                      <InputLabel id="type-select-label">
                        Select Types
                      </InputLabel>
                      <Select
                        labelId="type-select-label"
                        multiple
                        value={selectedTypes.map((type) => type._id)}
                        onChange={handleTypeSelect}
                      >
                        {typesWithIngrediants.map((type) => (
                          <MenuItem
                            key={type._id}
                            value={type._id}
                            sx={{
                              opacity: selectedTypes.some(
                                (selectedType) => selectedType._id === type._id
                              )
                                ? 1
                                : 0.6,
                              backgroundColor: selectedTypes.some(
                                (selectedType) => selectedType._id === type._id
                              )
                                ? "black !important"
                                : "transparent",
                              color: selectedTypes.includes(type._id)
                                ? "white"
                                : "inherit",
                            }}
                          >
                            {type.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                    <ReorderType onDragEnd={onDragEnd} types={selectedTypes} />
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
                Soumettre
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddProduct;
