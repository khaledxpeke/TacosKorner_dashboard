import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { useEffect } from "react";
import {
  getTypesError,
  getTypesStatus,
  getTypesSuccess,
  getTypesLoading,
  updateStatus,
  modifyType,
} from "../../../features/typeSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../components/loading";
import { useLocation, useNavigate } from "react-router-dom";
import TextFieldCompnent from "../../../components/textFieldComponent";

const ModifyType = () => {
  const location = useLocation();
  const data = location.state.type;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const typeSchema = yup.object().shape({
    name: yup.string().required("Nom est requis"),
    message: yup.string(),
    isRequired: yup.boolean(),
  });
  const initialValues = {
    name: data.name,
    message: data.message,
    isRequired: data.isRequired,
  };
  const dispatch = useDispatch();
  const status = useSelector(getTypesStatus);
  const error = useSelector(getTypesError);
  const loading = useSelector(getTypesLoading);
  const success = useSelector(getTypesSuccess);
  const handleFormSubmit = (values) => {
    const requestBody = {
      name: values.name,
      message: values.message,
      isRequired: values.isRequired,
    };
    dispatch(
      modifyType({
        body: requestBody,
        typeId: data._id,
      })
    );
  };
  useEffect(() => {
    if (status === "modifySuccess") {
      toast.success(success);
      dispatch(updateStatus());
      navigate("/type");
    } else if (status === "modifyError") {
      toast.error(error);
    }
  }, [status, error, dispatch, navigate, success]);

  return loading ? (
    <Loading />
  ) : (
    <Box m="20px">
      <Header title="MODIFIER TYPE" subtitle="Modifier type d'ingrédiant" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={typeSchema}
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
                colum="span 8"
                // row="1 / span 1"
              />
              <TextFieldCompnent
                type="text"
                label="Message"
                change={handleChange}
                value={values.message}
                name="message"
                blur={handleBlur}
                touched={touched.message}
                error={errors.message}
                colum="span 8"
                // row="1 / span 1"
              />
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.isRequired}
                      onChange={handleChange}
                      name="isRequired"
                    />
                  }
                  label="requis"
                  checked={initialValues.isRequired}
                />
              </FormGroup>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Modifier le type d'ingrédiant
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ModifyType;
