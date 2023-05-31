import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
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
  addIngrediant,
  getIngrediantsStatus,
  getIngrediantsError,
  getIngrediantsSuccess,
  getIngrediantsLoading,
  updateStatus,
} from "../../../features/ingrediantSlice";
import { selectAllTypes, getTypes } from "../../../features/typeSlice";
import { useNavigate } from "react-router-dom";

const AddIngrediant = () => {
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
    name: yup.string().required("name is required"),
    type: yup.string().required("required"),
  });
  const initialValues = {
    name: "",
    image: "",
    type: types.length > 0 ? types[0]._id : "",
  };
  const handleFormSubmit = (values) => {
    dispatch(
      addIngrediant({
        name: values.name,
        image: previewImage,
        typeId: values.type,
      })
    );
  };
  useEffect(() => {
    dispatch(getTypes());
    if (status === "addSuccess") {
      toast.success(success);
      dispatch(updateStatus());
      navigate("/ingrediants");
    } else if (status === "addError") {
      toast.error(error);
    }
  }, [status, error, dispatch, navigate, types, success]);

  return loading ? (
    <Loading />
  ) : (
    <Box m="20px">
      <Header title="AJOUTER INGREDIANT" subtitle="Créer une nouvelle ingrediant" />

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
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2", gridRow: "1 / span 1" }}
              />

              <ImageInput
                sx={{ gridColumn: "span 4", gridRow: "2 / span 1" }}
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                displayLabel={displayLabel}
                setDisplayLabel={setDisplayLabel}
              />
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 2", gridRow: "3 / span 1" }}
              >
                <InputLabel id="types">
                  Selectioner une type d'ingrédiant
                </InputLabel>
                <Select
                  name="type"
                  labelId="types"
                  id="type"
                  value={values.type}
                  label="Type"
                  onChange={handleChange}
                  sx={{ gridColumn: "span 2" }}
                >
                  {types.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Créer une nouvelle ingrediant
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddIngrediant;
