import { Box, Button } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import ImageInput from "../../../components/imageInput";
import { useEffect, useState } from "react";
import {
  getCategoriesError,
  getCategoriesStatus,
  updateStatus,
  getCategoriesLoading,
  getCategoriesSuccess,
  modifyCategory,
} from "../../../features/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../components/loading";
import { useLocation, useNavigate } from "react-router-dom";
import TextFieldCompnent from "../../../components/textFieldComponent";

const ModifyCategory = () => {
  const location = useLocation();
  const data = location.state.category;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [displayLabel, setDisplayLabel] = useState(true);
  const navigate = useNavigate();
  const productSchema = yup.object().shape({
    name: yup.string().required("Nom est requis"),
  });
  const initialValues = {
    name: data.name,
  };
  const dispatch = useDispatch();
  const status = useSelector(getCategoriesStatus);
  const error = useSelector(getCategoriesError);
  const success = useSelector(getCategoriesSuccess);
  const loading = useSelector(getCategoriesLoading);
  const handleFormSubmit = (values) => {
    const requestBody = {
      name: values.name,
      ...(previewImage && { image: previewImage }),
    };
    dispatch(modifyCategory({ body: requestBody, categoryId: data._id }));
  };
  useEffect(() => {
    if (status === "modifySuccess") {
      toast.success(success);
      dispatch(updateStatus());
      navigate("/category");
    } else if (status === "modifyError") {
      toast.error(error);
    }
  }, [status, error, success, dispatch, navigate]);

  return loading ? (
    <Loading />
  ) : (
    <Box m="20px" className="main-application">
      <Header title="MODIFIER CATÉGORIE" subtitle="Modifier une catégorie" />

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
              <ImageInput
                row="3 / span 1"
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                displayLabel={displayLabel}
                setDisplayLabel={setDisplayLabel}
                image={data.image}
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

export default ModifyCategory;
