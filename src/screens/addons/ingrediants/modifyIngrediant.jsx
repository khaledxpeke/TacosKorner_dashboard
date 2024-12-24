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
import ImageInput from "../../../components/imageInput";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../components/loading";
import {
  getIngrediantsStatus,
  getIngrediantsError,
  getIngrediantsSuccess,
  getIngrediantsLoading,
  updateStatus,
  modifyIngrediant,
} from "../../../features/ingrediantSlice";
import { selectAllTypes, getTypes } from "../../../features/typeSlice";
import { useLocation, useNavigate } from "react-router-dom";
import TextFieldCompnent from "../../../components/textFieldComponent";
import MultipleSelectComponent from "../../../components/multipleSelectComponent";

const ModifyIngrediant = () => {
  const location = useLocation();
  const data = location.state.ingrediant;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [displayLabel, setDisplayLabel] = useState(true);
  const dispatch = useDispatch();
  const status = useSelector(getIngrediantsStatus);
  const error = useSelector(getIngrediantsError);
  const loading = useSelector(getIngrediantsLoading);
  const success = useSelector(getIngrediantsSuccess);
  const navigate = useNavigate();
  const types = useSelector(selectAllTypes);

  const ingrediantSchema = yup.object().shape({
    name: yup.string().required("Nom est requis"),
    price: yup
      .number()
      .required("Le prix est requis")
      .min(0, "La prix minimal est 0"),
    suppPrice: yup
      .number()
      .required("Le prix est requis")
      .min(0, "La prix minimal est 0"),
    outOfStock: yup.boolean(),
    visible: yup.boolean(),
  });
  const initialValues = {
    name: data.name,
    price: data.price,
    types: data.types.map((type) => type._id) || [],
    suppPrice: data.suppPrice || 0,
    outOfStock: data.outOfStock,
    visible: data.visible,
  };

  const handleFormSubmit = (values) => {
    const requestBody = {
      name: values.name,
      price: values.price,
      suppPrice: values.suppPrice,
      outOfStock: values.outOfStock,
      types: values.types,
      ...(previewImage && { image: previewImage }),
    };
    dispatch(
      modifyIngrediant({
        body: requestBody,
        ingrediantId: data._id,
      })
    );
  };
  useEffect(() => {
    dispatch(getTypes());
  }, [dispatch]);
  useEffect(() => {
    if (status === "modifySuccess") {
      toast.success(success);
      dispatch(updateStatus());
      navigate("/ingrediants");
    } else if (status === "modifyError") {
      toast.error(error);
    }
  }, [status, error, dispatch, navigate, types, success]);

  return loading ? (
    <Loading />
  ) : (
    <Box m="20px" className="main-application">
      <Header title="MODIFIER INGREDIANT" subtitle="Modifier un ingrediant" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={ingrediantSchema}
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
                type="number"
                label="Prix"
                change={handleChange}
                value={values.price}
                name="price"
                blur={handleBlur}
                touched={touched.price}
                error={errors.price}
                colum="span 3"
                row="2 / span 1"
                num={0}
              />
              <TextFieldCompnent
                type="number"
                label="Prix supplémentaire"
                change={handleChange}
                value={values.suppPrice}
                name="suppPrice"
                blur={handleBlur}
                touched={touched.suppPrice}
                error={errors.suppPrice}
                colum="span 3"
                row="3 / span 1"
                num={0}
              />
              <ImageInput
                row="6 / span 1"
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                displayLabel={displayLabel}
                setDisplayLabel={setDisplayLabel}
                image={data.image}
              />
              <MultipleSelectComponent
                gridColumn="span 3"
                gridRow="5 / span 1"
                name="types"
                items={types}
                value={Array.isArray(values.types) ? values.types : []}
                change={(event) => {
                  const { value } = event.target;
                  handleChange({
                    target: {
                      name: "types",
                      value: Array.isArray(value) ? value : value.split(","),
                    },
                  });
                }}
              />
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 3", gridRow: "7 / span 1" }}
              >
                <FormLabel>On repture de stock :</FormLabel>
                <RadioGroup
                  name="outOfStock"
                  value={values.outOfStock}
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
                sx={{ gridColumn: "span 3", gridRow: "8 / span 1" }}
              >
                <FormLabel>Afficher cet ingrédient :</FormLabel>
                <RadioGroup
                  name="visible"
                  value={values.visible}
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
            </Box>
            <Box display="flex" justifyContent="start" mt="20px">
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

export default ModifyIngrediant;
