import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import ImageInput from "../../../components/imageInput";
import { useEffect, useState } from "react";
import {
  addCategory,
  getCategoriesError,
  getCategoriesStatus,
  updateStatus,
  getCategoriesLoading,
} from "../../../features/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../components/loading";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [displayLabel, setDisplayLabel] = useState(true);
  const navigate = useNavigate();
  const productSchema = yup.object().shape({
    name: yup.string().required("required"),
  });
  const initialValues = {
    name: "",
  };
  const dispatch = useDispatch();
  const status = useSelector(getCategoriesStatus);
  const error = useSelector(getCategoriesError);
  const loading = useSelector(getCategoriesLoading);
  const handleFormSubmit = (values) => {
    dispatch(
      addCategory({
        name: values.name,
        image: previewImage,
      })
    );
  };
  useEffect(() => {
    if (status === "addSuccess") {
      toast.success("Category added successfully");
      dispatch(updateStatus());
      navigate("/category");
    } else if (status === "addError") {
      toast.error(error);
    }
  }, [status, error, dispatch, navigate]);

  return loading ? (
    <Loading />
  ) : (
    <Box m="20px">
      <Header
        title="AJOUTER CATEGORY"
        subtitle="Créer une nouvelle catégorie"
      />

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
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 8" }}
              />
              <ImageInput
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                displayLabel={displayLabel}
                setDisplayLabel={setDisplayLabel}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Créer une nouvelle catégorie
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddCategory;
