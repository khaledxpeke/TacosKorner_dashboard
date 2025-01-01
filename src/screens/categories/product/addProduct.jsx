import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
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
import SelectComponent from "../../../components/selectComponent";
import TextFieldCompnent from "../../../components/textFieldComponent";
import { getTypes, selectAllTypes } from "../../../features/typeSlice";
import RadioButtonComponent from "../../../components/radioButtonComponent";
import MultipleSelectComponent from "../../../components/multipleSelectComponent";
import { getVariations, selectAllVariations } from "../../../features/variationSlice";
import Reorder from "../../../components/reorder";

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
  const variations = useSelector(selectAllVariations);
  const productSchema = yup.object().shape({
    name: yup.string().required("Nom est requis"),
    description: yup.string(),
    category: yup.string().required("categorie est requis"),
    price: yup.number().required("Prix est requis"),
    choice: yup.string().required("Choix est requis"),
    outOfStock: yup.boolean(),
    visible: yup.boolean(),
    maxExtras: yup.number(),
    maxDessert: yup.number(),
    maxDrink: yup.number(),
  });
  const initialValues = {
    name: "",
    description: "",
    image: "",
    category: "",
    type: [],
    variations: [],
    price: 0,
    choice: "seul",
    outOfStock: false,
    visible: true,
    maxExtras: 1,
    maxDessert: 1,
    maxDrink: 1,
  };
  // const onDragEnd = (result) => {
  //   if (!result.destination) {
  //     return;
  //   }
  //   const updatedTypes = Array.from(selectedTypes);
  //   const [reorderedItem] = updatedTypes.splice(result.source.index, 1);
  //   updatedTypes.splice(result.destination.index, 0, reorderedItem);
  //   setSelectedTypes(updatedTypes);
  // };

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
          outOfStock: values.outOfStock,
          visible: values.visible,
          type: selectedTypeIds,
          maxExtras: values.maxExtras,
          maxDessert: values.maxDessert,
          maxDrink: values.maxDrink,
          variations: values.variations,
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
    dispatch(getVariations());
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
      <Header title="AJOUTER PRODUIT" subtitle="Créer un nouveau produit" />
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
          setFieldValue,
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
              <TextFieldCompnent
                multiline
                maxRows={4}
                type="text"
                label="Description"
                change={handleChange}
                value={values.description}
                name="description"
                blur={handleBlur}
                touched={touched.description}
                error={errors.description}
                colum="span 3"
                row="3 / span 1"
              />
              <SelectComponent
                gridColumn="span 3"
                gridRow="4 / span 1"
                name="category"
                items={categories}
                value={values.category}
                change={handleChange}
              />
              <ImageInput
                row="5 / span 1"
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                displayLabel={displayLabel}
                setDisplayLabel={setDisplayLabel}
              />
              <RadioButtonComponent
                change={handleChange}
                colum="span 3"
                row="6 / span 1"
                name="outOfStock"
                radioText1="Non"
                radioText2="Oui"
                radioValue1={false}
                radioValue2={true}
                text="On repture de stock :"
                value={values.outOfStock}
              />
              <RadioButtonComponent
                change={handleChange}
                colum="span 3"
                row="7 / span 1"
                name="visible"
                radioText1="Non"
                radioText2="Oui"
                radioValue1={false}
                radioValue2={true}
                text="Afficher cet ingrédient :"
                value={values.visible}
              />
              <RadioButtonComponent
                change={handleChange}
                colum="span 3"
                row="8 / span 1"
                name="choice"
                radioText1="Seul"
                radioText2="Composée"
                radioValue1="seul"
                radioValue2="multiple"
                text="Choix du produit :"
                value={values.choice}
              />
              {values.choice === "multiple" && (
                <>
                  <Grid
                    container
                    spacing={2}
                    sx={{ gridColumn: "span 6", gridRow: "9 / span 1" }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={6}
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <FormControl fullWidth variant="filled">
                        <InputLabel id="type-select-label">
                          Sélectionner les options
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
                                  (selectedType) =>
                                    selectedType._id === type._id
                                )
                                  ? 1
                                  : 0.6,
                                backgroundColor: selectedTypes.some(
                                  (selectedType) =>
                                    selectedType._id === type._id
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
                      <Grid>
                        <MultipleSelectComponent
                          name="variations"
                          items={variations}
                          value={values.variations.map((v) => v._id)}
                          change={(e) => {
                            const selectedVariations = e.target.value.map(
                              (variationId) => ({
                                _id: variationId,
                                price:
                                  values.variations.find(
                                    (v) => v._id === variationId
                                  )?.price || 0,
                              })
                            );
                            handleChange({
                              target: {
                                name: "variations",
                                value: selectedVariations,
                              },
                            });
                          }}
                        />
                      </Grid>
                      <Grid
                        xs={12}
                        md={6}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {values.variations.map((variation, index) => (
                          <TextFieldCompnent
                            key={variation._id}
                            type="number"
                            label={`Prix pour ${
                              variations.find((v) => v._id === variation._id)
                                ?.name
                            }`}
                            change={(e) => {
                              const newVariations = values.variations.map((v) =>
                                v._id === variation._id
                                  ? { ...v, price: Number(e.target.value) }
                                  : v
                              );
                              handleChange({
                                target: {
                                  name: "variations",
                                  value: newVariations,
                                },
                              });
                            }}
                            value={variation.price}
                            name={`variation-${variation.variation}-price`}
                            blur={handleBlur}
                            colum="span 2"
                            row={`${11 + index} / span 1`}
                            num={0}
                          />
                        ))}
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Reorder
                        items={selectedTypes}
                        onReorder={(newOrder) => {
                          setSelectedTypes(newOrder);
                          setFieldValue(
                            "types",
                            newOrder.map((type) => type._id)
                          );
                        }}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
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
