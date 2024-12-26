import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
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
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 3", gridRow: "5 / span 1" }}
              >
                <FormLabel>Tous les ingrédients sont payants :</FormLabel>
                <RadioGroup
                  name="payment"
                  value={values.payment}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Non"
                  />
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Oui"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 3", gridRow: "6 / span 1" }}
              >
                <FormLabel>Type de sélection :</FormLabel>
                <RadioGroup
                  name="selection"
                  value={values.selection}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Seul"
                  />
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Multiple"
                  />
                </RadioGroup>
              </FormControl>
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
