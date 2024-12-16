import {
  Box,
  Button,
  Checkbox,
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
    quantity: yup
      .number()
      .required("Quantité d'ingrédiant est requis")
      .min(1, "La quantité minimal est 1"),
    payment: yup.boolean(),
    selection: yup.boolean(),
    isRequired: yup.boolean(),
  });
  const initialValues = {
    name: "",
    message: "",
    quantity: 1,
    payment: false,
    selection: false,
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
        quantity: values.quantity,
        payment: values.payment,
        selection: values.selection,
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
                colum="span 8"
              />
              <TextFieldCompnent
                label="Quantité d'ingrédients"
                type="number"
                change={handleChange}
                value={values.quantity}
                name="quantity"
                blur={handleBlur}
                touched={touched.quantity}
                error={errors.quantity}
                colum="span 8"
                num={1}
              />
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 8" }}
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
                sx={{ gridColumn: "span 8" }}
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.isRequired}
                    onChange={handleChange}
                    name="isRequired"
                  />
                }
                sx={{ gridColumn: "span 6" }}
                label="Requis (Il faut choisir au moins un ingrédient pour continuer)"
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
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
