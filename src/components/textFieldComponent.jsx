import { TextField } from "@mui/material";

const TextFieldCompnent = ({
  type,
  onlyDigits,
  label,
  change,
  value,
  name,
  blur,
  touched,
  error,
  colum,
  row,
  num,
  ...otherProps
}) => {
  const gridColumn = colum ? colum : undefined;
  const gridRow = row ? row : undefined;
  const getInputProps = () => {
    if (type === "number") {
      if (onlyDigits) {
        return {
          min: num || 0,
          onKeyDown: (e) => {
            if (e.key === "-" || e.key === ".") {
              e.preventDefault();
            }
          },
          step: "1",
        };
      } else {
        return {
          min: num || 0,
          onKeyDown: (e) => {
            if (e.key === "-") {
              e.preventDefault();
            }
          },
          step: "any",
        };
      }
    }
    return {};
  };
  return (
    <TextField
      variant="filled"
      type={type}
      label={label}
      onBlur={blur}
      onChange={change}
      value={value}
      name={name}
      error={!!touched && !!error}
      helperText={touched && error}
      sx={{ gridColumn: gridColumn, gridRow: gridRow }}
      inputProps={getInputProps()}
      {...otherProps}
    />
  );
};

export default TextFieldCompnent;
