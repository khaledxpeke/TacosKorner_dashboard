import {
  TextField,
} from "@mui/material";


const TextFieldCompnent = ({type,label,change,value,name,blur,touched,error,colum,row,num}) => {
    const inputProps = num ? { min: num } : undefined;
    const gridColumn = colum ? colum : undefined;
    const gridRow = row ? row : undefined;
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
      inputProps={{inputProps}}
    />
  );
};

export default TextFieldCompnent;
