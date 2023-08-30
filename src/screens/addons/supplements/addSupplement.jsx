import {
    Box,
    Button,
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
addSupplement,getSupplementsError,getSupplementsStatus,getSupplementsSuccess,updateStatus,getSupplementsLoading
  } from "../../../features/supplementSlice";
  import { useNavigate } from "react-router-dom";
  
  const AddSupplement = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [previewImage, setPreviewImage] = useState(null);
    const [displayLabel, setDisplayLabel] = useState(true);
    const dispatch = useDispatch();
    const status = useSelector(getSupplementsStatus);
    const error = useSelector(getSupplementsError);
    const loading = useSelector(getSupplementsLoading);
    const success = useSelector(getSupplementsSuccess);
    const navigate = useNavigate();
  
    const ingrediantSchema = yup.object().shape({
      name: yup.string().required("Nom est requis"),
      price: yup.number().required("Prix est requis"),
    });
    const initialValues = {
      name: "",
      image: "",
      price: "",
    };
    const handleFormSubmit = (values) => {
      dispatch(
        addSupplement({
          name: values.name,
          image: previewImage,
          price: values.price,
        })
      );
    };
    useEffect(() => {
      if (status === "addSuccess") {
        toast.success(success);
        dispatch(updateStatus());
        navigate("/supplements");
      } else if (status === "addError") {
        toast.error(error);
      }
    }, [status, error, dispatch, navigate, success]);
  
    return loading ? (
      <Loading />
    ) : (
      <Box m="20px" className="main-application">
        <Header title="AJOUTER SUPPLEMENT" subtitle="Créer une nouvelle supplement" />
  
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
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Nom"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 4", gridRow: "1 / span 1" }}
                />
                <ImageInput
                  sx={{ gridColumn: "span 2", gridRow: "2 / span 2" }}
                  previewImage={previewImage}
                  setPreviewImage={setPreviewImage}
                  displayLabel={displayLabel}
                  setDisplayLabel={setDisplayLabel}
                />
                 <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Prix"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                error={!!touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                sx={{ gridColumn: "span 1", gridRow: "1 / span 1" }}
              />
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Créer une nouvelle supplement
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    );
  };
  
  export default AddSupplement;
  