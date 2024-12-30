import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const MultipleSelectComponent = ({
  name,
  items,
  value,
  change,
  gridColumn,
  gridRow,
  error,
  touched,
}) => {
  return (
    <FormControl
      variant="filled"
      fullWidth
      sx={{ gridColumn: gridColumn, gridRow: gridRow }}
    >
      <InputLabel id={name}>Sélectionner les {name}</InputLabel>
      <Select
        name={name}
        labelId={name}
        id={name}
        value={value}
        multiple
        label={name}
        onChange={change}
        sx={{ gridColumn: gridColumn, gridRow: gridRow }}
        error={!!touched && !!error}
      >
        {items.map((item) => (
          <MenuItem
            key={item._id}
            value={item._id}
            sx={{
              opacity: value.includes(item._id) ? 1 : 0.6,
              backgroundColor: value.includes(item._id)
                ? "black !important"
                : "transparent",
              color: value.includes(item._id) ? "white" : "inherit",
            }}
          >
            {item.name}
          </MenuItem>
        ))}
      </Select>
      {touched && error && (
        <FormHelperText sx={{ color: "error.main" }}>{error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default MultipleSelectComponent;
