import {
    Box,
    Button,
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
  import {addExtra,getExtraError,getExtraStatus,getExtraSuccess,getExtraLoading,updateStatus
 } from "../../../features/extraSlice";
  import { useNavigate } from "react-router-dom";
import TextFieldCompnent from "../../../components/textFieldComponent";
  
  const AddExtra = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [previewImage, setPreviewImage] = useState(null);
    const [displayLabel, setDisplayLabel] = useState(true);
    const dispatch = useDispatch();
    const status = useSelector(getExtraStatus);
    const error = useSelector(getExtraError);
    const loading = useSelector(getExtraLoading);
    const success = useSelector(getExtraSuccess);
    const navigate = useNavigate();
  
    const extraSchema = yup.object().shape({
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
        addExtra({
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
        navigate("/extra");
      } else if (status === "addError") {
        toast.error(error);
      }
    }, [status, error, dispatch, navigate, success]);
  
    return loading ? (
      <Loading />
    ) : (
      <Box m="20px" className="main-application">
        <Header title="AJOUTER EXTRAS" subtitle="Créer une nouvelle extra" />

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={extraSchema}
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
                  num={1}
                />
                <ImageInput
                  row="3 / span 1"
                  previewImage={previewImage}
                  setPreviewImage={setPreviewImage}
                  displayLabel={displayLabel}
                  setDisplayLabel={setDisplayLabel}
                />
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
  
  export default AddExtra;
  