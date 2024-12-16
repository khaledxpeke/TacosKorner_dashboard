import {
  TextField,
} from "@mui/material";


const TextFieldCompnent = ({type,label,change,value,name,blur,touched,error,colum,row,num,...otherProps}) => {
    const gridColumn = colum ? colum : undefined;
    const gridRow = row ? row : undefined;
    const getInputProps = () => {
      if (type === "number") {
        return {
          min: num || 0,
          onKeyDown: (e) => {
            if (e.key === '-') {
              e.preventDefault();
            }
          },
          step: "any"
        };
      }
      return {};
    };
  return (
    <TextField
    //   fullWidth
      variant="filled"
      type={type}
      label={label}
      onBlur={blur}
      onChange={change}
      value={value}
      name={name}
      error={!!touched && !!error}
      helperText={touched && error}
      sx={{ gridColumn: gridColumn, gridRow: gridRow  }}
      inputProps={getInputProps()}
      {...otherProps}
    />
  );
};

export default TextFieldCompnent;
