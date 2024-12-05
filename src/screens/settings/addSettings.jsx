import {
  Box,
  Button,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect } from "react";
import {
addSettings,
updateStatus,
getSettingsError,
getSettingsStatus,
getSettingsLoading,
getSettingsSuccess,
} from "../../features/settingSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../components/loading";
import { useNavigate } from "react-router-dom";
import TextFieldCompnent from "../../components/textFieldComponent";

const AddSettings = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const settingsSchema = yup.object().shape({
    currency: yup.string(),
    tva: yup.number(),
  });
  const initialValues = {
    currency: "",
    tva: 0,
  };
  const dispatch = useDispatch();
  const status = useSelector(getSettingsStatus);
  const error = useSelector(getSettingsError);
  const loading = useSelector(getSettingsLoading);
  const success = useSelector(getSettingsSuccess);
  const handleFormSubmit = (values) => {
    dispatch(
      addSettings({
        currency: values.currency,
      })
    );
  };
  useEffect(() => {
    if (status === "addSuccess") {
      toast.success(success);
      dispatch(updateStatus());
      navigate("/settings");
    } else if (status === "addError") {
      toast.error(error);
    }
  }, [status, error, dispatch, navigate, success]);

  return loading ? (
    <Loading />
  ) : (
    <Box m="20px">
      <Header title="MODIFIER PARAMAETRE" subtitle="Modifier les paramètre" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={settingsSchema}
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
                label="Devise"
                change={handleChange}
                value={values.currency}
                name="currency"
                blur={handleBlur}
                touched={touched.currency}
                error={errors.currency}
                colum="span 8"
                // row="1 / span 1"
              />
             
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Ajouter
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddSettings;
