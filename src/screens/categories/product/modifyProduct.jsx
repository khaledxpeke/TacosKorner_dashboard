import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
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
import { getIngrediantsByType } from "../../../features/ingrediantSlice";
import { useLocation, useNavigate } from "react-router-dom";
import SelectComponent from "../../../components/selectComponent";
import TextFieldCompnent from "../../../components/textFieldComponent";
import { getTypes, selectAllTypes } from "../../../features/typeSlice";
import RadioButtonComponent from "../../../components/radioButtonComponent";
import MultipleSelectComponent from "../../../components/multipleSelectComponent";
import {
  getVariations,
  selectAllVariations,
} from "../../../features/variationSlice";
import Reorder from "../../../components/reorder";
const ModifyProduct = () => {
  const location = useLocation();
  const data = location.state.product || {};
  const categoryId = location.state.categoryId;
  const categoryName = location.state.categoryName;
  console.log(data);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [displayLabel, setDisplayLabel] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState(
    data.type.map((typ) => ({
      name: typ.name,
      _id: typ._id,
    }))
  );
  // const [selectedTypes, setSelectedTypes] = useState(
  //   data.type.map((typ) => ({
  //     _id: typ,
  //   }))
  // );
  const dispatch = useDispatch();
  const status = useSelector(getProductsStatus);
  const error = useSelector(getProductsError);
  const loading = useSelector(getProductsisLoading);
  const success = useSelector(getProductsSuccess);
  const typesWithIngrediants = useSelector(selectAllTypes);
  const variations = useSelector(selectAllVariations);
  const navigate = useNavigate();
  const categories = useSelector(selectAllCategories);
  const productSchema = yup.object().shape({
    name: yup.string().required("Nom est requis"),
    description: yup.string(),
    category: yup.string().required("categorie est requis"),
    type: yup.array().default(() => []),
    price: yup.number().required("Prix est requis"),
    choice: yup.string().required("Choix est requis"),
    outOfStock: yup.boolean(),
    visible: yup.boolean(),
    maxExtras: yup.number(),
    maxDessert: yup.number(),
    maxDrink: yup.number(),
  });
  const initialValues = {
    name: data.name,
    description: data.description,
    category: categories.some((category) => category._id === data.category)
      ? data.category
      : "",
    price: data.price,
    outOfStock: data.outOfStock,
    visible: data.visible,
    choice: data.choice,
    type: data.type || [],
    variations:
      data?.variations?.map((v) => ({
        _id: v._id,
        price: v.price || 0,
      })) || [],
    maxExtras: data.maxExtras || 1,
    maxDessert: data.maxDessert || 1,
    maxDrink: data.maxDrink || 1,
  };
  const handleFormSubmit = (values) => {
    const selectedTypeIds = selectedTypes.map((type) => type._id);
    const requestBody = {
      name: values.name,
      description: values.description,
      price: values.price,
      category: values.category,
      choice: values.choice,
      outOfStock: values.outOfStock,
      visible: values.visible,
      ...(previewImage && { image: previewImage }),
      type: selectedTypeIds.join(","),
      maxExtras: values.maxExtras,
      maxDessert: values.maxDessert,
      maxDrink: values.maxDrink,
      variations: values.variations,
    };
    dispatch(
      modifyProduct({
        body: requestBody,
        productId: data._id,
      })
    );
  };
  const handleTypeSelect = (event) => {
    const selectedTypeIds = event.target.value;
    const newSelectedTypes = typesWithIngrediants.filter((type) =>
      selectedTypeIds.includes(type._id)
    );
    setSelectedTypes(newSelectedTypes);
  };
  useEffect(() => {
    dispatch(getTypes());
    dispatch(getVariations());
    dispatch(fetchCategories());
    dispatch(getIngrediantsByType());
    if (status === "modifySuccess") {
      toast.success(success);
      dispatch(updateStatus());
      navigate("/product", {
        state: { categoryId: categoryId, categoryName: categoryName },
      });
    } else if (status === "modifyError") {
      toast.error(error);
    }
  }, [status, error, dispatch, navigate, success, categoryId, categoryName]);
  // const onDragEnd = (result) => {
  //   if (!result.destination) {
  //     return;
  //   }

  //   const updatedTypes = Array.from(selectedTypes);
  //   const [reorderedItem] = updatedTypes.splice(result.source.index, 1);

  //   updatedTypes.splice(result.destination.index, 0, reorderedItem);

  //   setSelectedTypes(updatedTypes);
  // };

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
                image={data.image}
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
                  <Stack
                    flexWrap="wrap"
                    flexDirection="row"
                    sx={{
                      gridColumn: "span 3",
                      gridRow: "9 / span 1",
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
                      gridColumn: "span 2",
                      gridRow: "9 / span 1",
                    }}
                  >
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
                  </Stack>
                  <MultipleSelectComponent
                    name="variations"
                    gridColumn="span 3"
                    gridRow="10 / span 1"
                    items={variations}
                    value={values.variations.map((v) => v._id)}
                    change={(e) => {
                      const selectedVariations = e.target.value.map(
                        (variationId) => ({
                          _id: variationId,
                          price:
                            values.variations.find((v) => v._id === variationId)
                              ?.price || 0,
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
                  {values.variations.map((variation, index) => (
                    <TextFieldCompnent
                      key={variation._id}
                      type="number"
                      label={`Prix pour ${
                        variations.find((v) => v._id === variation._id)?.name
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

export default ModifyProduct;
