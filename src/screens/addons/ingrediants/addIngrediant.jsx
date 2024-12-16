import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
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
  addIngrediant,
  getIngrediantsStatus,
  getIngrediantsError,
  getIngrediantsSuccess,
  getIngrediantsLoading,
  updateStatus,
} from "../../../features/ingrediantSlice";
import { selectAllTypes, getTypes } from "../../../features/typeSlice";
import { useNavigate } from "react-router-dom";
import TextFieldCompnent from "../../../components/textFieldComponent";
import MultipleSelectComponent from "../../../components/multipleSelectComponent";

const AddIngrediant = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [displayLabel, setDisplayLabel] = useState(true);
  const [typeError, setTypeError] = useState(false);
  const dispatch = useDispatch();
  const status = useSelector(getIngrediantsStatus);
  const error = useSelector(getIngrediantsError);
  const loading = useSelector(getIngrediantsLoading);
  const success = useSelector(getIngrediantsSuccess);
  const navigate = useNavigate();
  const types = useSelector(selectAllTypes);

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
    inStock: yup.boolean(),
  });
  const initialValues = {
    name: "",
    image: "",
    price: 0,
    suppPrice: 0,
    types: [],
    inStock: false,
  };
  const handleFormSubmit = (values) => {
    if (values.types.length === 0) {
      setTypeError(true);
      return;
    }
    const formData = {
      name: values.name,
      price: values.price,
      image: previewImage,
      typeIds: values.types,
    };
    dispatch(addIngrediant(formData));
  };
  useEffect(() => {
    dispatch(getTypes());
  }, [dispatch]);

  useEffect(() => {
    if (status === "addSuccess") {
      toast.success(success);
      navigate("/ingrediants");
    } else if (status === "addError") {
      toast.error(error);
    }
    dispatch(updateStatus());
  }, [status, error, dispatch, navigate, types, success]);

  return loading ? (
    <Loading />
  ) : (
    <Box m="20px" className="main-application">
      <Header
        title="AJOUTER INGREDIANT"
        subtitle="Créer une nouvelle ingrediant"
      />

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
            <Box display="flex" flexDirection="column" gap="30px">
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
                value={values.price}
                name="price"
                blur={handleBlur}
                touched={touched.price}
                error={errors.price}
                colum="span 2"
                row="1 / span 1"
                inputProps={{ min: 0 }}
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
                colum="span 2"
                row="1 / span 1"
                inputProps={{ min: 0 }}
              />
              <ImageInput
                sx={{ gridColumn: "span 4", gridRow: "2 / span 1" }}
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                displayLabel={displayLabel}
                setDisplayLabel={setDisplayLabel}
              />
              <MultipleSelectComponent
                name="types"
                items={types}
                value={values.types}
                change={(e) => {
                  handleChange(e);
                  setTypeError(false);
                }}
                error={typeError}
              />
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 8" }}
              >
                <FormLabel>On repture de stock :</FormLabel>
                <RadioGroup
                  name="inStock"
                  value={values.inStock}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Non"
                  />
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Oui"
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

export default AddIngrediant;
