import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

const RadioButtonComponent = ({
  name,
  text,
  value,
  change,
  colum,
  row,
  radioText1,
  radioText2,
  radioValue1,
  radioValue2,
}) => {
  const gridColumn = colum ? colum : undefined;
  const gridRow = row ? row : undefined;
  return (
    <FormControl
      variant="filled"
      fullWidth
      sx={{ gridColumn: gridColumn, gridRow: gridRow }}
    >
      <FormLabel>{text}</FormLabel>
      <RadioGroup name={name} value={value} onChange={change} row>
        <FormControlLabel
          value={radioValue1}
          control={<Radio />}
          label={radioText1}
        />
        <FormControlLabel
          value={radioValue2}
          control={<Radio />}
          label={radioText2}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonComponent;
