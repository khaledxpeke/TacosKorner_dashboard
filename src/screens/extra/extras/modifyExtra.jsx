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
import {getExtraError,getExtraStatus,getExtraSuccess,getExtraLoading,updateStatus, modifyExtra
} from "../../../features/extraSlice";
import { useLocation, useNavigate } from "react-router-dom";
import TextFieldCompnent from "../../../components/textFieldComponent";

const ModifyExtra = () => {
  const location = useLocation();
  const data = location.state.extra;
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
    name: data.name,
    price: data.price,
  };
  const handleFormSubmit = (values) => {
    const requestBody = {
      name: values.name,
      price: values.price,
      ...(previewImage && { image: previewImage }),
    };
    dispatch(
      modifyExtra({
        body: requestBody,
        extraId: data._id
      })
    );
  };
  useEffect(() => {
    if (status === "modifySuccess") {
      toast.success(success);
      dispatch(updateStatus());
      navigate("/extra");
    } else if (status === "modifyError") {
      toast.error(error);
    }
  }, [status, error, dispatch, navigate, success]);

  return loading ? (
    <Loading />
  ) : (
    <Box m="20px" className="main-application">
      <Header title="MODIFIER Extra" subtitle="Modifier extra" />

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
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
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
                value={values.price || 0}
                name="price"
                blur={handleBlur}
                touched={touched.price}
                error={errors.price}
                colum="span 1"
                row="1 / span 1"
                num={1}
              />
              <ImageInput
                sx={{ gridColumn: "span 2", gridRow: "2 / span 2" }}
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                displayLabel={displayLabel}
                setDisplayLabel={setDisplayLabel}
                image={data.image}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Modifier le extra
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ModifyExtra;
