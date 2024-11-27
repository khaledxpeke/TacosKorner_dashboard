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
  addType,
  getTypesError,
  getTypesStatus,
  getTypesSuccess,
  getTypesLoading,
  updateStatus,
} from "../../../features/typeSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../components/loading";
import { useNavigate } from "react-router-dom";
import TextFieldCompnent from "../../../components/textFieldComponent";

const AddType = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const typeSchema = yup.object().shape({
    name: yup.string().required("Nom est requis"),
    message: yup.string(),
    isRequired: yup.boolean(),
  });
  const initialValues = {
    name: "",
    message: "",
    isRequired: false,
  };
  const dispatch = useDispatch();
  const status = useSelector(getTypesStatus);
  const error = useSelector(getTypesError);
  const loading = useSelector(getTypesLoading);
  const success = useSelector(getTypesSuccess);
  const handleFormSubmit = (values) => {
    dispatch(
      addType({
        name: values.name,
        message: values.message,
        isRequired: values.isRequired,
      })
    );
  };
  useEffect(() => {
    if (status === "addSuccess") {
      toast.success(success);
      dispatch(updateStatus());
      navigate("/type");
    } else if (status === "addError") {
      toast.error(error);
    }
  }, [status, error, dispatch, navigate, success]);

  return loading ? (
    <Loading />
  ) : (
    <Box m="20px">
      <Header
        title="AJOUTER TYPE"
        subtitle="Créer une nouvelle type d'ingrédiant"
      />

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
              gridTemplateColumns="repeat(6, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 6" },
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
                  label="Requis"
                />
              </FormGroup>
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Créer une nouvelle type d'ingrédiant
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddType;
