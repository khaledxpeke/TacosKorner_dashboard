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
  addIngrediant,
  getIngrediantsStatus,
  getIngrediantsError,
  getIngrediantsSuccess,
  getIngrediantsLoading,
  updateStatus,
} from "../../../features/ingrediantSlice";
import { selectAllTypes, getTypes } from "../../../features/typeSlice";
import { useNavigate } from "react-router-dom";
import SelectComponent from "../../../components/selectComponent";
import TextFieldCompnent from "../../../components/textFieldComponent";

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
  });
  const initialValues = {
    name: "",
    image: "",
    price: 0,
    type: types.length > 0 ? types[0]._id : "",
  };
  const handleFormSubmit = (values) => {
    if (!values.type) {
      setTypeError(true);
      return;
    }
    const formData = {
      name: values.name,
      price: values.price,
      image: previewImage,
      typeId: values.type,
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
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(3, minmax(0, 1fr))"
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
                colum="span 4"
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
                colum="span 1"
                row="1 / span 1"
                // num={0}
              />
              <ImageInput
                sx={{ gridColumn: "span 4", gridRow: "2 / span 1" }}
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                displayLabel={displayLabel}
                setDisplayLabel={setDisplayLabel}
              />
              <SelectComponent
                name="type"
                items={types}
                value={values.type}
                change={(e) => {
                  handleChange(e);
                  setTypeError(false);
                }}
                error={typeError}
              />
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
