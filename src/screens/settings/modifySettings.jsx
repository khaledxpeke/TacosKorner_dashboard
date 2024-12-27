import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import {
  updateStatus,
  getSettingsError,
  getSettingsStatus,
  getSettingsLoading,
  getSettingsSuccess,
  updateSetting,
} from "../../features/settingSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../components/loading";
import { useLocation, useNavigate } from "react-router-dom";
import TextFieldCompnent from "../../components/textFieldComponent";
import ImageInput from "../../components/imageInput";

const ModifySettings = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const location = useLocation();
  const data = location.state;
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [displayLogoLabel, setDisplayLogoLabel] = useState(true);
  const [displayBannerLabel, setDisplayBannerLabel] = useState(true);
  const settingsSchema = yup.object().shape({
    address: yup.string().required("L'addresse est requis"),
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
    card: yup
      .string()
      .required("Le label est requis")
      .max(20, "Le label doit être de longueur maximale 20"),
    cardActive: yup.boolean(),
    cash: yup
      .string()
      .required("Le label est requis")
      .max(20, "Le label doit être de longueur maximale 20"),
    cashActive: yup.boolean(),
  });
  const initialValues = {
    address: data?.address || "",
    tva: data?.tva || 0,
    maxDrink: data?.maxDrink || 1,
    maxDessert: data?.maxDessert || 1,
    maxExtras: data?.maxExtras || 1,
    card: data?.card?.trim() ? data.card : "Carte",
    cardId: data?.method?.[0]?._id,
    cardActive: data?.cardActive || true,
    cash: data?.cash?.trim() ? data.cash : "Espèces",
    cashActive: data?.cashActive || true,
    cashId: data?.method?.[1]?._id,
  };
  const dispatch = useDispatch();
  const status = useSelector(getSettingsStatus);
  const error = useSelector(getSettingsError);
  const loading = useSelector(getSettingsLoading);
  const success = useSelector(getSettingsSuccess);
  const handleFormSubmit = (values) => {
    const formData = new FormData();
    formData.append("tva", values.tva);
    formData.append("maxExtras", values.maxExtras);
    formData.append("maxDessert", values.maxDessert);
    formData.append("maxDrink", values.maxDrink);
    formData.append("address", values.address);

    const methods = [
      { label: values.card, isActive: values.cardActive, _id: values.cardId,},
      { label: values.cash, isActive: values.cashActive , _id: values.cashId,},
    ];

    formData.append("method", JSON.stringify(methods));
    if (logoPreview) {
      formData.append("logo", logoPreview);
    }
    if (bannerPreview) {
      formData.append("banner", bannerPreview);
    }
    dispatch(updateSetting(formData));
  };
  useEffect(() => {
    if (status === "modifySuccess") {
      toast.success(success);
      dispatch(updateStatus());
      navigate("/settings");
    } else if (status === "modifyError") {
      toast.error(error);
    }
  }, [status, error, dispatch, navigate, success]);

  return loading ? (
    <Loading />
  ) : (
    <Box m="20px">
      <Header
        title="MODIFIER LES PARAMÈTRES"
        subtitle="Modifier les paramètres"
      />
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
                multiline
                maxRows={4}
                type="text"
                label="Addresse de restaurant"
                change={handleChange}
                value={values.address}
                name="address"
                blur={handleBlur}
                touched={touched.address}
                error={errors.address}
                colum="span 8"
              />
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
                type="text"
                label="Label du paiement par carte"
                change={handleChange}
                value={values.card}
                name="card"
                blur={handleBlur}
                touched={touched.card}
                error={errors.card}
                colum="span 8"
              />
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 8" }}
              >
                <FormLabel>Acceptez-vous le paiement par carte :</FormLabel>
                <RadioGroup
                  name="cardActive"
                  value={values.cardActive}
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
              <TextFieldCompnent
                type="text"
                label="Label du paiement en espèces"
                change={handleChange}
                value={values.cash}
                name="cash"
                blur={handleBlur}
                touched={touched.cash}
                error={errors.cash}
                colum="span 8"
              />
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 8" }}
              >
                <FormLabel>Acceptez-vous le paiement en espèces :</FormLabel>
                <RadioGroup
                  name="cashActive"
                  value={values.cashActive}
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
              <Box sx={{ gridColumn: "span 4" }}>
                <Typography variant="h2" color="inherit">
                  Logo
                </Typography>
                <br />
                <ImageInput
                  inputId="logoInput"
                  previewImage={logoPreview}
                  setPreviewImage={setLogoPreview}
                  displayLabel={displayLogoLabel}
                  setDisplayLabel={setDisplayLogoLabel}
                  image={data.logo}
                />
              </Box>
              <Box sx={{ gridColumn: "span 4" }}>
                <Typography variant="h2" color="inherit">
                  Banner
                </Typography>
                <br />
                <ImageInput
                  inputId="bannerInput"
                  previewImage={bannerPreview}
                  setPreviewImage={setBannerPreview}
                  displayLabel={displayBannerLabel}
                  setDisplayLabel={setDisplayBannerLabel}
                  image={data.banner}
                />
              </Box>
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
