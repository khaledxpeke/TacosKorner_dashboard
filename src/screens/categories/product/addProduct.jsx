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
import { getIngrediantsByType } from "../../../features/ingrediantSlice";
import { useNavigate } from "react-router-dom";
import ReorderType from "../../../components/reorderType";
import SelectComponent from "../../../components/selectComponent";
import TextFieldCompnent from "../../../components/textFieldComponent";
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
  const productSchema = yup.object().shape({
    name: yup.string().required("Nom est requis"),
    description: yup.string().required("description est requis"),
    category: yup.string().required("categorie est requis"),
    price: yup.number().required("Prix est requis"),
    choice: yup.string().required("Choix est requis"),
    maxExtras: yup.number(),
    maxDessert: yup.number(),
    maxDrink: yup.number(),
  });
  const initialValues = {
    name: "",
    description: "",
    image: "",
    category: categories.length > 0 ? categories[0]._id : "",
    type: [],
    price: 0,
    choice: "seul",
    maxExtras: 1,
    maxDessert: 1,
    maxDrink: 1,
  };
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
    const selectedTypeIds = selectedTypes.map((type) => type._id);

    dispatch(
      addProduct({
        body: {
          name: values.name,
          description: values.description,
          image: previewImage,
          price: values.price,
          choice: values.choice,
          type: selectedTypeIds,
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
              gridTemplateColumns="repeat(6, minmax(0, 1fr))"
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
                colum="span 3"
                row="1 / span 1"
              />
               <TextFieldCompnent
                type="text"
                label="Description"
                change={handleChange}
                value={values.description}
                name="description"
                blur={handleBlur}
                touched={touched.description}
                error={errors.description}
                colum="span 3"
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
                colum="span 3"
                row="2 / span 1"
                num={0}
              />
              <ImageInput
                row="3 / span 1"
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                displayLabel={displayLabel}
                setDisplayLabel={setDisplayLabel}
              />
              <SelectComponent
                gridColumn="span 3"
                gridRow="4 / span 1"
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
                      gridColumn: "span 3",
                      gridRow: "6 / span 1",
                      gap: "30px",
                    }}
                  >
                    <FormControl fullWidth variant="filled">
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
                    flexWrap="wrap"
                    flexDirection="row"
                    sx={{
                      gridColumn: "span 1",
                      gridRow: "6 / span 1",
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
                      values.choice === "seul" ? "5 / span 1" : "5 / span 1",
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

            <Box display="flex" justifyContent="start" mt="20px">
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
