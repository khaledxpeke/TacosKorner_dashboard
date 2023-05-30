import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCategory,
  getCategoriesError,
  getCategoriesStatus,
  updateStatus,
  getCategoriesSuccess,
} from "../features/categorySlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const AlertDialog = ({ open, handleClose, name, cardId }) => {
  const dispatch = useDispatch();
  const status = useSelector(getCategoriesStatus);
  const error = useSelector(getCategoriesError);
  const success = useSelector(getCategoriesSuccess);
  const onDelete = () => {
    dispatch(deleteCategory(cardId));
  };
  useEffect(() => {
    if (status === "deleteSuccess") {
      toast.success(success);
      dispatch(updateStatus());
      handleClose();
    } else if (status === "deleteError") {
      toast.error(error);
      handleClose();
    }
  }, [status, error, success, dispatch, handleClose]);
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
