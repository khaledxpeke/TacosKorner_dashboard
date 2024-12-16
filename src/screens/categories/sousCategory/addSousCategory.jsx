import { Box, Button } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../components/loading";
import {
  getDesertsError,
  getDesertsStatus,
  getDesertsSuccess,
  updateStatus,
  getDesertsLoading,
} from "../../../features/desertSlice";
import { useNavigate } from "react-router-dom";
import TextFieldCompnent from "../../../components/textFieldComponent";

const AddSousCategory = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const dispatch = useDispatch();
  const status = useSelector(getDesertsStatus);
  const error = useSelector(getDesertsError);
  const loading = useSelector(getDesertsLoading);
  const success = useSelector(getDesertsSuccess);
  const navigate = useNavigate();

  const desertSchema = yup.object().shape({
    name: yup.string().required("Nom est requis"),
    message: yup.string(),
    items: yup.array().of(
      yup.object().shape({
        price: yup
          .number()
          .typeError("Prix doit être un nombre")
          .required("Prix est requis")
          .min(0, "Prix doit être positif"),
        name: yup.string().required("Nom est requis"),
      })
    ),
  });
  const initialValues = {
    name: "",
    message: "",
    items: [{ price: 0, name: "" }],
  };

  const handleFormSubmit = (values) => {
    // dispatch(
    //   addDesert({
    //     name: values.name,
    //     price: values.price,
    //     items: values.items,
    //   })
    // );
  };

  useEffect(() => {
    if (status === "addSuccess") {
      toast.success(success);
      dispatch(updateStatus());
      navigate("/desert");
    } else if (status === "addError") {
      toast.error(error);
    }
  }, [status, error, dispatch, navigate, success]);

  return loading ? (
    <Loading />
  ) : (
    <Box m="20px" className="main-application">
      <Header
        title="AJOUTER SOUS CATÉGORIE"
        subtitle="Créer un nouveau sous catégorie"
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={desertSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
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
                type="text"
                label="Description"
                change={handleChange}
                value={values.message}
                name="message"
                blur={handleBlur}
                touched={touched.message}
                error={errors.message}
                colum="span 3"
                row="1 / span 1"
              />
              {values.items.map((item, index) => (
                <Box key={index}>
                  <TextFieldCompnent
                    type="text"
                    label="Nom"
                    change={handleChange}
                    value={item.name}
                    name={`items[${index}].name`}
                    blur={handleBlur}
                    touched={touched?.items?.[index]?.name}
                    error={errors?.items?.[index]?.name}
                    colum="span 3"
                    row="1 / span 1"
                  />

                  <TextFieldCompnent
                    sx={{ my: 2 }}
                    type="number"
                    label="Prix"
                    change={handleChange}
                    value={item.price}
                    name={`items[${index}].price`}
                    blur={handleBlur}
                    touched={touched?.items?.[index]?.price}
                    error={errors?.items?.[index]?.price}
                    colum="span 3"
                    row="2 / span 1"
                  />
                  {index !== 0 && (
                    <Button
                      sx={{ mt: 2 }}
                      type="button"
                      color="error"
                      variant="contained"
                      onClick={() =>
                        setFieldValue(
                          "items",
                          values.items.filter((itm) => itm !== item)
                        )
                      }
                    >
                      Supprimer
                    </Button>
                  )}
                </Box>
              ))}

              <Button
                type="button"
                color="info"
                variant="contained"
                onClick={() =>
                  setFieldValue("items", [
                    ...values.items,
                    { name: "", price: 0, image: "" },
                  ])
                }
              >
                Ajouter une autre
              </Button>
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

export default AddSousCategory;
