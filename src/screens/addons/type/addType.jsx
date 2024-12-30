import {
  Box,
  Button,
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
import RadioButtonComponent from "../../../components/radioButtonComponent";

const AddType = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const typeSchema = yup.object().shape({
    name: yup.string().required("Nom est requis"),
    message: yup.string(),
    max: yup
      .number()
      .required("Quantité maximal d'ingrédiant est requis")
      .min(1, "La quantité minimal est 1"),
    min: yup
      .number()
      .required("Quantité minimal d'ingrédiant est requis")
      .min(0, "La quantité minimal est 0")
      .test(
        "is-less-than-or-equal",
        "La quantité minimale doit être inférieure ou égale à la quantité maximale",
        function (value) {
          const { max } = this.parent;
          return value <= max;
        }
      ),
    payment: yup.boolean(),
    selection: yup.boolean(),
  });
  const initialValues = {
    name: "",
    message: "",
    max: 1,
    min: 0,
    payment: false,
    selection: false,
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
        max: values.max,
        min: values.min,
        payment: values.payment,
        selection: values.selection,
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
    <Box m="20px" className="main-application">
      <Header title="AJOUTER OPTION" subtitle="Créer une nouvelle option" />
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
                colum="span 3"
                row="1 / span 1"
              />
              <TextFieldCompnent
                type="text"
                label="Description"
                change={handleChange}
                value={values.message}
                name="message"
                blur={handleBlur}
                touched={touched.message}
                error={errors.message}
                colum="span 3"
                row="2 / span 1"
              />
              <TextFieldCompnent
                label="Quantité maximal d'ingrédients"
                type="number"
                change={handleChange}
                value={values.max}
                name="max"
                blur={handleBlur}
                touched={touched.max}
                error={errors.max}
                colum="span 3"
                row="3 / span 1"
                num={1}
                onlyDigits={true}
              />
              <TextFieldCompnent
                label="Quantité minimal d'ingrédients"
                type="number"
                change={handleChange}
                value={values.min}
                name="min"
                blur={handleBlur}
                touched={touched.min}
                error={errors.min}
                colum="span 3"
                row="4 / span 1"
                num={0}
                onlyDigits={true}
              />
              <RadioButtonComponent
                change={handleChange}
                colum="span 3"
                row="5 / span 1"
                name="payment"
                radioText1="Non"
                radioText2="Oui"
                radioValue1={false}
                radioValue2={true}
                text="Tous les ingrédients sont payants :"
                value={values.payment}
              />
              <RadioButtonComponent
                change={handleChange}
                colum="span 3"
                row="6 / span 1"
                name="selection"
                radioText1="Seul"
                radioText2="Multiple"
                radioValue1={false}
                radioValue2={true}
                text="Type de sélection :"
                value={values.selection}
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

export default AddType;
