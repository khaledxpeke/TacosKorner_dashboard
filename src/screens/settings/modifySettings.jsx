import { Box, Button } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect } from "react";
import {
  modifySettings,
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

const ModifySettings = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const settingsSchema = yup.object().shape({
    tva: yup
      .number()
      .required("Le TVA est requis")
      .min(0, "Le TVA minimal est 0"),
    maxExtras: yup
      .number()
      .required("Les extras sont requis")
      .min(1, "L'extras minimal est 1"),
    maxDessert: yup
      .number()
      .required("Les désserts sont requis")
      .min(1, "Le déssert minimal est 1"),
    maxDrink: yup
      .number()
      .required("Les boissons sont requis")
      .min(1, "Le boisson minimal est 1"),
  });
  const initialValues = {
    tva: 0,
    maxExtras: 1,
    maxDessert: 1,
    maxDrink: 1,
  };
  const dispatch = useDispatch();
  const status = useSelector(getSettingsStatus);
  const error = useSelector(getSettingsError);
  const loading = useSelector(getSettingsLoading);
  const success = useSelector(getSettingsSuccess);
  const handleFormSubmit = (values) => {
    dispatch(
      modifySettings({
        tva: values.tva,
        maxExtras: values.maxExtras,
        maxDessert: values.maxDessert,
        maxDrink: values.maxDrink,
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
      <Header title="MODIFIER PARAMÈTRE" subtitle="Modifier les paramètres" />
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
                type="number"
                label="TVA"
                change={handleChange}
                value={values.tva}
                name="tva"
                blur={handleBlur}
                touched={touched.tva}
                error={errors.tva}
                colum="span 8"
                num={0}
              />
              <TextFieldCompnent
                type="number"
                label="Nombre max d'extras"
                change={handleChange}
                value={values.maxExtras}
                name="maxExtras"
                blur={handleBlur}
                touched={touched.maxExtras}
                error={errors.maxExtras}
                colum="span 8"
                num={1}
                onlyDigits={true}
              />
              <TextFieldCompnent
                type="number"
                label="Nombre max de désserts"
                change={handleChange}
                value={values.maxDessert}
                name="maxDessert"
                blur={handleBlur}
                touched={touched.maxDessert}
                error={errors.maxDessert}
                colum="span 8"
                num={1}
                onlyDigits={true}
              />
              <TextFieldCompnent
                type="number"
                label="Nombre max de boissons"
                change={handleChange}
                value={values.maxDrink}
                name="maxDrink"
                blur={handleBlur}
                touched={touched.maxDrink}
                error={errors.maxDrink}
                colum="span 8"
                num={1}
                onlyDigits={true}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
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

export default ModifySettings;
