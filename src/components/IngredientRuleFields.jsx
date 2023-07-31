import { TextField } from "@mui/material";

const IngredientRuleFields = ({ type, onNumberOfFreeChange, onMaxIngredientChange }) => {
    return (
      <>
        <TextField
          type="number"
          label="Nombre gratuit"
          value={type.numberOfFree}
          onChange={(e) => onNumberOfFreeChange(type._id, parseInt(e.target.value, 10))}
        />
        <TextField
          type="number"
          label="Nombre maximum d'ingrédients"
          value={type.maxIngrediant}
          onChange={(e) => onMaxIngredientChange(type._id, parseInt(e.target.value, 10))}
        />
      </>
    );
  };
  
  export default IngredientRuleFields;