import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SelectComponent = ({name,items,value,change}) => {
  return (
    <FormControl
      variant="filled"
      fullWidth
      sx={{ gridColumn: "span 1", gridRow: "3 / span 1" }}
    >
      <InputLabel id={name}>Selectioner une {name}</InputLabel>
      <Select
        name={name}
        labelId={name}
        id={name}
        value={value}
        label={name}
        // multiple
        onChange={change}
        sx={{ gridColumn: "span 1" }}
      >
        {items.map((item) => (
          <MenuItem
            key={item._id}
            value={item._id}
            sx={{
              opacity: value === item._id ? 1 : 0.5,
              backgroundColor:
              value === item._id
                  ? "black !important"
                  : "transparent",
              color: value === item._id ? "white" : "inherit",
            }}
          >
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;
