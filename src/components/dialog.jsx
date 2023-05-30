import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useDispatch } from "react-redux";
const AlertDialog = ({ open, handleClose, name, deleteData }) => {
  const dispatch = useDispatch();
  const onDelete = () => {
    dispatch(deleteData);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Supprimer</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Voulez vous supprimer ce {name}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="error"
          style={{ color: "white" }}
          onClick={handleClose}
        >
          Non
        </Button>
        <Button
          variant="contained"
          color="success"
          style={{ color: "white" }}
          onClick={onDelete}
          autoFocus
        >
          Oui
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AlertDialog;
