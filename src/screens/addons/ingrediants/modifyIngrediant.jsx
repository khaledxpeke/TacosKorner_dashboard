import { Box, Button } from "@mui/material";
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
  getIngrediantsStatus,
  getIngrediantsError,
  getIngrediantsSuccess,
  getIngrediantsLoading,
  updateStatus,
  modifyIngrediant,
} from "../../../features/ingrediantSlice";
import { selectAllTypes, getTypes } from "../../../features/typeSlice";
import { useLocation, useNavigate } from "react-router-dom";
import TextFieldCompnent from "../../../components/textFieldComponent";
import MultipleSelectComponent from "../../../components/multipleSelectComponent";
import RadioButtonComponent from "../../../components/radioButtonComponent";
import { getVariations, selectAllVariations } from "../../../features/variationSlice";

const ModifyIngrediant = () => {
  const location = useLocation();
  const data = location.state.ingrediant;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [displayLabel, setDisplayLabel] = useState(true);
  const dispatch = useDispatch();
  const status = useSelector(getIngrediantsStatus);
  const error = useSelector(getIngrediantsError);
  const loading = useSelector(getIngrediantsLoading);
  const success = useSelector(getIngrediantsSuccess);
  const navigate = useNavigate();
  const types = useSelector(selectAllTypes);
  const variations = useSelector(selectAllVariations);

  const ingrediantSchema = yup.object().shape({
    name: yup.string().required("Nom est requis"),
    price: yup
      .number()
      .required("Le prix est requis")
      .min(0, "La prix minimal est 0"),
    suppPrice: yup
      .number()
      .required("Le prix est requis")
      .min(0, "La prix minimal est 0"),
    outOfStock: yup.boolean(),
    visible: yup.boolean(),
    types: yup
      .array()
      .of(yup.string().required("Chaque option ne peut pas être vide"))
      .min(1, "Options ne peut pas être vide")
      .required("Options est requis"),
  });
  const initialValues = {
    name: data.name,
    price: data.price,
    types: data.types.map((type) => type._id) || [],
    variations: data.variations.map((variation) => variation._id) || [],
    suppPrice: data.suppPrice || 0,
    outOfStock: data.outOfStock,
    visible: data.visible,
  };

  const handleFormSubmit = (values) => {
    const requestBody = {
      name: values.name,
      price: values.price,
      suppPrice: values.suppPrice,
      outOfStock: values.outOfStock,
      visible: values.visible,
      types: values.types,
      variations: values.variations,
      ...(previewImage && { image: previewImage }),
    };
    dispatch(
      modifyIngrediant({
        body: requestBody,
        ingrediantId: data._id,
      })
    );
  };
  useEffect(() => {
    dispatch(getTypes());
    dispatch(getVariations());
  }, [dispatch]);
  useEffect(() => {
    if (status === "modifySuccess") {
      toast.success(success);
      dispatch(updateStatus());
      navigate("/ingrediants");
    } else if (status === "modifyError") {
      toast.error(error);
    }
  }, [status, error, dispatch, navigate, types, success]);

  return loading ? (
    <Loading />
  ) : (
    <Box m="20px" className="main-application">
      <Header title="MODIFIER INGREDIANT" subtitle="Modifier un ingrediant" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={ingrediantSchema}
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
                "& > div": { gridColumn: isNonMobile ? undefined : "span 6" },
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
                value={values.price}
                name="price"
                blur={handleBlur}
                touched={touched.price}
                error={errors.price}
                colum="span 3"
                row="2 / span 1"
                num={0}
              />
              <TextFieldCompnent
                type="number"
                label="Prix supplémentaire"
                change={handleChange}
                value={values.suppPrice}
                name="suppPrice"
                blur={handleBlur}
                touched={touched.suppPrice}
                error={errors.suppPrice}
                colum="span 3"
                row="3 / span 1"
                num={0}
              />
              <MultipleSelectComponent
                gridColumn="span 3"
                gridRow="4 / span 1"
                name="types"
                items={types}
                value={values.types}
                change={handleChange}
                touched={touched.types}
                error={errors.types}
              />
              <MultipleSelectComponent
                name="variations"
                gridColumn="span 3"
                gridRow="6 / span 1"
                items={variations}
                value={values.variations}
                change={handleChange}
              />
              <ImageInput
                row="7 / span 1"
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                displayLabel={displayLabel}
                setDisplayLabel={setDisplayLabel}
              />
              <RadioButtonComponent
                change={handleChange}
                colum="span 3"
                row="8 / span 1"
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
                row="9 / span 1"
                name="visible"
                radioText1="Non"
                radioText2="Oui"
                radioValue1={false}
                radioValue2={true}
                text="Afficher cet ingrédient :"
                value={values.visible}
              />
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
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

export default ModifyIngrediant;
